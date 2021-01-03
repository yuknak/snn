
////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Tab,Container, Content, Text,List,ListItem,Left,Right,Button,Icon,Body } from 'native-base';
import { Alert, RefreshControl,ScrollView  } from "react-native";
import * as apiState from '../redux/ApiState'
import { formatDatetime,listCategoryStyles,replaceTitle, brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';

import { YellowBox } from 'react-native'
import PageButtons from './PageButtons'
import ArrowUp from './ArrowUp'
import { goChanUrl } from '../lib/Common'
import CategoryTabList from './HomeTabList'

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

////////////////////////////////////////////////////////////////////////////////

class CategoryTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    }
  }
  componentDidMount() {
    this.props.set_scroll_callback(this.props.index, ()=>{
      if (this.listref) {
        this.listref.scrollTo({ y: 0, animated: true, })
      }
      if (!this.props.appState.recs['get:/thread/'+this.props.boardName] ||
      !this.props.appState.recs['get:/thread/'+this.props.boardName].data) {
        this.props.api({
          method: 'get',
          url: '/thread/'+this.props.boardName,
          params: {per_page: 50},
          //noLoading: true
        }, ()=>{ 
    
        }, ()=> {
    
        })
      }      
    })
    //this.setState({refreshing: true})
    this.props.api({
      method: 'get',
      url: '/thread/'+this.props.boardName,
      params: {per_page: 50},
      //noLoading: true
    }, ()=>{ 

    }, ()=> {

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
      if (!this.state.refreshing) {
        //console.log("render SKIP")
        return false
      }
    }
    return true
  }
  render() {
    //console.log('render')
    var data = null
    var board = null
    if (this.props.appState.recs['get:/thread/'+this.props.boardName]) {
      data = this.props.appState.recs['get:/thread/'+this.props.boardName].data.data
      board = this.props.appState.recs['get:/thread/'+this.props.boardName].data.board
    }
    if (!data || !board) {
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
          }} />
        }
      >
        <PageButtons
          header={true}
          listref={this.listref}
          url={'/thread/'+this.props.boardName}
          params={{per_page: 50}}
          recs_key={'get:/thread/'+this.props.boardName}
          {...this.props}
        />
        <CategoryTabList {...this.props} />
        <PageButtons
          listref={this.listref}
          url={'/thread/'+this.props.boardName}
          params={{per_page: 50}}
          recs_key={'get:/thread/'+this.props.boardName}
          {...this.props}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryTab)

////////////////////////////////////////////////////////////////////////////////
