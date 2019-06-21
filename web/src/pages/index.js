import React from 'react';

import Layout from '../components/Layout';

import SecuritySearch from '../components/SecuritySearch';
import AuthenticatedPage from '../components/Layout/AuthenticatedPage';

class SecuritySearchPage extends AuthenticatedPage {
  render() {
    const { session } = this.props;    
    return (
      <Layout
        {...this.props}
        session={session}
        title={'VEB - Overview'}
        description={'Overview'}
        signInBtn={true}
        footer={true}
      >
        <SecuritySearch />
      </Layout>
    );
  }
}

export default SecuritySearchPage;
