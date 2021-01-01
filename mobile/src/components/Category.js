////////////////////////////////////////////////////////////////////////////////

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { Tabs, Tab, Container, ScrollableTab } from 'native-base'
import CategoryTab from './CategoryTab'
import { Alert } from "react-native";
import * as uiState from '../redux/UiState'
import * as appState from '../redux/AppState'

////////////////////////////////////////////////////////////////////////////////

const boards = [
  {title_cached: "ニュー速", name:"newsplus",
    server_name_cached:"asahi.5ch.net",enable:true},
  {title_cached: "芸スポ", name:"mnewsplus",
    server_name_cached:"hayabusa9.5ch.net",enable:true},
  {title_cached: "東アジア", name:"news4plus",
    server_name_cached:"lavender.5ch.net",enable:true},
  {title_cached: "ビジネス", name:"bizplus",
    server_name_cached:"egg.5ch.net",enable:true},
  {title_cached: "政治", name:"seijinewsplus",
    server_name_cached:"fate.5ch.net",enable:true},
  {title_cached: "国際", name:"news5plus",
    server_name_cached:"egg.5ch.net",enable:true},
  {title_cached: "科学", name:"scienceplus",
    server_name_cached:"egg.5ch.net",enable:true},
  {title_cached: "ローカル", name:"femnewsplus",
    server_name_cached:"egg.5ch.net",enable:true},
  {title_cached: "萌え", name:"moeplus",
    server_name_cached:"egg.5ch.net",enable:true},
  {title_cached: "アイドル", name:"idolplus",
    server_name_cached:"asahi.5ch.net",enable:true},
  {title_cached: "痛い", name:"dqnplus",
    server_name_cached:"egg.5ch.net",enable:true},
]

var scroll_callbacks = [
  null, null, null, null, null,
  null, null, null, null, null,
  null
]

////////////////////////////////////////////////////////////////////////////////

class Category extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: -1
    }
  }
  setTab(board_name) {
    var index = 0;
    var ret = -1;
    boards.some((board)=>{
      if (board.name == board_name && board.enable) {
        ret = index
        return true
      }
      ++index
    })
    if (ret >= 0) {
      // this is a messy hack(--)
      setTimeout(()=>{
        this.setState({activeTab: ret})
      }, 100)
      func = null
      if (scroll_callbacks[ret]) {
        func = scroll_callbacks[ret]()
      }
      if (func) {
        func()
      }
      setTimeout(()=>{
        this.setState({activeTab: -1})
      }, 600)
    } else {
      console.log('Tab index error!')
    }
  } 
  componentDidMount() {
    //this.props.initState('test4') // TODO:
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.setNavigation(this.props.navigation,this.props.route.name)
      if (this.props.route.params && this.props.route.params.from &&
        this.props.route.params.from == 'board.header') {
        // only when user click in the top page
        if (this.props.route.params && this.props.route.params.boardName) {
          // Jump into activated tab
          var targetBoardName = this.props.route.params.boardName
          this.setTab(targetBoardName)
        }
        this.props.route.params.from=''
      }

    });
  }
  componentWillUnmount() {
    this._unsubscribe()
  }
  render() {
    var tabList = []
    //if (!this.props.appState.settings||!this.props.appState.settings.boards) {
    //  return null
    //}
    var i = 0
    boards.forEach((item)=> {
      if (item.enable) {
        tabList.push(
          <CategoryTab
            index={i}
            key={item.name}
            heading={item.title_cached}
            boardName={item.name}
            title={item.title_cached}
            serverName={item.server_name_cached}
            set_scroll_callback={(i, func)=>{ scroll_callbacks[i] = func }}
            {...this.props}
          />
        )
        ++i
      }
    })
    // TODO: use theme color in scrollable tab
    var tabs = null
    if (this.state.activeTab >= 0) {
      tabs = (
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
          page={this.state.activeTab}
          renderTabBar={()=> <ScrollableTab style={{backgroundColor: '#F8F8F8'}}/>}
        >
          {tabList}
        </Tabs>
      )
    } else {
      tabs = (
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
          renderTabBar={()=> <ScrollableTab style={{backgroundColor: '#F8F8F8'}}/>}
        >
          {tabList}
        </Tabs>
      )
    }

    // TODO: use theme color in scrollable tab
    //console.log('activetab:'+this.state.activeTab)
    return (
      <Container>
        {tabs}
      </Container>
    );

  }
}

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {
    uiState: state.uiState,
    appState: state.appState,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    //initState: (sessionUid) =>
    //  dispatch(uiState.initState(sessionUid)),
    setNavigation: (navigation,routeName) =>
      dispatch(uiState.setNavigation(navigation,routeName)),
  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(Category)

////////////////////////////////////////////////////////////////////////////////