
////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Tab, Container, Content, Text,List,ListItem,Left,Right,Button,Icon,Body } from 'native-base';
import { View,Alert, RefreshControl,ScrollView } from "react-native";
import * as apiState from '../redux/ApiState'
import { listCategoryStyles, replaceTitle, brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';

import { YellowBox } from 'react-native'
import PageButtons from './PageButtons'
import ArrowUp from './ArrowUp'
import { goChanUrl } from '../lib/Common'

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

////////////////////////////////////////////////////////////////////////////////

class HomeTabList extends Component {
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
    var data = null
    if (this.props.appState.recs['get:/thread/'+this.props.boardName]) {
      data = this.props.appState.recs['get:/thread/'+this.props.boardName].data.data
    }
    if (!data) {
      return (
        <View style={{
          //backgroundColor: 'red',
          height: 200,
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          }}>
          <Text>ネットワークエラーによりデータがありません.</Text>
        </View>
      )
    }
    var params = {}
    params = {per_page: 50}
    return (
        <>



        <List>
        <ListItem icon style={[listItemStyles,listHeaderStyles(this.props.boardName)]}>
      <Left>
        <Button style={listHeaderStyles(this.props.boardName)}>
          <Icon  name="newspaper" />
        </Button>
      </Left>
      <Body>
        <Text style={{color: '#FFFFFF'}}>{this.props.title}</Text>
      </Body>
      <Right>
      </Right>
      </ListItem>
        </List>

        <List
          dataArray={data}
          renderRow={(item) =>
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
          }
          keyExtractor={(item, index) => index.toString()}
          />

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
  }
}
////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabList)

////////////////////////////////////////////////////////////////////////////////
