////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Container, Item, Header, Title, Input, Content, Footer, FooterTab, Button, Left, Right, Body, Text,Icon,List,ListItem,Thumbnail,Subtitle } from 'native-base';
import * as uiState from '../redux/UiState'
import * as apiState from '../redux/ApiState'
import { Alert, RefreshControl,ScrollView } from "react-native";
import { listCategoryStyles, replaceTitle, brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';

import FlatListDropDown from './FlatListDropDown'
import { ThemeProvider } from '@react-navigation/native';
import PageButtons from './PageButtons'

////////////////////////////////////////////////////////////////////////////////

class Search extends Component {
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
  render() {
    var data = null
    if (this.props.appState.recs['get:/thread/search']) {
      data = this.props.appState.recs['get:/thread/search'].data.data
    }
    if (!data) {
      //return null
    }
    var params = {}
    params = {per_page: 50}
    return (
      <Container>
      <Header searchBar rounded>
        <Item>
          <Icon name="ios-search" />
          <Input placeholder="掲示板検索"
            onChangeText={(e)=>{
              this.setState({queryStr: e})
            }}
            onKeyPress={()=>{}}
            onSubmitEditing={(e)=>{
              var q = this.state.queryStr
              this.props.api({
                method: 'get',
                url: '/thread/search',
                params: {q: q, per_page: 50},
                //noLoading: true
              }, ()=>{ 
              }, ()=> {
              })
            }}
          />
          <Icon name="ios-people" />
        </Item>
        { /*
        <Button transparent>
          <Text>Search</Text>
        </Button>
        */ }
        </Header>
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
              var q = this.state.queryStr
              this.props.api({
                method: 'get',
                url: '/thread/search',
                params: {q: q, per_page: 50},
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
          url={'/thread/search'}
          params={{q: this.state.queryStr, per_page: 50}}
          recs_key={'get:/thread/search'}
          {...this.props}
        />
        <List
          dataArray={data==null?[]:data}
          renderRow={(item) =>
            <ListItem key={item.tid} style={listItemStyles} onPress={()=>{
              this.props.navigation.push("MyWebView",
                {uri:'https://'+item.board.server.name+'/test/read.cgi/'+item.board.name+'/'+item.tid+'/-100'})}}>
              <Text>
                <Text style={listCategoryStyles(item.board.name)}>★</Text>
                <Text>{formatEpoch(item.tid)}&nbsp;</Text>
                <Text style={{color: brandColors.brandSuccess}}>{item.res_cnt}res&nbsp;</Text>
                <Text style={{color: brandColors.brandDanger}}>{item.res_speed_max}res/h&nbsp;</Text>
                <Text>{replaceTitle(item.title)}</Text>
              </Text>
            </ListItem>
          }
          keyExtractor={(item, index) => index.toString()}
          />
        <PageButtons
          listref={this.listref}
          url={'/thread/search'}
          params={{q: this.state.queryStr, per_page: 50}}
          recs_key={'get:/thread/search'}
          {...this.props}
        />

          </ScrollView>
      </Container>
    ) 
  }
}
////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {
    apiState: state.apiState,
    appState: state.appState,
    uiState: state.uiState,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    api: (params,success,error) =>
      dispatch(apiState.api(params,success,error)),
    setNavigation: (navigation,routeName) =>
      dispatch(uiState.setNavigation(navigation,routeName)),
  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(Search)

////////////////////////////////////////////////////////////////////////////////
