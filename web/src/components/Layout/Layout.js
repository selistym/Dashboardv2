import React from 'react';
import PropTypes from 'prop-types';
import LeftNavbar from '../LeftNavbar';
import Head from './Head';
import Footer from '../Layout/Footer';
import '../../styles/main.sass';

const Layout = ({ session, title = '', description = '', children, headerSection = true }) => {
  return (
    <>
      <Head title={title} description={description} />
      {/* {navMenu && <Header session={session} signinBtn={signInBtn} />} */}
      <div className="columns">
        <div className="column is-2" style={{ backgroundColor: '#fff' }}>
          <LeftNavbar session={session} />
        </div>
        <div className="column is-10">
          <div className="container">
            {headerSection && (
              <section className="section-home" style={{ marginBottom: '20px' }}>
                <h1 className="has-text-centered has-text-weight-bold text-gray fz-26">{description.toUpperCase()}</h1>
              </section>
            )}
            {children}
          </div>
        </div>
      </div>
      {<Footer />}
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
