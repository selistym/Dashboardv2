import React, { useContext ,useEffect, useRef, memo, useCallback, useState} from 'react';

import LocalPortfolioContainer from '../LocalPortfolio';
import CustomDropdown from '../CustomDropdown';
import ErrorMessage from '../ErrorMessage';
import SingleSlider from '../SingleSlider';

import Loading from '../Loading';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
library.add(faSpinner);
library.add(faSearch);

import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import withBaseData from '../../lib/with-base-data';
import { AppContext } from '../AppContext';

const SECURITIES_PER_PAGE = 10;
// you will export this query because when you create the mutation,
// you can refetch this query when doing mutations like add to portfolio
export const SECURITIES_QUERY = gql`
  query Securities($filter: SecurityFilterInput, $offset: Int, $limit: Int) {
    securities(filter: $filter, offset: $offset, limit: $limit) @connection(key: "security", filter: ["filter"]) {
      id
      name
      sector
      calculatedCircular {
        Year
        Total
        Dividend
        Balance
        Growth
        Value
      }
      isInLocalPortfolio @client
    }
  }
`;

const SecuritySearch = ({ allSectors }) => {  
  //for security filter checkboxs
  const securityFilterCheckboxs = [
    [      
      { code: 'A0', name: 'A0', __typename: 'LargeCap'},
      { code: 'A1', name: 'A1', __typename: 'LargeCap'},
      { code: 'A2', name: 'A2', __typename: 'LargeCap'},
      { code: 'A3', name: 'A3', __typename: 'LargeCap'}
    ],[  
      { code: 'B0', name: 'B0', __typename: 'Value'},
      { code: 'B1', name: 'B1', __typename: 'Value'},
      { code: 'B2', name: 'B2', __typename: 'Value'},
      { code: 'B3', name: 'B3', __typename: 'Value'}
    ],[  
      { code: 'Dividend', name: 'Dividend', __typename: 'Area'},
      { code: 'Balance', name: 'Balance', __typename: 'Area'},
      { code: 'Growth', name: 'Growth', __typename: 'Area'},
      { code: 'Value', name: 'Value', __typename: 'Area'}
    ], allSectors
  ];
  
  const titles = ["Large caps", "All values", "All areas", "All sectors"];
  const years = [2013, 2014, 2015, 2016, 2017, 2018];
  
  let {store, dispatch} = useContext(AppContext);
  const inputEl = useRef();

  useEffect(() => inputEl.current && inputEl.current.focus && inputEl.current.focus());

  const handleFilterTextChange = async text => await dispatch({type: 'CHANGE_FILTER_TEXT', text: text});
  const handleFilterYearChange = async year => await dispatch({type: 'CHANGE_FILTER_YEAR', year: year});  
  
  return (
    <div>
      <div className="columns is-mobile" style={{ justifyContent: 'center' }}>
        <div className="column is-three-quarters-mobile is-two-thirds-tablet is-two-thirds-desktop is-two-thirds-widescreen is-two-thirds-fullhd"
          style={{ display: 'flex', justifyContent: 'center' }} data-testid="test-input">
          <p className="control has-icons-left" style={{ width: 'inherit', paddingRight: 'inherit' }}>
              <input className="input" type="text" value={store.securityFilterText} onChange={async event => await handleFilterTextChange(event.target.value)} ref={inputEl}
                placeholder="Search a specific stock... "/>
          </p>
          <button className="button" style={{ backgroundColor: '#b9b9b9', color: 'white', fontStyle: 'italic' }}>Use VEB-filter</button>
        </div>
      </div>
      <div className="columns is-mobile">
        <div className="column">
          <h3 className="subtitle is-6 has-text-centered" style={{ height: '20px', color: '#a9a9a9' }}>
            All stocks show an average rating score based on Dividend, Balance, Growth and Value.
          </h3>
        </div>        
      </div>
      <div className="columns is-mobile" style={{ display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around' }}>
        {securityFilterCheckboxs.map((items, p) => (
          <div key={p} className="column" style={{ paddingTop: '25px' }}>
              <CustomDropdown key={p} title={titles[p]} items={items} index={p} hasSlider={true}/>
          </div>))} 
          <div className="column">
              <SingleSlider onChangeYear={handleFilterYearChange} initYear={store.securityFilterYear} width={270} height={70} years={years} />
          </div>
      </div>
      {console.log(store, 'query')}
      <Query query={SECURITIES_QUERY}
          variables={{
            filter: {
              name: store.securityFilterText,
              year: store.securityFilterYear,
              sectors: store.securityFilter[3] //0: LargeCap, 1: Value, 2: value, 3 : Sectors
            },
            offset: 0,
            limit: SECURITIES_PER_PAGE
          }}>
          {({ loading, error, data: { securities }, fetchMore }) => {
            if (error) return <ErrorMessage message="Error loading posts." />;
            if (loading) return <Loading />;
            console.log(securities, 'securities query')
            const areMoreSecurities = securities ? securities.length < 3600 : 0;
            if(securities){
              return ( 
                  <section style={{ paddingTop: '20px' }}>                
                      <div className="columns is-mobile" style={{ display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around' }} data-testid="filtered-securities">
                        {securities.map((s, k) => store.securityFilter[3] && store.securityFilter[3].indexOf(s.sector) != -1 ? <LocalPortfolioContainer key={s.id} index={s.id} security={s}/> : <></>)}
                      </div>
                      {areMoreSecurities > 0 ? (
                        <button className="button" onClick={() => loadMoreSecurities(securities, fetchMore)} style={{ backgroundColor: '#b9b9b9', color: 'white' }}>
                          {loading ? 'Loading...' : 'Show More '}
                        </button>
                        ) : ''
                      }              
                  </section>
              );
            }else{
              return (<>No fetch data...</>);
            }
          }}
      </Query>
    </div>
  );
};
function loadMoreSecurities(securities, fetchMore) {
  fetchMore({
    variables: {
      offset: securities.length
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return prev;
      }
      return Object.assign({}, prev, {
        // Append the new posts results to the old one
        securities: [...prev.securities, ...fetchMoreResult.securities]
      });
    }
  });
}

export default withBaseData(SecuritySearch);
