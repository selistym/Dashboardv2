import React from 'react';
import Link from 'next/link';
import AuthenticatedPage from '../../components/Layout/AuthenticatedPage';

export default class extends AuthenticatedPage {
  static async getInitialProps({ req, query }) {
    let props = await super.getInitialProps({ req });
    props.action = query.action || null;
    props.type = query.type || null;
    props.service = query.service || null;
    return props;
  }

  render() {
    if (this.props.action === 'signin' && this.props.type === 'oauth') {
      return (
        <div>
          <h1>Unable to sign in</h1>
          <p>An account associated with your email address already exists.</p>
        </div>
      );
    } else if (this.props.action === 'signin' && this.props.type === 'token-invalid') {
      return (
        <div>
          <h1>Link not valid</h1>
          <p>This sign in link is no longer valid.</p>
          <p className="lead">
            <Link href="/auth">
              <a>Get a new sign in link</a>
            </Link>
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Error signing in</h1>
          <p>An error occured while trying to sign in.</p>
          <p>
            <Link href="/auth">
              <a>Sign in with email or another service</a>
            </Link>
          </p>
        </div>
      );
    }
  }
}
