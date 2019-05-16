import React, { useContext ,useEffect, useRef, useMemo, useCallback, useState} from 'react';

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
  const flagRefetch = useRef(true);

  useEffect(() => inputEl.current && inputEl.current.focus && inputEl.current.focus());

  const handleFilterTextChange = async text => {
    await dispatch({type: 'CHANGE_FILTER_TEXT', text: text});
    flagRefetch.current = true;
  }
  const handleFilterYearChange = async year => {
    await dispatch({type: 'CHANGE_FILTER_YEAR', year: year});  
    flagRefetch.current = true;
  }
  const handleDropDownItemChange = (filterAction, checkedItem) => {
    dispatch({type: filterAction, filter: checkedItem});
    flagRefetch.current = true;
  }
  const loadMoreSecurities = (securities, fetchMore) => {
    flagRefetch.current = false;
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
  return (
    <div>
      <div className="columns is-mobile" style={{ justifyContent: 'center' }}>
        <div className="column is-three-quarters-mobile is-two-thirds-tablet is-two-thirds-desktop is-two-thirds-widescreen is-two-thirds-fullhd"
          style={{ display: 'flex', justifyContent: 'center' }} data-testid="test-input">
          <p className="control has-icons-left" style={{ width: 'inherit', paddingRight: 'inherit' }}>
              {useMemo(() => <input className="input" type="text" value={store.securityFilterText} onChange={async event => await handleFilterTextChange(event.target.value)} ref={inputEl}
                placeholder="Search a specific stock... "/>, [store.securityFilterText])}
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
          <div className="column" style={{ paddingTop: '25px' }}>
              <CustomDropdown key={0} title={titles[0]} items={securityFilterCheckboxs[0]} index={0} hasSlider={false} initial={store.securityFilterLargeCap} onDropDownChange={handleDropDownItemChange} />
          </div>
          <div className="column" style={{ paddingTop: '25px' }}>
              <CustomDropdown key={1} title={titles[1]} items={securityFilterCheckboxs[1]} index={1} hasSlider={false} initial={store.securityFilterValue} onDropDownChange={(e, b) => handleDropDownItemChange(e, b)} />
          </div>
          <div className="column" style={{ paddingTop: '25px' }}>              
              <CustomDropdown key={2} title={titles[2]} items={securityFilterCheckboxs[2]} index={2} hasSlider={true} initial={store.securityFilterArea} onDropDownChange={(e, b) => handleDropDownItemChange(e, b)} />
          </div>
          <div className="column" style={{ paddingTop: '25px' }}>
              <CustomDropdown key={3} title={titles[3]} items={securityFilterCheckboxs[3]} index={3} hasSlider={false} initial={store.securityFilterSector} onDropDownChange={handleDropDownItemChange} />
          </div>
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
              sectors: store.securityFilterSector
            },
            offset: 0,
            limit: SECURITIES_PER_PAGE
          }}>
          {({ loading, error, data: { securities }, refetch, fetchMore}) => {
            if (error) return <ErrorMessage message="Error loading posts." />;
            if (loading) return <Loading />;
            console.log(flagRefetch.current, ' refetch flag')
            if(flagRefetch.current){
              refetch();
            }
            const areMoreSecurities = securities ? securities.length < 3600 : 0;
            if(securities){
              return ( 
                  <section style={{ paddingTop: '20px' }}>                
                      <div className="columns is-mobile" style={{ display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around' }} data-testid="filtered-securities">
                        {securities.map(s => 
                          store.securityFilterSector && store.securityFilterSector.indexOf(s.sector) != -1 ? 
                            <LocalPortfolioContainer key={s.id} index={s.id} security={s}/>
                            : <></>)
                        }
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
              return (<></>);
            }
          }}
      </Query>
    </div>
  );
};


export default withBaseData(SecuritySearch);
