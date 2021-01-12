
////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Tab, Container, Content, Text,List,ListItem,Left,Right,Button,Icon,Body } from 'native-base';
import { View,Alert, RefreshControl,ScrollView } from "react-native";
import * as apiState from '../redux/ApiState'
import { listCategoryStyles, replaceTitle, brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';
import * as settingState from '../redux/SettingState'

import { YellowBox } from 'react-native'
import PageButtons from './PageButtons'
import ArrowUp from './ArrowUp'
import { goChanUrl,inproperMsg1,inproperMsg2,inproperMsg3 } from '../lib/Common'

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

////////////////////////////////////////////////////////////////////////////////

class HomeTabListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    }
  }
  componentDidMount() {
  }
  componentWillUnmount(){
  }
  render () {
    var item = this.props.item
    var e = []
    if (this.props.settingState.ban_list&&
      this.props.settingState.ban_list.some(id => id == item.board.name+item.tid)) {
      e.push(<ListItem key={item.tid}><Text>{inproperMsg1}</Text></ListItem>)
    } else {
      e.push(
        <ListItem key={item.tid} style={listItemStyles}
        onPress={()=>{
          this.props.navigation.push("MyWebView", {
            uri: goChanUrl(
              item.board.server.name,
              item.board.name,
              item.tid,
              this.props.settingState.settings.goch_view_article_mode
              )})
          }}
        onLongPress={()=>{
          if (this.props.settingState.settings.report_inproper) {
          Alert.alert(
            inproperMsg2,
            inproperMsg3,
            [{ text: 'はい',
                onPress: () => {
                  var ban_id = item.board.name+item.tid
                  this.props.addBanList(ban_id)
                  this.forceUpdate()
                } 
              },
              { text: 'キャンセル',
                onPress: () => { } 
              }
            ]
          )
        }}}
        >
        <Text>
          <Text style={listCategoryStyles(item.board.name)}>★</Text>
          <Text>{formatEpoch(item.tid)}&nbsp;</Text>
          <Text style={{color: brandColors.brandSuccess}}>{item.res_cnt}res&nbsp;</Text>
          <Text style={{color: brandColors.brandDanger}}>{Math.round(parseFloat(item.res_speed_max*100))/100}res/h&nbsp;</Text>
          <Text>{replaceTitle(item.title)}</Text>
        </Text>
      </ListItem>
      )
    }
    return (e)
  }
}

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {
    apiState: state.apiState,
    appState: state.appState,
    settingState: state.settingState,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    api: (params,success,error) =>
      dispatch(apiState.api(params,success,error)),
    addBanList: (ban_id) =>
      dispatch(settingState.addBanList(ban_id)),

  }
}
////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabListItem)

////////////////////////////////////////////////////////////////////////////////
