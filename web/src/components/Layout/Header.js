import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'next/router';

import UserMenu from './UserMenu';

const Header = ({ session, signInBtn }) => (
  <nav className="navbar is-transparent">
    <div className="container">
      <div className="navbar-brand">
        <a>
          <img src="/static/logo.png" alt="" className="logo" width="170" />
        </a>
        <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div id="navbarExampleTransparentExample" className="navbar-menu">
        <div className="navbar-center" />
        <div className="navbar-2" />
        <div className="navbar-start" />
        <div className="navbar-end">
          <div className="navbar-item">
            <UserMenu session={session} signinBtn={signInBtn} />
          </div>
        </div>
      </div>
    </div>
  </nav>
);

Header.propTypes = {
  session: PropTypes.object,
  signInBtn: PropTypes.bool
};

export default withRouter(Header);
