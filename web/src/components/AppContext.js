import React, {useReducer, createContext} from 'react';

let AppContext = createContext(null);

const initialSecurityState = {
    securityFilterText: '',
    securityFilterYear: 2018,
    securityFilterLargeCap: [],
    securityFilterValue: [],
    securityFilterArea: ['Dividend', 'Growth'],
    securityFilterSector: ['CommercialServices', 'Communications'],
    navMenu: true
};

const securityReducer = (state, action) => {
  let replaces = [];
  switch (action.type) {
    case 'CHANGE_FILTER_TEXT':
      return state.securityFilterText != action.text ? { ...state, securityFilterText: action.text } : state;
    case 'CHANGE_FILTER_YEAR':      
      return state.securityFilterYear != action.year ? { ...state, securityFilterYear: action.year } : state;
    case 'CHANGE_FILTER_LARGECAP':
      replaces = state.securityFilterLargeCap;
      if(typeof action.filter === "object"){
        replaces = action.filter;
      }else{
        if(replaces.indexOf(action.filter) != -1){        
          replaces = replaces.filter(e => e != action.filter);
        }else{
          replaces.push(action.filter);
        }
      }
      replaces.sort();
      return { ...state, securityFilterLargeCap: replaces };
    case 'CHANGE_FILTER_VALUE':
      replaces = state.securityFilterValue;
      if(typeof action.filter === "object"){
        replaces = action.filter;
      }else{
        if(replaces.indexOf(action.filter) != -1){        
          replaces = replaces.filter(e => e != action.filter);
        }else{
          replaces.push(action.filter);
        }
      }
      replaces.sort();
      return { ...state, securityFilterValue: replaces };
    case 'CHANGE_FILTER_AREA':
      replaces = state.securityFilterArea;
      if(typeof action.filter === "object"){        
        replaces = action.filter;
      }else{        
        if(replaces.indexOf(action.filter) != -1){        
          replaces = replaces.filter(e => e !== action.filter);
        }else{
          replaces.push(action.filter);
        }
      }
      replaces.sort();
      return { ...state, securityFilterArea: replaces };
    case 'CHANGE_FILTER_SECTOR':
      replaces = state.securityFilterSector;
      if(typeof action.filter === "object"){        
        replaces = action.filter;
      }else{
        if(replaces.indexOf(action.filter) != -1){
          replaces = replaces.filter(e => e != action.filter);
        }else{
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
}
/* Then create a provider Component */
const AppProvider = props => {
  const [store, dispatch] = useReducer(securityReducer, initialSecurityState);
  return (<AppContext.Provider value={{store, dispatch}}>{props.children}</AppContext.Provider>);
}

let AppConsumer = AppContext.Consumer;
export {AppContext, AppProvider, AppConsumer};