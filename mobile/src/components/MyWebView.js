import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Linking, Platform } from 'react-native'
import { Container, Item, Header, Title, Input, Content, Footer, FooterTab, Button, Left, Right, Body, Text,Icon,List,ListItem,Thumbnail,Subtitle,Spinner } from 'native-base';
import * as uiState from '../redux/UiState'
import * as appState from '../redux/AppState'
import * as settingState from '../redux/SettingState'
import ArrowUp from './ArrowUp'

////////////////////////////////////////////////////////////////////////////////

import { WebView } from 'react-native-webview';
import { Alert } from 'react-native';
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'shouldStartLoad', // TODO: Remove when fixed
  'startLoadWithResult',
])

////////////////////////////////////////////////////////////////////////////////

class MyWebView extends PureComponent {
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
    // Remove ads
    const runFirst = `
      function clean() {
        var len = 0;
        var elems = null;
        var elem = null;

        // only in 5ch.net
        if (location.href.indexOf('.5ch.net') < 0) {
          return
        }

        //remove target blank
        elems = document.getElementsByTagName('a');
        if (elems) {
          for (var i = 0; i < elems.length; ++i) {
            elems[i].removeAttribute('target');
          }
        }
        //remove target blank
        
        // start for desktop headers or something
        elems = document.getElementsByClassName('navbar-fixed-top');
        if (elems && elems[0]) {
          elems[0].remove();
        }
        elems = document.getElementsByClassName('topmenu');
        if (elems && elems[0]) {
          elems[0].remove();
        }
        elems = document.getElementsByClassName('socialmedia');
        if (elems && elems[0]) {
          elems[0].remove();
        }
        // end for desktop headers or something

        elem = document.getElementById('main');
        if (elem) {
          elem.removeAttribute('class')
        }
        elem = document.getElementById('header');
        if (elem) {
          elem.remove();
        }
        elems = document.getElementsByClassName('socialwrap');
        if (elems && elems[0]) {
          elems[0].remove();
        }
        len = document.getElementsByClassName("js-overlay_ad").length;
        for (var i = 0; i < len; ++i) {
          document.getElementsByClassName("js-overlay_ad")[0].remove();
        }
        len = document.getElementsByClassName("microad_compass_ad").length;
        for (var i = 0; i < len; ++i) {
          document.getElementsByClassName("microad_compass_ad")[0].remove();
        }
        len = document.getElementsByClassName("res_ad").length;
        for (var i = 0; i < len; ++i) {
          document.getElementsByClassName("res_ad")[0].remove();
        }
        len = document.getElementsByClassName("roninform_wrap").length;
        for (var i = 0; i < len; ++i) {
          document.getElementsByClassName("roninform_wrap")[0].remove();
        }
        len = document.getElementsByClassName("ad").length;
        for (var i = 0; i < len; ++i) {
          document.getElementsByClassName("ad")[0].remove();
        }
        len = document.getElementsByTagName("iframe").length;
        for (var i = 0; i < len; ++i) {
          document.getElementsByTagName("iframe")[0].remove();
        }
        elems = document.getElementsByClassName('float-nav');
        if (elems && elems[0]) {
          elems[0].remove();
        }
        elems = document.getElementsByClassName('float-nav-go-bottom');
        if (elems && elems[0]) {
          elems[0].remove();
        }
      }
      var timer = setInterval(clean, 1000);
      true;
    `;
    if (Platform.OS === 'android' && this.props.settingState.settings.remove_ads) {
      var id = setInterval(()=>{
        if (this.webref) {
          this.webref.injectJavaScript(runFirst);
          clearInterval(id);
        }        
      }, 1500);  
    }
    var userAgent = undefined
    if (this.props.settingState.settings.webview_desktop) {
      if (Platform.OS === 'android') {
        userAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
      } else {
        userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87 Version/11.1.1 Safari/605.1.15"
      }
    }
    var webview
    if (this.props.settingState.settings.remove_ads) {
      webview = Platform.select({
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
        />),
      });
    } else {
      webview = Platform.select({
        ios: (<WebView
          userAgent={userAgent}
          ref={(r) => (this.webref = r)}
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
        />),
      });
    }
    var loadingDiv = (<Spinner color='black'/>)
    return (
      <>
      <Container>
        { /* this.state.loading ? loadingDiv : null */ }
        {webview}

      </Container>
        <Footer>
          <FooterTab>
          <Button  onPress={()=>{Linking.openURL(this.state.url)}}>
            <Icon name="browsers"/>
            <Text>ブラウザ</Text>
          </Button>
          <Button  onPress={()=>{
            if (this.webref) {
              this.webref.goBack()
            }
            }}>
            <Icon name="chevron-back"/>
            <Text>戻る</Text>
          </Button>
          <Button  onPress={()=>{
            if (this.webref) {
              this.webref.reload()
            }
            }}>
            <Icon name="refresh"/>
            <Text>更新</Text>
          </Button>
          <Button  onPress={()=>{this.props.navigation.goBack()}}>
            <Icon name="close"/>
            <Text>閲覧終了</Text>
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
  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(MyWebView)

////////////////////////////////////////////////////////////////////////////////