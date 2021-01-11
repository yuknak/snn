////////////////////////////////////////////////////////////////////////////////

import React from 'react'
import { connect } from 'react-redux';
import * as uiState from '../redux/UiState'
import { Text, View } from 'react-native'
////////////////////////////////////////////////////////////////////////////////

const AppAlert = (props) => {
  var variant = props.uiState.alertVariant
  var message = props.uiState.alertMessage
  if (message) {
    return (
      <View>
      <Text>ネットワークにアクセスできません.端末の状態を確認するか,またはあとでやり直してください.</Text>
      </View>
    );
  }
  return null
}

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {
    uiState: state.uiState
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showAlert: (variant, message) =>
      dispatch(uiState.showAlert(variant, message)),
    hideAlert: () =>
      dispatch(uiState.hideAlert()),
  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(AppAlert);

////////////////////////////////////////////////////////////////////////////////
