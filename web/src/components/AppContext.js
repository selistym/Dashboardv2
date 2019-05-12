import React, {useReducer, createContext} from 'react';

let AppContext = createContext(null);

const initialSecurityState = {
    securityFilterText: '',
    securityFilterYear: 2018,
    securityFilter: [
      [''],
      [''],
      ['Dividend', 'Growth'],
      ['CommercialServices', 'Communications']
    ],
    navMenu: true
};

const securityReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_FILTER_TEXT':
      return state.securityFilterText != action.text ? { ...state, securityFilterText: action.text } : state;
    case 'CHANGE_FILTER_YEAR':      
      return state.securityFilterYear != action.year ? { ...state, securityFilterYear: action.year } : state;
    case 'CHANGE_FILTER':
      return { ...state, securityFilter: action.filters };
    case 'SHOW_NAVMENU':
      return { ...state, navMenu: action.navMenu };
    default:
      throw new Error('Unexpected action');
  }
}
/* Then create a provider Component */
const AppProvider = props => {
  const [store, dispatch] = useReducer(securityReducer, initialSecurityState);
  return (<AppContext.Provider value={{store, dispatch}}>{props.children}</AppContext.Provider>);
}

let AppConsumer = AppContext.Consumer;
export {AppContext, AppProvider, AppConsumer};