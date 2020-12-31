import React, { Component } from 'react';
import { StyleSheet } from 'react-native'
import { Container, Header, Content, List, ListItem, Text } from 'native-base';

const styles = StyleSheet.create({
  itemOne: { backgroundColor: 'red', marginLeft: 0 },
  itemTwo: { backgroundColor: 'blue', marginLeft: 0 },
  itemThree: { backgroundColor: 'green', marginLeft: 0 },
  itemFour: { backgroundColor: 'violet', marginLeft: 0 },

})
const routes = [
  { id: 1, title: 'Home', image: 'home', cstyle: styles.itemOne },
  { id: 2, title: 'Chat', image: 'flask', cstyle: styles.itemTwo },
  { id: 3, title: 'Profile', image: 'briefcase', cstyle: styles.itemThree },
  { id: 5, title: 'Logout', image: 'log-out', cstyle: styles.itemFour }
];
export default class Test extends Component {
  render() {
    return (
      <Container>
        <Content>
          <List dataArray={routes}
            renderRow={(data) =>
              <ListItem style={data.cstyle}
                button icon><Text>{data.id}. {data.title}</Text>
              </ListItem>}>
          </List>
        </Content>
      </Container>
    );
  }
}