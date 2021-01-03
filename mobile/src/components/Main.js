////////////////////////////////////////////////////////////////////////////////

import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import * as apiState from '../redux/ApiState'
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
import { Alert } from 'react-native'
import { getDeviceInfo, tutorial_url, hp_url } from '../lib/Common';

const Stack = createStackNavigator()

////////////////////////////////////////////////////////////////////////////////
class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
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
          console.log("Main:"+JSON.stringify(e))
          //Error
          Alert.alert('','ネットワークエラー.')
    
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
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      api: (params,success,error) =>
        dispatch(apiState.api(params,success,error)),
    }
  }
////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(Main)

////////////////////////////////////////////////////////////////////////////////
