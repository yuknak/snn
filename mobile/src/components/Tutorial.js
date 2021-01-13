import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Linking, Platform } from 'react-native'
import { Container, Item, Header, Title, Input, Content, Footer, FooterTab, Button, Left, Right, Body, Text,Icon,List,ListItem,Thumbnail,Subtitle,Spinner } from 'native-base';
import * as uiState from '../redux/UiState'
import * as appState from '../redux/AppState'
import * as settingState from '../redux/SettingState'
import ArrowUp from './ArrowUp'
import { getDeviceInfo, tutorial_url, hp_url, contract_url } from '../lib/Common';

////////////////////////////////////////////////////////////////////////////////

import { WebView } from 'react-native-webview';
import { Alert } from 'react-native';
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'shouldStartLoad', // TODO: Remove when fixed
  'startLoadWithResult',
])

////////////////////////////////////////////////////////////////////////////////

class Tutorial extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      loading: false
    }
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.setNavigation(this.props.navigation,this.props.route.name)
      //Alert.alert(JSON.stringify(this.props.route))
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      this.props.endLoading()
    });
  }
  componentWillUnmount() {
    this._unsubscribe()
    this._unsubscribe2()
    //Alert.alert('web unmount')
  }
  // How to inject JS in details
  //https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md
  render() {
    var uri = this.props.route.params.uri
    const runFirst = `
      true;
    `;
    if (Platform.OS === 'android') {
      var id = setInterval(()=>{
        if (this.webref) {
          this.webref.injectJavaScript(runFirst);
          clearInterval(id);
        }        
      }, 1500);  
    }
    var userAgent = undefined
    var webview = Platform.select({
      ios: (<WebView
        userAgent={userAgent}
        ref={(r) => (this.webref = r)}
        injectedJavaScriptBeforeContentLoaded={runFirst}
        injectedJavaScriptBeforeContentLoadedForMainFrameOnly={true}
        source={{uri: uri}}
        onLoad={()=>{  }}
        onLoadStart={()=>{this.props.startLoading()}}
        onLoadEnd={()=>{this.props.endLoading()}}
        onNavigationStateChange={(e) => {
          this.setState({url: e.url})
        }}
      />),
      android: (<WebView
        userAgent={userAgent}
        ref={(r) => (this.webref = r)}
        source={{uri: uri}}
        onLoad={()=>{  }}
        onLoadStart={()=>{this.props.startLoading()}}
        onLoadEnd={()=>{this.props.endLoading()}}
        onNavigationStateChange={(e) => {
          this.setState({url: e.url})
        }}
      />)
    })

    return (
      <>
      <Container>
        {webview}
      </Container>
        <Footer>
          <FooterTab>
          <Button  onPress={()=>{
            this.props.navigation.replace("Contract", {uri: contract_url() }) 
          }}>
            <Text style={{ fontWeight: 'bold' }}>利用規約とプライバシーポリシーを見る</Text>
          </Button>
          </FooterTab>
        </Footer>
        </>
    );
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
    startLoading: () =>
      dispatch(uiState.startLoading()),
    endLoading: () =>
      dispatch(uiState.endLoading()),
    updateSettings: (settings) =>
      dispatch(settingState.updateSettings(settings)),
  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial)

////////////////////////////////////////////////////////////////////////////////