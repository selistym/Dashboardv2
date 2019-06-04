const withSass = require('@zeit/next-sass');

module.exports = withSass({
  debug: true,
  entry: ['./sdocs.js'],
  output: {
    filename: './[name].bundle.js'
  },
  module: {
    loaders: [{ test: /\.css$/, loader: 'style-loader!css-loader' }]
  },
  serverRuntimeConfig: {
    mongoUrl: process.env.MONGO_URL,
    oauth2ClientId: process.env.OAUTH2_CLIENT_ID,
    oauth2ClientSecret: process.env.OAUTH2_CLIENT_SECRET,
    sessionSecret: process.env.SESSION_SECRET
  },
  publicRuntimeConfig: {
    graphApi: process.env.GRAPH_API||'https://vde-app4.app.veb.net/graphql',
    graphWsApi: process.env.GRAPH_WS_API||'wss://vde-app4.app.veb.net/graphql',
    serverUrl: process.env.SERVER_URL||'http://localhost:3000',
    oauth2Idp: process.env.OAUTH2_IDP
  },
  webpack: function(cfg) {
    const originalEntry = cfg.entry;
    cfg.entry = async () => {
      const entries = await originalEntry();

      if (entries['main.js'] && !entries['main.js'].includes('./lib/polyfills.js')) {
        entries['main.js'].unshift('./lib/polyfills.js');
      }

      return entries;
    };

    return cfg;
  }
});
