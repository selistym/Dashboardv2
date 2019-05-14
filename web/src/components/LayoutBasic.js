import React from 'react';
import PropTypes from 'prop-types';

import Head from './Head';
import Footer from './Footer';
import Header from './Header';

import '../styles/main.sass';

const LayoutBasic = ({ title, description, session, children, navMenu, signinBtn }) => (
  <>
    {navMenu && <Head title={title} description={description} />}
    {navMenu && <Header session={session} signinBtn={signinBtn} />}
    {navMenu && (
      <section className="section-home" style={{ marginBottom: '20px' }}>
        <h1 className="container has-text-centered has-text-weight-bold text-gray fz-26">
          {description.toUpperCase()}
        </h1>
      </section>
    )}
    <div className="container" style={{ minHeight: '505px' }}>
      {children}
    </div>
    {navMenu && <Footer />}
  </>
);

LayoutBasic.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  session: PropTypes.object,
  children: PropTypes.object.isRequired,
  navMenu: PropTypes.bool.isRequired,
  signinBtn: PropTypes.bool.isRequired
};
export default LayoutBasic;
