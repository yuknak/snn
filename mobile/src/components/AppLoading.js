////////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { PureComponent,View } from 'react-native'
import { Spinner } from 'native-base'
import { connect } from 'react-redux';
import * as uiState from '../redux/UiState'
import {ProgressBar, Colors} from 'react-native-paper'

////////////////////////////////////////////////////////////////////////////////

class AppLoading extends React.Component  {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    if (!this.props.uiState.loading) {
      return null
    }
    return (
      <ProgressBar
        indeterminate={true} color={Colors.grey500}
      />
    );
  }
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
