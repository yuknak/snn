
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
import HomeTabTopList from './HomeTabTopList'
import { purgeStoredState } from 'redux-persist';

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

////////////////////////////////////////////////////////////////////////////////

class HomeTabTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      active: 'true'
    }

  }

  componentDidMount() {
    this.props.set_scroll_callback(this.props.index, ()=>{
      if (this.listref) {
        this.listref.scrollTo({ y: 0, animated: true, })
      }
    })

    //this.setState({refreshing: true})
    console.log('HomeTabTop: mount api called')
    this.props.api({
      method: 'get',
      url: '/thread/'+this.props.boardName,
      params: {per_page: 50},
      //noLoading: true
    }, ()=>{ 
      //Alert.alert("",JSON.stringify(this.props.appState.recs['get:/thread/'+this.props.boardName]))
      //this.setState({refreshing: false})
    }, ()=> {
      //this.setState({refreshing: false})
    })
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
      //console.log("shouldComponentUpdate:render object same")
      //console.log("shouldComponentUpdate:refreshing "+this.state.refreshing)
      if (!this.state.refreshing) {
        return false
      }
    }
    return true
  }

  render() {
    //console.log("hometabtop render called")
    //return null
    var data = null
    if (this.props.appState.recs['get:/thread/'+this.props.boardName] &&
    this.props.appState.recs['get:/thread/'+this.props.boardName].data) {
      data = this.props.appState.recs['get:/thread/'+this.props.boardName].data.data
    }
    if (!data) {
      //console.log("hometab render called NULL")
      return null
    }
    var params = {}
    params = {per_page: 50}
    return (
      <Tab key={this.props.key} heading={this.props.heading}>
      <Container>
        <ScrollView
        ref={(r) => (this.listref = r)}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={()=>{
              if (this.state.refreshing) {
                return
              }
              this.setState({refreshing: true})
              console.log('HomeTabTop: refresh api called')
              this.props.api({
                method: 'get',
                url: '/thread/'+this.props.boardName,
                params: {per_page: 50},
                //noLoading: true
              }, ()=>{ 
                this.setState({refreshing: false})
              }, ()=> {
                this.setState({refreshing: false})
              })
          }
          } /> }
        >

        <HomeTabTopList {...this.props} />

          </ScrollView>
            <ArrowUp onPress={()=>{
              this.listref.scrollTo({ y: 0, animated: true, })
            }}/> 
        </Container>
        </Tab>
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
    api: (params,success,error) => {
      //console.log("api DISPATCH called")
      dispatch(apiState.api(params,success,error))
    },
  }
}
////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabTop)

////////////////////////////////////////////////////////////////////////////////
