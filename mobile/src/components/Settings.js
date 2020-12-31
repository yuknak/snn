
import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import * as uiState from '../redux/UiState'
import * as appState from '../redux/AppState'
import * as settingState from '../redux/SettingState'
import { Formik } from 'formik'
import { brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';

import { Container, Content, Button, Left, Right, Body, Text,Icon,List,ListItem,Switch,Grid,Col,Card } from 'native-base'
import { Alert } from 'react-native';

////////////////////////////////////////////////////////////////////////////////

class SettingsTab extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      settings: null
    }
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.setNavigation(this.props.navigation,this.props.route.name)
      //Alert.alert('',JSON.stringify(this.props.appState.settings))
      // deep copy
      this.setState({settings: JSON.parse(JSON.stringify(this.props.settingState.settings))})
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      //deep copy
      this.props.updateSettings(JSON.parse(JSON.stringify(this.state.settings)))
    });
  }
  componentWillUnmount() {
    this._unsubscribe()
    this._unsubscribe2()
  }
  render() {
    var itemList = []
    if (!this.state.settings) {
      return null
    }

    itemList.push(
    <ListItem icon key={'webview_desktop'}>
    <Left>

    </Left>
    <Body>
      <Text>PC用ブラウザを用いる</Text>
    </Body>
    <Right>
      <Switch value={this.state.settings.webview_desktop} onValueChange={
        (value) => {
          this.state.settings.webview_desktop = value
          //deep copy
          this.setState({settings: JSON.parse(JSON.stringify(this.state.settings))})
        }}/>
    </Right>
    </ListItem>
    )

    itemList.push(
      <ListItem icon key={'remove_ads'}>
      <Left>

      </Left>
      <Body>
        <Text>広告等を除去(実験版)</Text>
      </Body>
      <Right>
        <Switch value={this.state.settings.remove_ads} onValueChange={
          (value) => {
            this.state.settings.remove_ads = value
            //deep copy
            this.setState({settings: JSON.parse(JSON.stringify(this.state.settings))})
          }}/>
      </Right>
      </ListItem>
      )
  
    return (
      <Container>
        <Content>
          <Card>
            <List>
            {/*
            <ListItem itemDivider><Text>カテゴリ表示する掲示板(最低3つ)</Text></ListItem>
            <ListItem itemDivider/>
            */ }
              {itemList}
            </List>
            </Card>
          </Content>
      </Container>
    )
  }
}
////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {
    uiState: state.uiState,
    appState: state.appState,
    settingState: state.settingState,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setNavigation: (navigation,routeName) =>
      dispatch(uiState.setNavigation(navigation,routeName)),
    updateSettings: (settings) =>
      dispatch(settingState.updateSettings(settings)),
  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(SettingsTab)

////////////////////////////////////////////////////////////////////////////////