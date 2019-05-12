import React, { useContext } from 'react';
import Link from 'next/link';
import RoundGraph from '../RoundGraph';
import { AppContext } from '../AppContext';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

export const TOGGLE_LOCAL_PORTFOLIO_MUTATION = gql`
  mutation ToggleLocalPortfolio($id: String!) {
    toggleLocalPortfolio(id: $id) @client
  }
`;

const LocalPortfolioContainer = props => {
  const { security } = props;

  return (
    <Mutation mutation={TOGGLE_LOCAL_PORTFOLIO_MUTATION} variables={{ id: security.id }}>
      {toggleLocalPortfolio => (
        <LocalPortfolio {...props} toggleLocalPortfolio={() => toggleLocalPortfolio(security.id)} />
      )}
    </Mutation>
  );
};

const LocalPortfolio = ({ security, index, toggleLocalPortfolio }) => {

  let {store} = useContext(AppContext);
  let curData = security.calculatedCircular ? security.calculatedCircular.filter(e => e.Year === store.securityFilterYear)[0] : null;
  
  return (
    <div
      className="box has-text-grey"
      key={security.id}
      style={{ borderRadius: '1px', height: '320px', padding: '10px' }}
    >
      <div className="columns" style={{ width: '230px', height: '28px' }}>
        <div className="column is-8">
          <Link key={security.id} href={`/security?id=${security.id}`} as={`/security/${security.id}`}>
            <h3
              className="subtitle is-5 has-text-weight-bold has-text-grey"
              style={{
                width: '130px',
                height: '50px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
            >
              {security.name}
            </h3>
          </Link>
        </div>
        <div className="column is-2">
          <a
            className={"button is-dark is-small has-text-weight-bold " + index}
            id={'addbutton' + index}
            style={{ backgroundColor: '#7d7d7d' }}
            onClick={() => {console.log(index, 'add button'); toggleLocalPortfolio();}}
          >
            {security.isInLocalPortfolio ? '-' : '+'}
          </a>
        </div>
        <div className="column is-1">
          <Link key={security.id} href={`/security?id=${security.id}`} as={`/security/${security.id}`}>
            <a className="button is-dark is-small has-text-weight-bold" style={{ backgroundColor: '#7d7d7d' }}>
              ...
            </a>
          </Link>
        </div>
      </div>
      <div style={{ height: '18px', fontSize: '11pt' }}>€100 +2.76%</div>
      <div style={{ height: '2px', fontSize: '11pt' }}>{security.sector}</div>
      <hr />
      <div className={'RoundGraph' + security.id} style={{ width: '230px', height: '200px' }}>
        {curData != null ? (
          <RoundGraph key={security.id} idx={security.id + index} params={curData} filters={store.securityFilter[2]} />
        ) : (
          <p>No data</p>
        )}
      </div>
    </div>
  );
};
export default LocalPortfolioContainer;
