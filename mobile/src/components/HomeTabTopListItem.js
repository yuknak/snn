
////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Fab, Tab, Container, Content, Text,List,ListItem,Left,Right,Button,Icon,Body } from 'native-base';
import { View,Alert, RefreshControl,ScrollView,StyleSheet } from "react-native";
import * as apiState from '../redux/ApiState'
import * as settingState from '../redux/SettingState'
import { formatDatetime, listCategoryStyles, replaceTitle, brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';

import { YellowBox } from 'react-native'
import ArrowUp from './ArrowUp'
import { goChanUrl,inproperMsg1,inproperMsg2,inproperMsg3 } from '../lib/Common'
import { addForceUpdateObj, forceUpdate } from '../lib/Common'

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

////////////////////////////////////////////////////////////////////////////////

class HomeTabTopListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      active: 'true'
    }
  }

  componentDidMount() {
    addForceUpdateObj(this)
  }
  componentWillUnmount(){
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!this.props.appState.recs['get:/thread/'+this.props.boardName] ||
        !this.props.appState.recs['get:/thread/'+this.props.boardName].data) {
      return true
    }
    var d1 = this.props.appState.recs['get:/thread/'+this.props.boardName].data.data
    var d2 = nextProps.appState.recs['get:/thread/'+this.props.boardName].data.data
    if (!d1||!d2) {
      return false
    }
    if (JSON.stringify(d1)==JSON.stringify(d2)) {
      //console.log("hometablist shouldComponentUpdate:render object same")
      //console.log("hometablist shouldComponentUpdate:refreshing "+this.state.refreshing)
        return false
    }
    return true
  }

  render() {
    var item = this.props.item
    var d = this.props.d
    var e = []
    if (this.props.settingState.ban_list&&
        this.props.settingState.ban_list.some(id => id == d.board.name+item.tid)) {
      e.push(<ListItem key={d.board.name+item.tid}><Text>{inproperMsg1}</Text></ListItem>)
        } else {

      e.push(
        <ListItem key={d.board.name+item.tid} style={listItemStyles}
          onPress={()=>{
          this.props.navigation.push("MyWebView", {
            uri: goChanUrl(
              d.board.server.name,
              d.board.name,
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
                    var ban_id = d.board.name+item.tid
                    this.props.addBanList(ban_id)
                    this.forceUpdate()
                    forceUpdate()
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
            <Text style={listCategoryStyles(d.board.name)}>★</Text>
            <Text>{formatEpoch(item.tid)}&nbsp;</Text>
            <Text style={{color: brandColors.brandSuccess}}>{item.res_cnt}res&nbsp;</Text>
            <Text style={{color: brandColors.brandDanger}}>{Math.round(parseFloat(item.res_speed*100))/100}res/h&nbsp;</Text>
            <Text style={{color: brandColors.brandInfo}}>{Math.round(parseFloat(item.res_percent*10000))/100}%&nbsp;</Text>
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
    appInfoState: state.appInfoState,
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabTopListItem)

////////////////////////////////////////////////////////////////////////////////
