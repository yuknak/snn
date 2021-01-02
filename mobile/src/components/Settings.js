
import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import * as uiState from '../redux/UiState'
import * as appState from '../redux/AppState'
import * as settingState from '../redux/SettingState'
import { Formik } from 'formik'
import { brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';

import { CardItem, Container, Content, Button, Left, Right, Body, Text,Icon,List,ListItem,Switch,Grid,Col,Card } from 'native-base'

import { YellowBox } from 'react-native'
import { Alert } from 'react-native';
YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

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
      if (this.props.settingState.settings) {
        this.setState({settings: JSON.parse(JSON.stringify(this.props.settingState.settings))})
      }
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      //deep copy
      if (this.state.settings) {
        this.props.updateSettings(JSON.parse(JSON.stringify(this.state.settings)))
      }
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
    <Button style={{ backgroundColor: "#007AFF" }}>
    <Icon active name="desktop" />
    </Button>
    </Left>
    <Body>
      <Text>PC用ブラウザを使用</Text>
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
      <Button style={{ backgroundColor: "#007AFF" }}>
      <Icon active name="shield" />
      </Button>
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
    itemList.push(
      <ListItem icon key={'show_tutorial'}>
      <Left>
      <Button style={{ backgroundColor: "#007AFF" }}>
      <Icon active name="rocket" />
      </Button>
      </Left>
      <Body>
        <Text>起動時チュートリアル表示</Text>
      </Body>
      <Right>
        <Switch value={this.state.settings.show_tutorial} onValueChange={
          (value) => {
            this.state.settings.show_tutorial = value
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
            <ListItem itemDivider><Text>設定</Text></ListItem>
              {itemList}
              <ListItem itemDivider/>
            </List>
            <CardItem>
            <Text>※設定を反映するには
              <Icon style={{fontSize: 18, color:'#007aff'}} name='chevron-back-outline' />
              を押してください.</Text>
            </CardItem>
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