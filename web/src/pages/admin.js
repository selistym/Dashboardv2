import React from 'react';

import AuthenticatedPage from '../components/Layout/AuthenticatedPage';
import Layout from '../components/Layout';

export default class extends AuthenticatedPage {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.session.user || this.props.session.user.admin !== true) return super.adminAccessOnly();

    return (
      <Layout {...this.props} navMenu={false}>
        <h1>Administration</h1>
        <p>This is an example read-only admin page which lists user accounts.</p>
        <p>some content</p>
      </Layout>
    );
  }
}
