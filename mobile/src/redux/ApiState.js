////////////////////////////////////////////////////////////////////////////////

import axios from 'axios'
import Action from './Action'
import { dispatchAppSuccess, dispatchAppError } from './AppState'
import { Platform } from 'react-native'
import { apiProcessing } from '../lib/Common'
import base64 from 'react-native-base64'

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
      //console.log("ApiState reducer: default case called: "+action.type)
      return state
  }
}

////////////////////////////////////////////////////////////////////////////////

function buildErrorMessage(errResponse, lastGrapeError)
{
  // Grape error return
  var message = "Network Error"
  if (lastGrapeError) {
    // See in app/api/v*/root.rb
    // { errmode: 'grape', status: {STATUS FROM GRAPE: 400, 401, 404, 500}, error: {ERROR MSG FROM GRAPE} }
    message = lastGrapeError
  } else if (errResponse) {
    if (errResponse.message) {
      message = '{ errmode: "message", status: 0, error: "'+errResponse.message+'" }'
    }
  }
  return message;
}

////////////////////////////////////////////////////////////////////////////////
// API call by axios
// Axios call params:
// {method: 'get', url: '/user_account' params: { key : value, ... }}
// {method: 'post', url: '/user_account' data: { key : value, ... }}

var lastGrapeError = null // A hack to get custom error info. from server
const authHeader = 'Basic ' + base64.encode('ilcaqtkr:Of7pWFTt')

export const api = (params, success_func=()=>{}, error_func=()=>{}) => {
  console.log("api called"+params.url)
  params.headers= {
    'Authorization': authHeader // Easy basic auth
  }
  //params.withCredentials = true 
  //params.baseURL = window.location.origin + '/api/v2'

  params.baseURL = 'https://snn.tetraserve.biz/api/v1'
  //params.baseURL = 'https://snn1.tetraserve.biz/api/v1'
  // NOTICE) Android emulator may not be able to understand
  //         names, IPs seems OK.
  //params.baseURL = 'http://172.17.0.1:3000/api/v1'
  params.timeout = 10 * 1000
  
  //params.validateStatus = function (status) { 
  //  return status >= 200 && status < 300; // =default
  //}

  // There are some problem in ReactNative + Axios
  // This is a hack. See in buildErrorMessage
  
  params.transformResponse = [function (data) {
    var chk = data.substring(0,100)
    if (chk.indexOf('grape') >= 0 &&
        chk.indexOf('errmode') >= 0) {
      //console.log('transformResponse:'+data)
      lastGrapeError = data
    }
    try {
      return JSON.parse(data)
    } catch (error) {
      throw Error(
        `[Axios:transformResponse] Error parsingJSON data - ${JSON.stringify(
          error
        )}`
      );
    }
  }]
  
  let name = params.method + ':' + params.url
  if (params.nameExt) { // work with the same urls and different results
    name = name + ':' + params.nameExt
  }
  return dispatch => {
    if (!params.noLoading) {
      dispatch({type: Action.UI_LOADING_START})
    }
console.log("Axios.request called:" + name)
    lastGrapeError = null
    axios.request(params).then((response) => {
      if (!params.noLoading) {
        dispatch({type: Action.UI_LOADING_END})
      }
      // Success
      if (!params.hideAlert) {
        dispatch({type: Action.UI_ALERT_HIDE }) // hide if success
      }
//console.log("Axios.request success:"+ JSON.stringify(response))
      dispatchAppSuccess(dispatch, name, response) // -> dispatch to appstate
      success_func(response) //-> call custom external routine 
    }).catch((errResponse) => {
      if (!params.noLoading) {
        dispatch({type: Action.UI_LOADING_END})
      }
      var errMsg = buildErrorMessage(errResponse, lastGrapeError)
console.log("Axios.request error:"+ errMsg)
      if (!params.hideAlert) {
        dispatch({type: Action.UI_ALERT_SHOW,
          variant: 'warning', message: errMsg })
      }
      dispatchAppError(dispatch, name, errResponse) // -> dispatch to appstate
      error_func(errResponse) // -> call custom external routine
    })
  }
}

////////////////////////////////////////////////////////////////////////////////
