////////////////////////////////////////////////////////////////////////////////

import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import * as apiState from '../redux/ApiState'
import * as settingState from '../redux/SettingState'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Linking, Platform } from 'react-native'

import { StyleProvider } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform';

import HomeHeader from './MyHeader'
import NavDrawerScreens from './NavDrawerScreens'
import MyWebView from './MyWebView'
import Tutorial from './Tutorial'
import Contract from './Contract'
import { Alert } from 'react-native'
import { getDeviceInfo, tutorial_url, hp_url, contract_url } from '../lib/Common';

const Stack = createStackNavigator()

////////////////////////////////////////////////////////////////////////////////
class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    if (typeof this.props.settingState.settings.report_inproper
      === 'undefined') { // 1.0.1->1.0.3 data upgrade
        this.props.clearBanList() //create ban_list for 1.0.3
console.log("create ban_list for 1.0.3")
        if (this.props.settingState.settings)// to be secure
        {
          var settings = 
            JSON.parse(JSON.stringify(this.props.settingState.settings))
          settings.report_inproper = true // new report_inproper default value for 1.0.3
          settings.block_inproper = true // new block_inproper default value for 1.0.3
console.log("new settings default value for 1.0.3")
          this.props.updateSettings(JSON.parse(JSON.stringify(settings)))
        }
    }
    //Alert.alert(JSON.stringify(this.props.settingState))
    //this.id = setInterval(()=>
    //{
      var state = this.props.appInfoState.appStateReducer.state
      console.log("Main:"+state)
      //if (state == 'active') { DID NOT WORK ONLY ON REAL IPHONE RELEASE
        //api
        var info = getDeviceInfo()
        console.log("Main:"+JSON.stringify(info))
        this.props.api({
          method: 'post',
          url: '/user/check',
          params: {info: encodeURIComponent(JSON.stringify(info))},
          //noLoading: true
        }, (res)=>{ 
          hp_url(res.data.hp_url)
          tutorial_url(res.data.tutorial_url)
          contract_url(res.data.contract_url)

        // Version check by server => 
        // Showing 'please update' msgbox and jump to url
        if (res.data.show_msgbox) {
        Alert.alert(
          res.data.msg_title,
          res.data.msg_body,
          [
            {
              text: 'OK',
              onPress: () => {
                if (res.data.do_redir) {
                  if (Platform.OS === 'android') {
                    Linking.openURL(res.data.redir_url_android)
                  } else {
                    Linking.openURL(res.data.redir_url_ios)
                  }
                }
              } 
            }
          ]
        )
        }  
        }, (e)=> {
          //console.log("Main2:"+JSON.stringify(e))
          //Error
          Alert.alert(
            '',
            'ネットワークにアクセスできません.端末の状態を確認するか,またはあとでやり直してください.')
    
        })

      //}
    //}, 15 * 1000)

  }
  componentWillUnmount() {
    //clearInterval(this.id)
  }
  render() {
    return (
    <StyleProvider style={getTheme(platform)}>
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="NavDrawerScreens"
          component={NavDrawerScreens}
          options={{
          header: () => <HomeHeader onPress={{}} />
          }}/>
      <Stack.Screen
          name="MyWebView"
          component={MyWebView}
          options={{
          header: () => <HomeHeader onPress={{}} />
          }}/>
      <Stack.Screen
          name="Tutorial"
          component={Tutorial}
          options={{
          header: () => <HomeHeader onPress={{}} />
          }}/>
      <Stack.Screen
          name="Contract"
          component={Contract}
          options={{
          header: () => <HomeHeader onPress={{}} />
          }}/>        
      </Stack.Navigator>
    </NavigationContainer>
    </StyleProvider>
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
      api: (params,success,error) =>
        dispatch(apiState.api(params,success,error)),
      updateSettings: (settings) =>
        dispatch(settingState.updateSettings(settings)),
      clearBanList: () =>
        dispatch(settingState.clearBanList()),
    }
  }
////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(Main)

////////////////////////////////////////////////////////////////////////////////
