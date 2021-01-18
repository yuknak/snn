////////////////////////////////////////////////////////////////////////////////

import Action from './Action'

////////////////////////////////////////////////////////////////////////////////

const initialState = {
  settings: {
    webview_desktop: false,
    remove_ads: true,
    show_tutorial: true,
    goch_view_article_mode: "bottom50",
    report_inproper: true, // 1.0.3-
    block_inproper: true, // 1.0.3-
  },
  ban_list: [] // 1.0.3-
}

////////////////////////////////////////////////////////////////////////////////

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case Action.SETTING_UPDATE:
      return { ...state, settings: action.settings }
    case Action.SETTING_ADD_BAN_LIST:
      var ban_list = state.ban_list
      if (!ban_list) {
        ban_list = []
      }
      ban_list.push(action.ban_id)
      //console.log(JSON.stringify(ban_list))
      return { ...state, ban_list: ban_list }
    case Action.SETTING_CLEAR_BAN_LIST:
      var ban_list = []
      //console.log(JSON.stringify(ban_list))
      return { ...state, ban_list: ban_list }
    case Action.SETTING_SET_BLOCK_INPROPER:
      var settings = state.settings
      settings.block_inproper = action.value
      return { ...state, settings: settings }
    default:
      //console.log("Settingtate reducer: default case called: "+action.type)
      return state;
  }
}

////////////////////////////////////////////////////////////////////////////////

export function updateSettings(settings) {
  return ({type: Action.SETTING_UPDATE,
    settings: settings,})
}

export function addBanList(ban_id) {
  return ({type: Action.SETTING_ADD_BAN_LIST,
    ban_id: ban_id})
}

export function clearBanList() {
  return ({type: Action.SETTING_CLEAR_BAN_LIST })
}

export function setBlockInproper(enable) {
  return ({type: Action.SETTING_SET_BLOCK_INPROPER, value: enable })
}
////////////////////////////////////////////////////////////////////////////////
