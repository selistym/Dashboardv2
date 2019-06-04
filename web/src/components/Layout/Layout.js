import React from 'react';
import PropTypes from 'prop-types';

import Head from './Head';
import Header from './Header';
import Footer from './Footer';

import '../../styles/main.sass';

const Layout = ({
  session,
  title = '',
  description = '',
  children,
  navMenu = true,
  headerSection = true,
  footer = true,
  signInBtn = true
}) => {
  return (
    <>
      <Head title={title} description={description} />
      {navMenu && <Header session={session} signinBtn={signInBtn} />}
      <div className="container" style={{ minHeight: '505px' }}>
        {headerSection && (
          <section className="section-home" style={{ marginBottom: '20px' }}>
            <h1 className="has-text-centered has-text-weight-bold text-gray fz-26">{description.toUpperCase()}</h1>
          </section>
        )}
        {children}
      </div>
      {footer && <Footer />}
    </>
  );
};

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  session: PropTypes.object.isRequired,
  navMenu: PropTypes.bool,
  signInBtn: PropTypes.bool,
  container: PropTypes.bool,
  children: PropTypes.object,
  headerSection: PropTypes.bool,
  footer: PropTypes.bool
};

export default Layout;
