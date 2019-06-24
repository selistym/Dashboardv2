import React from 'react';

import '../styles/main.sass';

import SecurityContainer from '../components/Security';
import AuthenticatedPage from '../components/Layout/AuthenticatedPage';

class SecurityPage extends AuthenticatedPage {
  static async getInitialProps({ req, query }) {    
    const props = await super.getInitialProps({ req, query });
    let parsed = {id: '', name: '', sector: '', ticker: '', liveData: [], factsetData: [], currency: '', country: {code: ''}, calculatedCircular: []};
    
    if(query.short_security){
      parsed = JSON.parse(query.short_security);
    }    
    return { ...props, securityId: query.id, short_security: parsed};
  }
  render() {
    return <SecurityContainer {...this.props} />;
  }
}

export default SecurityPage;
