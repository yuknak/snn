
////////////////////////////////////////////////////////////////////////////////

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {  View, TouchableOpacity } from 'react-native'
import {  Button, Icon } from 'native-base'

////////////////////////////////////////////////////////////////////////////////

class ArrowUp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <TouchableOpacity style={{           
        position: 'absolute',
        bottom: 25,
        right: 25,
        width: 50, 
        height: 50,
        backgroundColor: '#007aff',   
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={()=>{this.props.onPress()}}
      >
      <Icon style={{color: '#ffffff'}} name="arrow-up"/>
      </TouchableOpacity>     
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

export default connect(mapStateToProps, mapDispatchToProps)(ArrowUp)

////////////////////////////////////////////////////////////////////////////////