import React from 'react';
import PropTypes from 'prop-types';

import LeftNavbar from '../LeftNavbar';
import Footer from '../Layout/Footer';

const SecurityLayout = ({ children, security, session }) => (
  <div>
    <div className="columns is-desktop" style={{ marginBottom: '0px' }}>
      <LeftNavbar security={security} session={session}/>
      <div>
        <div
          className="column is-full-mobile is-full-tablet is-four-fifths-desktop is-10-widescreen is-10-fullhd"
          style={{ padding: '50px' }}
        >
          {children}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

SecurityLayout.propTypes = {
  children: PropTypes.object.isRequired,
  security: PropTypes.shape({
    calculatedCircular: PropTypes.arrayOf(
      PropTypes.shape({
        Year: PropTypes.number.isRequired,
        Total: PropTypes.number.isRequired,
        Dividend: PropTypes.number.isRequired,
        Balance: PropTypes.number.isRequired,
        Growth: PropTypes.number.isRequired,
        Value: PropTypes.number.isRequired
      })
    )
  }).isRequired,
  session: PropTypes.object.isRequired
};

export default SecurityLayout;
