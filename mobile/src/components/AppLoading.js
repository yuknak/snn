////////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { View } from 'react-native'
import { Spinner } from 'native-base'
import { connect } from 'react-redux';
import * as uiState from '../redux/UiState'
//import {ProgressBar} from '@react-native-community/progress-bar-android'
import {ProgressBar, Colors} from 'react-native-paper'

////////////////////////////////////////////////////////////////////////////////
//      <Spinner color='black' />


const AppLoading = (props) => {
  if (props.uiState.loading) {
    //return null
    return (
      <ProgressBar
        indeterminate={true} color={Colors.grey500}
      />
    );
  }
  return null;
}

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {
    uiState: state.uiState
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startLoading: () =>
      dispatch(uiState.startLoading()),
    endLoading: () =>
      dispatch(uiState.endLoading()),
  }
}

////////////////////////////////////////////////////////////////////////////////

export default connect(mapStateToProps, mapDispatchToProps)(AppLoading);

////////////////////////////////////////////////////////////////////////////////
