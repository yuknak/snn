////////////////////////////////////////////////////////////////////////////////

import axios from 'axios'
import Action from './Action'
import { dispatchAppSuccess, dispatchAppError } from './AppState'
import { Platform } from 'react-native'

////////////////////////////////////////////////////////////////////////////////

// This state should NOT be redux-persistent
// (register in the persistConfig.blocklist)

const initialState = {
  // axios response, in addtion data, it contains headers and so on.
  calling: false,
  response: {},
}

////////////////////////////////////////////////////////////////////////////////

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case Action.API_INIT_STATE:
      return initialState
    case Action.API_START:
      return { ...state, calling: true }
    case Action.API_SUCCESS:
      return { ...state, calling: false, response: action.response }
    case Action.API_ERROR:
      // TODO: Get error status somehow.
      return { ...state, calling: false, response: action.response }
    default:
      console.log("ApiState reducer: default case called: "+action.type)
      return state
  }
}

////////////////////////////////////////////////////////////////////////////////

function buildErrorMessage(errResponse)
{
  let message = JSON.stringify(errResponse)
  if (errResponse && errResponse.response) {
    if (errResponse.response.data &&
        errResponse.response.status &&
        errResponse.response.statusText
      ) {
      message = errResponse.response.status + " " +
        errResponse.response.statusText + "\n" +
          JSON.stringify(errResponse.response.data)
    } else {
      message = JSON.stringify(errResponse.response)
    }
  }
  return message;
}

////////////////////////////////////////////////////////////////////////////////
// API call by axios
// Axios call params:
// {method: 'get', url: '/user_account' params: { key : value, ... }}
// {method: 'post', url: '/user_account' data: { key : value, ... }}

export const api = (params, success_func=()=>{}, error_func=()=>{}) => {

  //params.withCredentials = true 
  //params.baseURL = window.location.origin + '/api/v2'

  params.baseURL = 'https://www.supernn.net/api/v1'
  
  params.validateStatus = function (status) { // we can overwrite what is success
    return status >= 200 && status < 300; // but, use default behavior
  }
  let name = params.method + ':' + params.url
  if (params.nameExt) { // work with the same urls and different results
    name = name + ':' + params.nameExt
  }
  return dispatch => {
    if (!params.noLoading) { // can be turned off
      dispatch({type: Action.UI_LOADING_START})
    }
    dispatch({ type: Action.API_START, name: name})
    axios.request(params).then((response) => {
      //success
      dispatch({type: Action.API_SUCCESS,
        name: name,  response: response})
      if (!params.noLoading) { // can be turned off
        dispatch({type: Action.UI_LOADING_END})
      }
      dispatchAppSuccess(dispatch, name, response) // -> dispatch to appstate
      success_func(response) //-> call custom external routine
    }).catch((errResponse) => {
      // error
      dispatch({type: Action.API_ERROR,
        name: name, response: errResponse})
      if (!params.hideAlert) { // can be turned off by defining params.hideAlert: true
        dispatch({type: Action.UI_ALERT_SHOW,
          variant: 'warning', message: buildErrorMessage(errResponse) })
      }
      if (!params.noLoading) { // can be turned off
        dispatch({type: Action.UI_LOADING_END})
      }
      dispatchAppError(dispatch, name, errResponse) // -> dispatch to appstate
      error_func(errResponse) // -> call custom external routine
    })
  }
}

////////////////////////////////////////////////////////////////////////////////
