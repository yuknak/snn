////////////////////////////////////////////////////////////////////////////////

import * as React from 'react'

import { connect } from 'react-redux'
import { Icon } from 'native-base'
import { createDrawerNavigator } from '@react-navigation/drawer'

import NavHomeTabs from './NavHomeTabs'
import Settings from './Settings'
import About from './About'
import * as settingState from '../redux/SettingState'
import Tutorial from './Tutorial'
import { tutorial_url, hp_url } from '../lib/Common';

////////////////////////////////////////////////////////////////////////////////

const Drawer = createDrawerNavigator()

class NavDrawerScreens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {

    setTimeout(()=>{
      if (this.props.settingState.settings.show_tutorial &&
        tutorial_url() != null) {
        this.props.navigation.replace("Tutorial",
        {uri: tutorial_url()})

      }
    }, 1000)

  }
  render() {
    return (
      <Drawer.Navigator initialRouteName="NavHomeTabs">
        <Drawer.Screen name="NavHomeTabs" options={{title: "記事速報", drawerIcon: () => (<Icon name="newspaper"/>)}} component={NavHomeTabs}/>
        <Drawer.Screen name="Settings" options={{title: "設定", drawerIcon: () => (<Icon name="settings"/>)}} component={Settings} />
        <Drawer.Screen name="About" options={{title: "このアプリについて", drawerIcon: () => (<Icon name="information-circle" />)}} component={About} />
      </Drawer.Navigator>
    )
  
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

export default connect(mapStateToProps, mapDispatchToProps)(NavDrawerScreens)

////////////////////////////////////////////////////////////////////////////////

