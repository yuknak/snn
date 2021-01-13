////////////////////////////////////////////////////////////////////////////////

import Action from './Action'

////////////////////////////////////////////////////////////////////////////////

const initialState = {
  
  // Indicates session is valid or not
  authenticated: false,
  
  // API returns 1 record
  rec: {}, // { "get:/barong/resource/users/me":{ key: value, ... }}
  
  // API returns multiple records with page index info
  recs: {},// { "get:/barong/resource/users/activity/all":{
          //      data:[{ key: value, ... },{ key: value, ... },...],
          //      page: 1
          //      per_page: 25
          //      total: 165
          //      }, ...
          //   }
}

////////////////////////////////////////////////////////////////////////////////

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case Action.APP_INIT_STATE:
      return initialState // authenticated: false
    case Action.APP_REC: // 1 record response
    return { ...state,
        rec: {
          ...state.rec, 
          [action.name]:action.response
        }}
    case Action.APP_RECS:// multi records response
      return { ...state,
        recs: {
          ...state.recs, 
          [action.name]:action.response// array data
        }}
    default:
      //console.log("AppState reducer: default case called: "+action.type)
      return state;
  }
}

export function initAppState() {
  return ({type: Action.APP_INIT_STATE})
}

////////////////////////////////////////////////////////////////////////////////
// Dispatch API response to app reducer

export const dispatchAppSuccess = (dispatch, name, response) => {
  
  // RECS: Returns multiple records(table) with paging info.
  if (
    name.match(/thread\/([^\/]+)\?/)
    ) {
    m = name.match(/thread\/([^\/]+)\?/)
    // when "/thread/search?q=search_word" -> "/thread/search"
    dispatch({type: Action.APP_RECS, response: response, name: "get:/thread/"+m[1]})
  } else if (
    name.startsWith('get:/thread')
    ) {
    dispatch({type: Action.APP_RECS, response: response, name: name})
  
  //////// REC: Returns one record.
  } else if (
    name.startsWith('post:/user/check')||
    name.startsWith('post:/support')
    ) {
    dispatch({type: Action.APP_REC, response: response, name: name})

  }

}

////////////////////////////////////////////////////////////////////////////////

export const dispatchAppError = (dispatch, name, errResponse) => {
  /*
  // Login sessions error
  if (name === 'delete:/barong/identity/sessions'||// Logoff Error
      name === 'get:/barong/resource/users/me') {// Login Check Error -> Session Clear
    dispatch({type: Action.APP_INIT_STATE })
  
  // When any api request gets error
  } else {
    // When auth error detected
    if (errResponse && errResponse.response &&
        errResponse.response.data && errResponse.response.data.errors) {
      var check = JSON.stringify(errResponse.response.data)
      // See Barong errors list
      // https://www.openware.com/sdk/docs/barong/errors.html
      if (check.indexOf('identity.session.')!=-1||
          check.indexOf('authz.')!=-1||
          check.indexOf('jwt.decode_and_verify')!=-1
          ) {
        dispatch({type: Action.APP_INIT_STATE })
      }
    } else {
      // void
    }
  }
  */
}

////////////////////////////////////////////////////////////////////////////////