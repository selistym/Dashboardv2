import React from 'react';

import '../styles/main.sass';

import PortfolioContainer from '../components/Portfolio';
import AuthenticatedPage from '../components/Layout/AuthenticatedPage';

class PortfolioPage extends AuthenticatedPage {
  static async getInitialProps({ query }) {
    return { securityId: query.id };
  }
  render() {
    return <PortfolioContainer {...this.props} />;
  }
}

export default PortfolioPage;
