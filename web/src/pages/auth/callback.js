import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';

import Cookies from 'universal-cookie';
import NextAuth from '../../lib/auth-client';

import Layout from '../../components/Layout';
import Loading from '../../components/Loading';

class Callback extends Component {
  static propTypes = {
    redirectTo: PropTypes.string
  };

  static async getInitialProps({ req }) {
    const session = await NextAuth.init({ force: true, req: req });

    const cookies = new Cookies(req && req.headers.cookie ? req.headers.cookie : null);

    // If the user is signed in, we look for a redirect URL cookie and send
    // them to that page, so that people signing in end up back on the page they
    // were on before signing in. Defaults to '/'.
    let redirectTo = '/';

    if (session.user) {
      // Read redirect URL to redirect to from cookies
      redirectTo = cookies.get('redirect_url') || redirectTo;

      // Allow relative paths only - strip protocol/host/port if they exist.
      redirectTo = redirectTo.replace(/^[a-zA-Z]{3,5}:\/{2}[a-zA-Z0-9_.:-]+\//, '');
    }

    return {
      session: session,
      redirectTo: redirectTo
    };
  }

  async componentDidMount() {
    // Get latest session data after rendering on client *then* redirect.
    // The ensures client state is always updated after signing in or out.
    // (That's why we use a callback page)
    await NextAuth.init({ force: true });
    await Router.push(this.props.redirectTo || '/');
  }

  render() {
    // Provide a link for clients without JavaScript as a fallback.
    //console.log(this.props);
    return (
      <Layout {...this.props} title={'VEB'} description={'Loading'}>
        <Loading />
      </Layout>
    );
  }
}

export default Callback;
