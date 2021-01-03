
////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Tab, Container, Content, Text,List,ListItem,Left,Right,Button,Icon,Body } from 'native-base';
import { Alert, RefreshControl,ScrollView } from "react-native";
import * as apiState from '../redux/ApiState'
import { listCategoryStyles, replaceTitle, brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';

import { YellowBox } from 'react-native'
import PageButtons from './PageButtons'
import ArrowUp from './ArrowUp'
import { goChanUrl } from '../lib/Common'
import HomeTabList from './HomeTabList'

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

////////////////////////////////////////////////////////////////////////////////

class HomeTab extends Component {
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
          params: {},
          //noLoading: true
        }, ()=>{ 
    
        }, ()=> {
    
        })
      }
    })
    //this.setState({refreshing: true})
    console.log('HomeTab: mount api called')
    this.props.api({
      method: 'get',
      url: '/thread/'+this.props.boardName,
      params: {},
      //noLoading: true
    }, ()=>{ 

    }, ()=> {

    })
  }
  componentWillUnmount(){
  }

  render() {
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
              console.log('HomeTab: refresh api called')
              this.props.api({
                method: 'get',
                url: '/thread/'+this.props.boardName,
                params: {},
                //noLoading: true
              }, ()=>{ 
                this.setState({refreshing: false})
              }, ()=> {
                this.setState({refreshing: false})
              })
          }
          } /> }
        >
        <PageButtons
          header={true}
          listref={this.listref}
          url={'/thread/'+this.props.boardName}
          params={{}}
          recs_key={'get:/thread/'+this.props.boardName}
          {...this.props}
        />
          <HomeTabList {...this.props} />
          <PageButtons
          listref={this.listref}
          url={'/thread/'+this.props.boardName}
          params={{}}
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeTab)

////////////////////////////////////////////////////////////////////////////////
