import React from 'react';
import PropTypes from 'prop-types';

import LeftNavbar from '../LeftNavbar';
import Footer from '../Layout/Footer';

const SecurityLayout = ({ children, security, session }) => (
  <div>
    <div className="columns" style={{ marginBottom: '0px' }}>
      <div className="column is-2" style={{ backgroundColor: '#fff' }}>
        <LeftNavbar security={security} session={session} />
      </div>
      <div className="column is-10">
        <div
          className="column is-full-mobile is-full-tablet is-12-desktop is-12-widescreen is-11-fullhd"
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
