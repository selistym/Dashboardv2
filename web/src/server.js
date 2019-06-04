require('dotenv').config();
const { readFileSync } = require('fs');

const path = require('path');

const glob = require('glob');
const accepts = require('accepts');

// Polyfill Node with `Intl` that has data for all locales
// https://formatjs.io/guides/runtime-environments/#server
const IntlPolyfill = require('intl');
Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

const supportedLanguages = glob.sync('./lang/*.json').map(f => path.basename(f, '.json'));

// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
const localeDataCache = new Map();
const getLocaleDataScript = locale => {
  const lang = locale.split('-')[0];
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`);
    const localeDataScript = readFileSync(localeDataFile, 'utf8');
    localeDataCache.set(lang, localeDataScript);
  }
  return localeDataCache.get(lang);
};

const express = require('express');

const next = require('next');
const routes = require('./routes');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = routes.getRequestHandler(app);

const getMessages = locale => {
  return require(`./lang/${locale}.json`);
};

app.prepare().then(() => {
  const server = express();

  if (!dev) {
    server.set('trust proxy', 1);
  }

  server.all('/_next/*', (req, res) => {
    //let nextRequestHandler = app.getRequestHandler();
    //return nextRequestHandler(req, res);
    handler(req, res);
  });

  const bodyParser = require('body-parser');
  const bodyParserJsonOptions = {};
  const bodyParserUrlEncodedOptions = { extended: true };

  server.use(bodyParser.json(bodyParserJsonOptions));
  server.use(bodyParser.urlencoded(bodyParserUrlEncodedOptions));

  // if mongo not present don't setup passport, session, lusca
  if (process.env.MONGO_URL !== undefined) {
    const passport = require('passport');
    const Strategy = require('passport-oauth2').Strategy;
    const request = require('request');

    Strategy.prototype.userProfile = async (accessToken, done) => {
      const options = {
        url: process.env.OAUTH2_IDP + '/connect/userinfo',
        auth: {
          bearer: accessToken
        }
      };
      request(options, (err, res, body) => {
        if (err || res.statusCode !== 200) {
          return done(err);
        }
        const info = JSON.parse(body);
        const result = { id: info.sub, name: info.name, email: info.email };

        return done(null, result);
      });
    };

    const expressSession = require('express-session');
    const MongoStore = require('connect-mongo')(expressSession);

    server.use(
      expressSession({
        secret: process.env.SESSION_SECRET,
        store: new MongoStore({
          url: process.env.MONGO_URL,
          autoRemove: 'interval',
          autoRemoveInterval: 10,
          collection: 'sessions',
          stringify: false
        }),
        resave: false,
        rolling: false,
        saveUninitialized: false,
        cookie: {
          path: '/',
          httpOnly: true,
          secure: 'auto',
          maxAge: 60000 * 60 * 24 * 7
        }
      })
    );

    passport.serializeUser((user, next) => {
      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken
      };
      return next(null, sessionUser);
    });
    passport.deserializeUser(async (user, next) => {
      // only return non sensitive fields.
      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      next(null, sessionUser);
    });

    const strategyOptions = {
      authorizationURL: process.env.OAUTH2_IDP + '/connect/authorize',
      tokenURL: process.env.OAUTH2_IDP + '/connect/token',
      clientID: process.env.OAUTH2_CLIENT_ID,
      clientSecret: process.env.OAUTH2_CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL + '/auth/oauth/oauth2/callback',
      passReqToCallback: true
    };

    passport.use(
      new Strategy(strategyOptions, (req, accessToken, refreshToken, params, profile, next) => {
        try {
          if (accessToken) profile.accessToken = accessToken;
          if (refreshToken) profile.refreshToken = refreshToken;
          if (params) profile.params = params;

          return next(null, profile);
        } catch (err) {
          return next(err, false);
        }
      })
    );

    server.use(passport.initialize());
    server.use(passport.session());

    const lusca = require('lusca');
    server.use(lusca.csrf());

    server.get(
      '/auth/oauth/oauth2',
      passport.authenticate('oauth2', { scope: ['openid', 'profile', 'email', 'offline_access'] })
    );

    server.get(
      '/auth/oauth/oauth2/callback',
      passport.authenticate('oauth2', {
        successRedirect: '/auth/callback?action=signin&service=oauth2',
        failureRedirect: '/auth/error?action=signin&type=oauth&service=oauth2'
      })
    );

    server.get('/auth/csrf', (req, res) => {
      return res.json({
        csrfToken: res.locals._csrf
      });
    });

    server.get('/auth/session', (req, res) => {
      let session = {
        maxAge: 60000 * 60 * 24 * 7,
        revalidateAge: 60000,
        csrfToken: res.locals._csrf
      };

      // strip out field we don't want in local storage of the client browser such as tokens
      if (req.user) {
        session.user = {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
        };
      }
      return res.json(session);
    });

    server.post(`/auth/signout`, (req, res) => {
      // Log user out with Passport and remove their Express session
      req.logout();
      req.session.destroy(() => {
        return res.redirect('/auth/callback?action=signout');
      });
    });
  }

  const options = {
    root: path.join(__dirname, '/static'),
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    }
  };
  server.get('/robots.txt', (req, res) => res.status(200).sendFile('robots.txt', options));

  server.get('*', (req, res) => {
    const accept = accepts(req);
    const locale = accept.language(accept.languages(supportedLanguages)) || 'en';
    req.locale = locale;
    req.localeDataScript = getLocaleDataScript(locale);
    req.messages = dev ? {} : getMessages(locale);

    handler(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
  });
});
