import React from 'react';

import '../styles/main.sass';

import PortfolioContainer from '../components/Portfolio';
import AuthenticatedPage from '../components/Layout/AuthenticatedPage';
import Layout from '../components/Layout';

class PortfolioPage extends AuthenticatedPage {
  static async getInitialProps({ query }) {
    return { securityId: query.id };
  }
  render() {
    const { session } = this.props;
    return (
      <Layout
        {...this.props}
        session={session}
        title={'VEB - My Portfolio'}
        description={'My Portfolio'}
        navMenu={true}
        signInBtn={true}
        footer={true}
      >
        <PortfolioContainer {...this.props} />
      </Layout>
    );
  }
}

export default PortfolioPage;
