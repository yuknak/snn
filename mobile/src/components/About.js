
////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { List, ListItem, Container, Content, Body, Text,Card,CardItem,Button,Icon,Grid,Col,Right } from 'native-base';
import { connect } from 'react-redux'
import * as uiState from '../redux/UiState'
import * as apiState from '../redux/ApiState'
import { Alert } from 'react-native';
import { tutorial_url, hp_url } from '../lib/Common';

////////////////////////////////////////////////////////////////////////////////

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.setNavigation(this.props.navigation,this.props.route.name)
    });
  }
  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    //        <List><ListItem onPress={()=>{Alert.alert('test')}}><Text>test</Text></ListItem></List>
    const button = hp_url() ? (
      <Button onPress={()=>{
                    this.props.navigation.push("MyWebView",
                      {uri: hp_url()})}}
                    ><Text>SUPERNNホームページを見る</Text></Button>
        ) : null 
    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem header >
              <Text>SUPERNN 掲示板速報</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                このサイトは掲示板の書き込みを自動解析し、人気の高い記事及び最新の記事をリアルタイムで提供しています。
                </Text>
              </Body>
            </CardItem>
            <CardItem >
              {button}
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
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setNavigation: (navigation,routeName) =>
      dispatch(uiState.setNavigation(navigation,routeName)),
  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(About)

////////////////////////////////////////////////////////////////////////////////