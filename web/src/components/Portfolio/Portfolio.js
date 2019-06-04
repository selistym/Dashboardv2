import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const Portfolio = ({ subscribeToSecurities, securities }) => {
  useEffect(() => {
    subscribeToSecurities();
  });
  return (
    <div className={'content'}>
      <ul>
        {securities.map(s => (
          <li key={s.id}>
            <Link href={`/security/${s.id}`}>
              <a>{s.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

Portfolio.propTypes = {
  securities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      liveData: PropTypes.shape({
        last: PropTypes.number
      }).isRequired
    })
  ),
  subscribeToSecurities: PropTypes.func.isRequired
};

export default Portfolio;
