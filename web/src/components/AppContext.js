import React, { useReducer, createContext } from 'react';

let AppContext = createContext(null);

const allSectors = [
  {
    code: 'CommercialServices',
    name: 'Commercial Services'
  },
  {
    code: 'Communications',
    name: 'Communications'
  },
  {
    code: 'ConsumerDurables',
    name: 'Consumer Durables'
  },
  {
    code: 'ConsumerNonDurables',
    name: 'Consumer Non Durables'
  },
  {
    code: 'ConsumerServices',
    name: 'Consumer Services'
  },
  {
    code: 'DistributionServices',
    name: 'Distribution Services'
  },
  {
    code: 'ElectronicTechnology',
    name: 'Electronic Technology'
  },
  {
    code: 'EnergyMinerals',
    name: 'Energy Minerals'
  },
  {
    code: 'Finance',
    name: 'Finance'
  },
  {
    code: 'HealthServices',
    name: 'Health Services'
  },
  {
    code: 'HealthTechnology',
    name: 'Health Technology'
  },
  {
    code: 'IndustrialServices',
    name: 'Industrial Services'
  },
  {
    code: 'Miscellaneous',
    name: 'Miscellaneous'
  },
  {
    code: 'NonEnergyMinerals',
    name: 'Non Energy Minerals'
  },
  {
    code: 'ProcessIndustries',
    name: 'Process Industries'
  },
  {
    code: 'ProducerManufacturing',
    name: 'Producer Manufacturing'
  },
  {
    code: 'RetailTrade',
    name: 'Retail Trade'
  },
  {
    code: 'TechnologyServices',
    name: 'Technology Services'
  },
  {
    code: 'Transportation',
    name: 'Transportation'
  },
  {
    code: 'Unknown',
    name: 'Unknown'
  },
  {
    code: 'Utilities',
    name: 'Utilities'
  }
];


const initialSecurityState = {
  allSectors,
  securityFilterText: '',
  securityFilterYear: 2018,
  securityFilterMarketSize: ['LARGE', 'MEDIUM', 'SMALL'],
  securityFilterValue: [],
  securityFilterArea: ['Dividend', 'Growth'],
  securityFilterSector: allSectors.map(s=>s.code),
  navMenu: true,
};

const securityReducer = (state, action) => {
  let replaces = [];
  switch (action.type) {
    case 'CHANGE_FILTER_TEXT':
      return state.securityFilterText !== action.text ? { ...state, securityFilterText: action.text } : state;
    case 'CHANGE_FILTER_YEAR':
      return state.securityFilterYear !== action.year ? { ...state, securityFilterYear: action.year } : state;
    case 'CHANGE_FILTER_MARKETSIZE':
      replaces = state.securityFilterMarketSize;
      if (typeof action.filter === 'object') {
        replaces = action.filter;
      } else {
        if (replaces.indexOf(action.filter) !== -1) {
          replaces = replaces.filter(e => e !== action.filter);
        } else {
          replaces.push(action.filter);
        }
      }
      replaces.sort();
      return { ...state, securityFilterMarketSize: replaces };
    case 'CHANGE_FILTER_VALUE':
      replaces = state.securityFilterValue;
      if (typeof action.filter === 'object') {
        replaces = action.filter;
      } else {
        if (replaces.indexOf(action.filter) !== -1) {
          replaces = replaces.filter(e => e !== action.filter);
        } else {
          replaces.push(action.filter);
        }
      }
      replaces.sort();
      return { ...state, securityFilterValue: replaces };
    case 'CHANGE_FILTER_AREA':
      replaces = state.securityFilterArea;
      if (typeof action.filter === 'object') {
        replaces = action.filter;
      } else {
        if (replaces.indexOf(action.filter) !== -1) {
          replaces = replaces.filter(e => e !== action.filter);
        } else {
          replaces.push(action.filter);
        }
      }
      replaces.sort();
      return { ...state, securityFilterArea: replaces };
    case 'CHANGE_FILTER_SECTOR':
      replaces = state.securityFilterSector;
      if (typeof action.filter === 'object') {
        replaces = action.filter;
      } else {
        if (replaces.indexOf(action.filter) !== -1) {
          replaces = replaces.filter(e => e !== action.filter);
        } else {
          replaces.push(action.filter);
        }
      }
      replaces.sort();
      return { ...state, securityFilterSector: replaces };
    case 'SHOW_NAVMENU':
      return { ...state, navMenu: action.navMenu };
    default:
      throw new Error('Unexpected action');
  }
};
/* Then create a provider Component */
const AppProvider = props => {
  const [store, dispatch] = useReducer(securityReducer, initialSecurityState);
  return <AppContext.Provider value={{ store, dispatch }}>{props.children}</AppContext.Provider>;
};

let AppConsumer = AppContext.Consumer;
export { AppContext, AppProvider, AppConsumer };
