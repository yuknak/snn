
////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { List, ListItem, Container, Content, Body, Text,Card,CardItem,Button,Icon,Grid,Col,Right } from 'native-base';
import { connect } from 'react-redux'
import * as uiState from '../redux/UiState'
import * as apiState from '../redux/ApiState'
import { Alert } from 'react-native';

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

    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem header bordered>
              <Text>SUPERNN 掲示板ニュース速報</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                このサイトはニュース系掲示板の書き込みを自動解析し、人気の高いニュース及び最新のニュースをリアルタイムで提供しています。
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                Made by yn
                </Text>
              </Body>
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