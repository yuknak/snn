
////////////////////////////////////////////////////////////////////////////////

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import * as uiState from '../redux/UiState'
import * as apiState from '../redux/ApiState'
import { Spinner, Header, Title, Button, Left, Right, Body, Icon,Subtitle,Text } from 'native-base'
import AppLoading from './AppLoading'
import AppAlert from './AppAlert'

////////////////////////////////////////////////////////////////////////////////

class MyHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    const menu = (
      <Button transparent onPress={()=>{this.props.uiState.navigation.toggleDrawer()}}>
        <Icon name='menu' />
      </Button>)
    const back = (
      <Button transparent onPress={()=>{this.props.uiState.navigation.goBack()}}>
        <Icon name='chevron-back-outline' />
      </Button>)
    var type = 'menu'
    if (this.props.uiState.routeName == 'About' ||
      this.props.uiState.routeName == 'Settings' ||
      this.props.uiState.routeName == 'MyWebView') {
      type = 'back'
    } else if (this.props.uiState.routeName == 'Tutorial'||
               this.props.uiState.routeName == 'Contract') {
      type = 'none'
    }
    return (
      <>
      <Header>
        <Left>{type=='back' ? back : type=='menu' ? menu : null }</Left>
        <Body>
          <Title>SUPERNN</Title>
          <Subtitle>掲示板速報</Subtitle>
        </Body>
        <Right />
      </Header>
      <AppLoading color='black'/>
      <AppAlert/>
      </>
    )
  }
}
////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {
    uiState: state.uiState,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setNavigation: (navigation,routeName) =>
      dispatch(uiState.setNavigation(navigation,routeName)),
  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(MyHeader)

////////////////////////////////////////////////////////////////////////////////