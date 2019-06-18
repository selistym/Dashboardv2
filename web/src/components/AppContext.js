import React, { useReducer, createContext } from 'react';
import PropTypes from 'prop-types';

let AppContext = createContext(null);

const allMarketSizes = [
  { code: 'LARGE', name: 'Large Caps' },
  { code: 'MEDIUM', name: 'Medium Caps' },
  { code: 'SMALL', name: 'Small Caps' }
];

const allCountries = [
  {
    code: 'AU',
    name: 'Australië'
  },
  {
    code: 'BE',
    name: 'België'
  },
  {
    code: 'BM',
    name: 'Bermuda'
  },
  {
    code: 'CA',
    name: 'Canada'
  },
  {
    code: 'CL',
    name: 'Chili'
  },
  {
    code: 'CN',
    name: 'China'
  },
  {
    code: 'CW',
    name: 'Curaçao'
  },
  {
    code: 'CY',
    name: 'Cyprus'
  },
  {
    code: 'DK',
    name: 'Denemarken'
  },
  {
    code: 'DE',
    name: 'Duitsland'
  },
  {
    code: 'EG',
    name: 'Egypte'
  },
  {
    code: 'FO',
    name: 'Faeröer'
  },
  {
    code: 'FI',
    name: 'Finland'
  },
  {
    code: 'FR',
    name: 'Frankrijk'
  },
  {
    code: 'GA',
    name: 'Gabon'
  },
  {
    code: 'GE',
    name: 'Georgië'
  },
  {
    code: 'GI',
    name: 'Gibraltar'
  },
  {
    code: 'GL',
    name: 'Groenland'
  },
  {
    code: 'GG',
    name: 'Guernsey'
  },
  {
    code: 'HK',
    name: 'Hong Kong'
  },
  {
    code: 'IE',
    name: 'Ierland'
  },
  {
    code: 'IN',
    name: 'India'
  },
  {
    code: 'IL',
    name: 'Israël'
  },
  {
    code: 'IT',
    name: 'Italië'
  },
  {
    code: 'JE',
    name: 'Jersey'
  },
  {
    code: 'JO',
    name: 'Jordanië'
  },
  {
    code: 'KY',
    name: 'Kaaimaneilanden'
  },
  {
    code: 'CM',
    name: 'Kameroen'
  },
  {
    code: 'LI',
    name: 'Liechtenstein'
  },
  {
    code: 'LU',
    name: 'Luxemburg'
  },
  {
    code: 'VG',
    name: 'Maagdeneilanden'
  },
  {
    code: 'MY',
    name: 'Maleisië'
  },
  {
    code: 'MT',
    name: 'Malta'
  },
  {
    code: 'IM',
    name: 'Man Eiland'
  },
  {
    code: 'MX',
    name: 'Mexico'
  },
  {
    code: 'MC',
    name: 'Monaco'
  },
  {
    code: 'NL',
    name: 'Nederland'
  },
  {
    code: 'NG',
    name: 'Nigeria'
  },
  {
    code: 'NO',
    name: 'Noorwegen'
  },
  {
    code: 'UA',
    name: 'Oekraïne'
  },
  {
    code: 'AT',
    name: 'Oostenrijk'
  },
  {
    code: 'PE',
    name: 'Peru'
  },
  {
    code: 'PT',
    name: 'Portugal'
  },
  {
    code: 'RU',
    name: 'Rusland'
  },
  {
    code: 'SN',
    name: 'Senegal'
  },
  {
    code: 'SG',
    name: 'Singapore'
  },
  {
    code: 'ES',
    name: 'Spanje'
  },
  {
    code: 'TZ',
    name: 'Tanzania'
  },
  {
    code: 'TR',
    name: 'Turkije'
  },
  {
    code: 'GB',
    name: 'Verenigd Koninkrijk'
  },
  {
    code: 'AE',
    name: 'Verenigde Arabische Emiraten'
  },
  {
    code: 'US',
    name: 'Verenigde Staten van Amerika'
  },
  {
    code: 'ZA',
    name: 'Zuid-Afrika'
  },
  {
    code: 'SE',
    name: 'Zweden'
  },
  {
    code: 'CH',
    name: 'Zwitserland'
  }
];



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
  allMarketSizes,
  allSectors,
  allCountries,
  securityFilterText: '',
  securityFilterYear: 2018,
  securityFilterMarketSize: ['LARGE', 'MEDIUM', 'SMALL'],
  securityFilterCountry: ['NL'],
  securityFilterArea: ['Dividend', 'Growth', 'Balance', 'Value'],
  securityFilterSector: allSectors.map(s => s.code),
  navMenu: true
};

const securityReducer = (state, action) => {
  let replaces = [];
  switch (action.type) {
    case 'CHANGE_FILTER_TEXT':
      return state.securityFilterText !== action.text ? { ...state, securityFilterText: action.text } : state;
    case 'CHANGE_FILTER_YEAR':
      return state.securityFilterYear !== action.year ? { ...state, securityFilterYear: action.year } : state;
    case 'CHANGE_FILTER_MARKETSIZE':
      replaces = [...state.securityFilterMarketSize];
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
    case 'CHANGE_FILTER_COUNTRY':
      replaces = [...state.securityFilterCountry];
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
      return { ...state, securityFilterCountry: replaces };
    case 'CHANGE_FILTER_AREA':
      replaces = [...state.securityFilterArea];
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
      replaces = [...state.securityFilterSector];
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

AppProvider.propTypes = {
  children: PropTypes.object.isRequired
};

let AppConsumer = AppContext.Consumer;
export { AppContext, AppProvider, AppConsumer };
