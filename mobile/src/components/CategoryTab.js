
////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Tab,Container, Content, Text,List,ListItem,Left,Right,Button,Icon,Body } from 'native-base';
import { Alert, RefreshControl,ScrollView  } from "react-native";
import * as apiState from '../redux/ApiState'
import { formatDatetime,listCategoryStyles,replaceTitle, brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';

import { YellowBox } from 'react-native'
import PageButtons from './PageButtons'

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

        <List>
        <ListItem icon key={this.props.boardName} style={[listItemStyles,listHeaderStyles(this.props.boardName)]}>
        <Left>
          <Button style={listHeaderStyles(this.props.boardName)}>
            <Icon name="newspaper" />
          </Button>
        </Left>
        <Body>
          <Text style={{color: '#FFFFFF'}}>{this.props.title}</Text>
        </Body>
        <Right>
          <Text style={{color: '#FFFFFF',fontSize: 12}}>更新:{formatDatetime(board.mirrored_at)} 時速:{board.res_speed}res/h</Text>
        </Right>
        </ListItem>

        </List>

        <List
          dataArray={data}
          renderRow={(item) =>
            <ListItem key={item.tid} style={listItemStyles} onPress={()=>{
              this.props.navigation.push("MyWebView",
                {uri:'https://'+this.props.serverName+
                  '/test/read.cgi/'+this.props.boardName+'/'+item.tid+'/-100'})}}>
              <Text>
                <Text style={listCategoryStyles(this.props.boardName)}>★</Text>
                <Text>{formatEpoch(item.tid)}&nbsp;</Text>
                <Text style={{color: brandColors.brandSuccess}}>{item.res_cnt}res&nbsp;</Text>
                <Text style={{color: brandColors.brandDanger}}>{item.res_speed}res/h&nbsp;</Text>
                <Text style={{color: brandColors.brandInfo}}>{Math.round(parseFloat(item.res_percent*10000))/100}%&nbsp;</Text>
                <Text>{replaceTitle(item.title)}</Text>
              </Text>
            </ListItem>
          }
          keyExtractor={(item, index) => index.toString()}
        />

      <PageButtons
          listref={this.listref}
          url={'/thread/'+this.props.boardName}
          params={{per_page: 50}}
          recs_key={'get:/thread/'+this.props.boardName}
          {...this.props}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryTab)

////////////////////////////////////////////////////////////////////////////////
