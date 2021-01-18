////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Container, Item, Header, Title, Input, Content, Footer, FooterTab, Button, Left, Right, Body, Text,Icon,List,ListItem,Thumbnail,Subtitle } from 'native-base';
import * as uiState from '../redux/UiState'
import * as apiState from '../redux/ApiState'
import { Alert, RefreshControl,ScrollView } from "react-native";
import { listCategoryStyles, replaceTitle, brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';
import * as settingState from '../redux/SettingState'

import FlatListDropDown from './FlatListDropDown'
import { ThemeProvider } from '@react-navigation/native';
import PageButtons from './PageButtons'

import { YellowBox } from 'react-native'
import ArrowUp from './ArrowUp'
import { goChanUrl,
  inproperMsg1,inproperMsg2,inproperMsg3,
  inproperBrowseMsg1,inproperBrowseMsg2 } from '../lib/Common'

import { addForceUpdateObj, forceUpdate } from '../lib/Common'
import { getDeviceInfo } from '../lib/Common';

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

////////////////////////////////////////////////////////////////////////////////

class SearchListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    }
    this.handlePress = this.handlePress.bind(this);
    this.handleLongPress = this.handleLongPress.bind(this);
  }
  componentDidMount() {
  }
  componentWillUnmount(){
  }
  handlePress() {
    var item = this.props.item
    var block = this.props.settingState.settings.block_inproper
    if (!block) {
      this.props.navigation.push("MyWebView", {
        uri: goChanUrl(
          item.board.server.name,
          item.board.name,
          item.tid,
          this.props.settingState.settings.goch_view_article_mode
        )})
    } else {
      Alert.alert(
        inproperBrowseMsg1,
        inproperBrowseMsg2,
        [
          { text: '同意する',
            onPress: () => {
              this.props.navigation.push("MyWebView", {
                uri: goChanUrl(
                  item.board.server.name,
                  item.board.name,
                  item.tid,
                  this.props.settingState.settings.goch_view_article_mode
                )})
            } 
          },
          { text: '全て同意する',
            onPress: () => {
              this.props.navigation.push("MyWebView", {
                uri: goChanUrl(
                  item.board.server.name,
                  item.board.name,
                  item.tid,
                  this.props.settingState.settings.goch_view_article_mode
                )})
                this.props.setBlockInproper(false)
            } 
          },
          { text: '同意しない',
            onPress: () => { } 
          }
        ]
      )
    }
  }

  handleLongPress() {
    var item = this.props.item
    if (this.props.settingState.settings.report_inproper) {
      Alert.alert(
        inproperMsg2,
        inproperMsg3,
        [{ text: 'はい',
            onPress: () => {
              this.props.api({
                method: 'post',
                url: '/support',
                params: {
                  "unique_id": getDeviceInfo().uniqueId,
                  "sup_type": "ban",
                  "board_name": item.board.name,
                  "tid": item.tid,
                },
              },()=>{
                var ban_id = item.board.name+item.tid
                this.props.addBanList(ban_id)
                this.forceUpdate()
                forceUpdate()
              })

            } 
          },
          { text: 'キャンセル',
            onPress: () => { } 
          }
        ]
      )
    }
  }
  render () {
    var item = this.props.item
    var e = []
    if (this.props.settingState.ban_list&&
      this.props.settingState.ban_list.some(id => id == item.board.name+item.tid)) {
        e.push(
          <ListItem style={listItemStyles} key={item.tid}>
            <Icon style={{color: '#d9534f'}} name="close-circle"></Icon>
            <Text>{inproperMsg1}</Text></ListItem>
        )
    } else {
      e.push(
        <ListItem key={item.tid} style={listItemStyles}
        onPress={this.handlePress}
        onLongPress={this.handleLongPress}
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
    uiState: state.uiState,
    settingState: state.settingState,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    api: (params,success,error) =>
      dispatch(apiState.api(params,success,error)),
    setNavigation: (navigation,routeName) =>
      dispatch(uiState.setNavigation(navigation,routeName)),
    addBanList: (ban_id) =>
      dispatch(settingState.addBanList(ban_id)),
    setBlockInproper: (enable) =>
      dispatch(settingState.setBlockInproper(enable)),

  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(SearchListItem)

////////////////////////////////////////////////////////////////////////////////
