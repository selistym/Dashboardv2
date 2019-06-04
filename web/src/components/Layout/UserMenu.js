import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';
import Router from 'next/router';

import NextAuth from '../../lib/auth-client';

import Cookies from 'universal-cookie';

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignoutSubmit = this.handleSignoutSubmit.bind(this);
  }

  static propTypes = {
    simple: PropTypes.bool,
    session: PropTypes.shape({
      csrfToken: PropTypes.string
    }),
    signInBtn: PropTypes.bool
  };

  handleSignIn() {
    const cookies = new Cookies();
    cookies.set('redirect_url', window.location.pathname, { path: '/' });
    window.location = '/auth/oauth/oauth2';
    // todo: verify with starter project
    //Router.push('/auth/oauth/oauth2')
  }

  async handleSignoutSubmit(event) {
    event.preventDefault();

    // Save current URL so user is redirected back here after signing out
    const cookies = new Cookies();
    cookies.set('redirect_url', window.location.pathname, { path: '/' });

    await NextAuth.signout();
    Router.push('/');
  }

  render() {
    const { session, simple } = this.props;
    if (simple) {
      return session && session.user ? (
        <div>
          <form id="signout" method="post" action="/auth/signout" onSubmit={this.handleSignoutSubmit}>
            <input name="_csrf" type="hidden" value={this.props.session.csrfToken} />
            <button className="button" type="submit">
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <button className="button" style={{ textDecoration: 'none' }} onClick={() => this.handleSignIn()}>
          Sign in
        </button>
      );
    }
    if (session && session.user) {
      // If signed in display user dropdown menu
      const session = this.props.session;
      return (
        <ul className="list-inline">
          <li>
            <Link href="/account">
              <a>{session.user.name || session.user.email}</a>
            </Link>
          </li>
          <AdminMenuItem {...this.props} />
          <li>
            <form id="signout" method="post" action="/auth/signout" onSubmit={this.handleSignoutSubmit}>
              <input name="_csrf" type="hidden" value={this.props.session.csrfToken} />
              <button className="button" type="submit">
                Sign Out
              </button>
            </form>
          </li>
        </ul>
      );
    }
    if (this.props.signInBtn === false) {
      // If not signed in, don't display sign in button if disabled
      return null;
    } else {
      // If not signed in, display sign in button
      return (
        <ul className="list-inline">
          <li>
            <button className="button is-text" style={{ textDecoration: 'none' }} onClick={() => this.handleSignIn()}>
              Inloggen
            </button>
          </li>
        </ul>
      );
    }
  }
}

const AdminMenuItem = ({ session }) => {
  if (session && session.user && session.user.admin === true) {
    return (
      <li>
        <Link prefetch href="/admin">
          <a>Admin</a>
        </Link>
      </li>
    );
  }
  return null;
};

AdminMenuItem.propTypes = {
  session: PropTypes.object.isRequired
};
