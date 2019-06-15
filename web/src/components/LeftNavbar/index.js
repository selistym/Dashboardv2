import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';

import UserMenu from '../Layout/UserMenu';

const LeftNavbar = ({ session }) => (
  // <div className="column is-full-mobile is-full-tablet is-2" style={{ backgroundColor: '#888'}}>
  <div>
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <img src="../../static/logo.png" />
    </div>
    {session && session.user && (
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <img style={{ borderRadius: '50%', width: '110px', height: '100px' }} src="../../static/man.png" />
      </div>
    )}
    <div className="has-text-white" style={{ textAlign: 'center' }}>
      {session && session.user && (
        <Link href={'/account'}>
          <a>{session.user.name}</a>
        </Link>
      )}
      <ul>
        <UserMenu session={session} simple={true} />
      </ul>
    </div>
    <div
      style={{
        height: '110px',
        margin: '10px',
        borderWidth: '1px',
        borderTopStyle: 'inset',
        borderBottomStyle: 'outset',
        color: 'gainsboro'
      }}
    >
      <div style={{ padding: '3px', paddingTop: '10px' }}>
        <Link href={'/portfolio'}>
          <a>My Portfolio</a>
        </Link>
      </div>
      <div style={{ padding: '3px' }}>
        <Link href="/">
          <a>Securities</a>
        </Link>
      </div>
      <div style={{ padding: '3px' }}>Scenarios</div>
    </div>
  </div>
);

LeftNavbar.propTypes = {
  session: PropTypes.object.isRequired
};

export default LeftNavbar;
