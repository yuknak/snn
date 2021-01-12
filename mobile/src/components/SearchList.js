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
import { goChanUrl,inproperMsg1,inproperMsg2,inproperMsg3 } from '../lib/Common'

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

////////////////////////////////////////////////////////////////////////////////

class SearchTabListItem extends Component {
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
    return (
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
}

class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryStr: '',
      refreshing: false
    }
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.setNavigation(this.props.navigation,this.props.route.name)
    });
  }
  componentWillUnmount() {
    this._unsubscribe()
  } 
  shouldComponentUpdate(nextProps, nextState) {
    if (!this.props.appState.recs['get:/thread/search'] ||
        !this.props.appState.recs['get:/thread/search'].data) {
      return true
    }
    var d1 = this.props.appState.recs['get:/thread/search'].data.data
    var d2 = nextProps.appState.recs['get:/thread/search'].data.data
    if (!d1||!d2) {
      return false
    }
    if (JSON.stringify(d1)==JSON.stringify(d2)) {

        return false

    }
    return true
  }
  render() {
    var data = null
    if (this.props.appState.recs['get:/thread/search']) {
      data = this.props.appState.recs['get:/thread/search'].data.data
    }
    if (!data) {
      return null
    }
    var params = {}
    //params = {per_page: 50}
    var ele = []
    data.forEach((item)=> {
      ele.push(<SearchTabListItem key={item.tid} item={item} {...this.props} />)
    })
    return (
        <>

        <List>{ele}</List>

        </>

    ) 
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

  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(SearchList)

////////////////////////////////////////////////////////////////////////////////
