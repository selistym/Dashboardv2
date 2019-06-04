import React from 'react';

import AuthenticatedPage from '../components/Layout/AuthenticatedPage';
import Layout from '../components/Layout';

class AccountPage extends AuthenticatedPage {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.session.user) return super.userNotLoggedIn();

    return (
      <Layout {...this.props} navMenu={true} signInBtn={false} title={'Account'} description={'Account'}>
        <div style={{ height: 5000 }}>
          <h1>User profile</h1>
          <pre>{JSON.stringify(this.props.session.user, null, 2)}</pre>
        </div>
      </Layout>
    );
  }
}

export default AccountPage;
