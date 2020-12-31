
////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Tab, Container, Content, Text,List,ListItem,Left,Right,Button,Icon,Body } from 'native-base';
import { Alert, RefreshControl,ScrollView,StyleSheet } from "react-native";
import * as apiState from '../redux/ApiState'
import { formatDatetime, listCategoryStyles, replaceTitle, brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';

import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

////////////////////////////////////////////////////////////////////////////////

class HomeTabTop extends Component {
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
    })

    //this.setState({refreshing: true})
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
      if (!this.state.refreshing) {
        return false
      }
    }
    return true
  }
  render() {
    console.log("render called")
    //return null
    var data = null
    if (this.props.appState.recs['get:/thread/'+this.props.boardName] &&
    this.props.appState.recs['get:/thread/'+this.props.boardName].data) {
      data = this.props.appState.recs['get:/thread/'+this.props.boardName].data.data
    }
    if (!data) {
      console.log("render called NULL")
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
      /*
      ele.push(
      <ListItem onPress={()=>{
        this.props.navigation.jumpTo('Category',{boardName: d.board.name})
        }} key={d.board.name} style={[listItemStyles,listHeaderStyles(d.board.name)]}>
          <Text style={{color: '#FFFFFF'}}>{d.board.title}&nbsp;</Text>
          <Text style={{color: '#FFFFFF'}}>{d.board.res_speed}res/h&nbsp;</Text>
      </ListItem>
      )
      */
      d.data.forEach((item)=> {
        ele.push(
            <ListItem key={d.board.name+item.tid} style={listItemStyles} onPress={()=>{
              this.props.navigation.push("MyWebView",
                {uri:'https://'+d.board.server.name+'/test/read.cgi/'+d.board.name+'/'+item.tid+'/-100'})}}>
              <Text>
                <Text style={listCategoryStyles(d.board.name)}>★</Text>
                <Text>{formatEpoch(item.tid)}&nbsp;</Text>
                <Text style={{color: brandColors.brandSuccess}}>{item.res_cnt}res&nbsp;</Text>
                <Text style={{color: brandColors.brandDanger}}>{item.res_speed}res/h&nbsp;</Text>
                <Text style={{color: brandColors.brandInfo}}>{Math.round(parseFloat(item.res_percent*10000))/100}%&nbsp;</Text>
                <Text>{replaceTitle(item.title)}</Text>
              </Text>
            </ListItem>
        )
      })
    })
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
          }
          } /> }
        >

        <List>{ele}</List>

          </ScrollView>
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
  }
}

const mapDispatchToProps = dispatch => {
  return {
    api: (params,success,error) =>
      dispatch(apiState.api(params,success,error)),
  }
}
////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabTop)

////////////////////////////////////////////////////////////////////////////////
