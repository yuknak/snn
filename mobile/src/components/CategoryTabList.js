
////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Tab,Container, Content, Text,List,ListItem,Left,Right,Button,Icon,Body } from 'native-base';
import { View,Alert, RefreshControl,ScrollView  } from "react-native";
import * as apiState from '../redux/ApiState'
import { formatDatetime,listCategoryStyles,replaceTitle, brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';
import * as settingState from '../redux/SettingState'

import { YellowBox } from 'react-native'
import PageButtons from './PageButtons'
import CategoryTabListItem from './CategoryTabListItem'
import ArrowUp from './ArrowUp'
import { goChanUrl,inproperMsg1,inproperMsg2,inproperMsg3 } from '../lib/Common'
import { addForceUpdateObj, forceUpdate } from '../lib/Common'


YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

////////////////////////////////////////////////////////////////////////////////

class CategoryTabList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
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

        return false

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
      return (
        <View style={{
        //backgroundColor: 'red',
        height: 200,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        }}>
        <Icon style={{color:'#a9a9a9'}} name="ellipsis-horizontal" />
        </View>
      )
    }
    var params = {}
    //params = {per_page: 50}
    var ele = []
    data.forEach((item)=> {
      ele.push(<CategoryTabListItem key={item.tid} item={item} {...this.props} />)
    })
    return (
        <>   
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

connect(mapStateToProps, mapDispatchToProps)(CategoryTabListItem)
export default connect(mapStateToProps, mapDispatchToProps)(CategoryTabList)

////////////////////////////////////////////////////////////////////////////////
