////////////////////////////////////////////////////////////////////////////////

import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import * as uiState from '../redux/UiState'
import * as apiState from '../redux/ApiState'
import * as settingState from '../redux/SettingState'

import { Tabs, Tab, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text,Icon,List,ListItem,Thumbnail,Subtitle,ScrollableTab } from 'native-base';
import HomeHeader from './MyHeader'
import HomeTab from './HomeTab';
import HomeTabTop from './HomeTabTop';
import { Alert, RefreshControl,View } from "react-native";
import Tutorial from './Tutorial'
import { tutorial_url, hp_url } from '../lib/Common';

////////////////////////////////////////////////////////////////////////////////

var board_list = [
  {title: "トップ", key:"top"},
  {title: "新着", key:"latest"},
  {title: "今日", key:"today"},
  {title: "昨日", key:"yesterday"},
  {title: "週間", key:"week"},
]
var scroll_callbacks = [
  null, null, null, null, null
]

////////////////////////////////////////////////////////////////////////////////
class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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
    var tabList = []
    var i = 0
    board_list.forEach((item)=> {
      if (item.key=="top") {
        tabList.push(
          <HomeTabTop
            index={i}
            key={item.key}
            heading={item.title}
            boardName={item.key}
            title={item.title}
            set_scroll_callback={(i, func)=>{ scroll_callbacks[i] = func }}
            {...this.props}
          />
        )
  
      } else {
        tabList.push(
          <HomeTab
            index={i}
            key={item.key}
            heading={item.title}
            boardName={item.key}
            title={item.title}
            set_scroll_callback={(i, func)=>{ scroll_callbacks[i] = func }}
            {...this.props}
          />
        )
      }
      ++i
    })
    // TODO: use theme color in scrollable tab
    return (
      <Container>
        <Tabs
          onChangeTab={(obj)=>{
            //obj.i = index
            func = null
            if (scroll_callbacks[obj.i]) {
              func = scroll_callbacks[obj.i]()
            }
            if (func) {
              func()
            }
          }}
          renderTabBar={()=> <ScrollableTab style={{backgroundColor: '#F8F8F8'}}/>}>
          {tabList}
        </Tabs>
      </Container>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {
    uiState: state.uiState,
    settingState: state.settingState,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setNavigation: (navigation,routeName) =>
      dispatch(uiState.setNavigation(navigation,routeName)),
  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(Home)

////////////////////////////////////////////////////////////////////////////////
