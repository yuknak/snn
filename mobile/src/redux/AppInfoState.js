// redux-rn-misc-enhancer
// https://github.com/quipper/redux-rn-misc-enhancer
// NetInfo stuff is removed because of deprecated

import { combineReducers } from 'redux';
import { appStateReducer } from 'redux-rn-misc-enhancer';

const appReducer = combineReducers({
  // 'combine' .. but just one
  // cos NetInfo removed from this place...
  appStateReducer
});

const reducer = (state, action) => appReducer(state, action);

export default reducer;
