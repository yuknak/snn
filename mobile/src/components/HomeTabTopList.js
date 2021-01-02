
////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Fab, Tab, Container, Content, Text,List,ListItem,Left,Right,Button,Icon,Body } from 'native-base';
import { View,Alert, RefreshControl,ScrollView,StyleSheet } from "react-native";
import * as apiState from '../redux/ApiState'
import { formatDatetime, listCategoryStyles, replaceTitle, brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';

import { YellowBox } from 'react-native'
import ArrowUp from './ArrowUp'
import { goChanUrl } from '../lib/Common'

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

////////////////////////////////////////////////////////////////////////////////

class HomeTabTopList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      active: 'true'
    }

  }

  componentDidMount() {

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
    //console.log("hometablist render called")
    //return null
    var data = null
    if (this.props.appState.recs['get:/thread/'+this.props.boardName] &&
    this.props.appState.recs['get:/thread/'+this.props.boardName].data) {
      data = this.props.appState.recs['get:/thread/'+this.props.boardName].data.data
    }
    if (!data) {
      //console.log("hometablist render called NULL")
      return null
    }
    var params = {}
    params = {per_page: 50}

    var ele = []
    data.forEach((d)=> {
      if (!d.board || !d.board.name) {
        return null
      }
      ele.push(
      <ListItem icon onPress={()=>{
        this.props.navigation.jumpTo(
          'Category',{boardName: d.board.name, from: 'board.header'})
        }}
      key={d.board.name} style={[listItemStyles,listHeaderStyles(d.board.name)]}>
      <Left>
        <Button style={listHeaderStyles(d.board.name)}>
          <Icon  name="newspaper" />
        </Button>
      </Left>
      <Body>
        <Text style={{color: '#FFFFFF'}}>{d.board.title}</Text>
      </Body>
      <Right>
        <Text style={{color: '#FFFFFF',fontSize: 12}}>{formatDatetime(d.board.mirrored_at)} {d.board.res_speed}res/h</Text>
        <Text style={{color: '#FFFFFF',fontSize: 27}}>&nbsp;<Icon style={{color: '#FFFFFF'}} name="chevron-forward"/></Text>
      </Right>
      </ListItem>
      )
      d.data.forEach((item)=> {
        ele.push(
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
      })
    })
    return (
      <List>{ele}</List>
    )
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
  }
}
////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabTopList)

////////////////////////////////////////////////////////////////////////////////
