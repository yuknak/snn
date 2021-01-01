////////////////////////////////////////////////////////////////////////////////

import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import * as apiState from '../redux/ApiState'
import { NavigationContainer } from '@react-navigation/native'

import { StyleProvider } from 'native-base'
import getTheme from './native-base-theme/components'
import platform from './native-base-theme/variables/platform';

import HomeHeader from './MyHeader'
import NavDrawerScreens from './NavDrawerScreens'
import MyWebView from './MyWebView'
//import { Alert } from 'react-native'

////////////////////////////////////////////////////////////////////////////////
class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {

  }
  componentWillUnmount() {

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
