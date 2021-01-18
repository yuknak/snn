
import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import * as uiState from '../redux/UiState'
import * as appState from '../redux/AppState'
import * as settingState from '../redux/SettingState'
import { Formik } from 'formik'
import { brandColors, formatEpoch, listItemStyles, listHeaderStyles } from '../lib/Common';

import { Title,Header, CardItem, Container, Content, Button, Left, Right, Body, Text,Icon,List,ListItem,Switch,Grid,Col,Card,Picker } from 'native-base'

import { YellowBox } from 'react-native'
import { Alert } from 'react-native';
YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])
import { addForceUpdateObj, forceUpdate } from '../lib/Common'

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
      <ListItem icon key={'goch_view_article_mode'}>
      <Left>
      <Button style={{ backgroundColor: "#007AFF" }}>
      <Icon active name="newspaper" />
      </Button>
      </Left>
      <Body>
        <Text>閲覧記事件数</Text>
      </Body>

      <Picker
      renderHeader={backAction =>
        <Header>
          <Left>
            <Button transparent onPress={backAction}>
              <Icon name="chevron-back-outline"/>
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title>閲覧時の記事件数</Title>
          </Body>
          <Right />
        </Header>}
          mode="dropdown"
          iosIcon={<Icon name="chevron-down-outline" />}
          style={{ width: undefined }}
          placeholder="選択してください"　// 無い場合
          placeholderStyle={{ color: "#bfc6ea" }}
          placeholderIconColor="#007aff"
          selectedValue={this.state.settings.goch_view_article_mode}
          onValueChange={(value)=>{
            this.state.settings.goch_view_article_mode = value
            //deep copy
            this.setState({settings: JSON.parse(JSON.stringify(this.state.settings))})
          }}
        >
          <Picker.Item label="最新50" value="bottom50" />
          <Picker.Item label="1-100" value="top100" />
          <Picker.Item label="全部" value="all" />
        </Picker>

      </ListItem>
      )
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
        <Text>広告等を除去</Text>
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
        <ListItem icon key={'report_inproper'}>
        <Left>
        <Button style={{ backgroundColor: "#007AFF" }}>
        <Icon active name="close-circle" />
        </Button>
        </Left>
        <Body>
          <Text>長押しで不適切報告</Text>
        </Body>
        <Right>
          <Switch value={this.state.settings.report_inproper} onValueChange={
            (value) => {
              if (value == false) {
                Alert.alert("確認",
                "OFFにすると,いったん非表示(報告)した全記事が再び表示されますが"
                +"よろしいですか?",
                [{ text: 'はい',
                      onPress: () => {
                        this.props.clearBanList()
                        forceUpdate()
                        this.state.settings.report_inproper = false
                        //deep copy
                        this.setState({settings: JSON.parse(JSON.stringify(this.state.settings))})
                      } 
                    },
                    { text: 'キャンセル',
                      onPress: () => { } 
                    }
                  ])
              } else {
                this.state.settings.report_inproper = true
                //deep copy
                this.setState({settings: JSON.parse(JSON.stringify(this.state.settings))})              
              }

            }}/>
        </Right>
        </ListItem>
        )
        itemList.push(
          <ListItem icon key={'block_inproper'}>
          <Left>
          <Button style={{ backgroundColor: "#007AFF" }}>
          <Icon active name="close-circle" />
          </Button>
          </Left>
          <Body>
            <Text>不適切投稿の表示確認</Text>
          </Body>
          <Right>
          <Switch value={this.state.settings.block_inproper} onValueChange={
          (value) => {
            this.state.settings.block_inproper = value
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
        <Text>起動初期画面表示</Text>
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
    clearBanList: () =>
      dispatch(settingState.clearBanList()),
  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(SettingsTab)

////////////////////////////////////////////////////////////////////////////////