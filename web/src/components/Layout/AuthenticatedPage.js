import React from 'react';

import NextAuth from '../../lib/auth-client';

import Layout from './index';

class AuthenticatedPage extends React.Component {

  static async getInitialProps({ req }) {
    const session = await NextAuth.init({ req });
    return {
      session
    };
  }

  adminAccessOnly() {
    return (
      <Layout {...this.props} navMenu={true} title={'Access denied'} description={'Access denied'}>
        <div className="content" style={{ height: 500 }}>
          <h1>Access Denied</h1>
          <p className="lead">You must be signed in as an administrator to access this page.</p>
        </div>
      </Layout>
    );
  }

  userNotLoggedIn() {
    return (
      <Layout {...this.props} navMenu={true} title={'Nog logged in'} description={'Not logged in'}>
        <div className="content" style={{ height: 500 }}>
          <h1>Not logged in</h1>
          <p>You must be signed in to access this page.</p>
        </div>
      </Layout>
    );
  }
}

export default AuthenticatedPage;
