////////////////////////////////////////////////////////////////////////////////
//import 'react-native-gesture-handler'; // moved to index.js

import * as React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './configureStore'
import Main from './src/components/Main'
//import { Alert } from 'react-native'

////////////////////////////////////////////////////////////////////////////////

export default class App extends React.Component {
  componentDidMount() {
    //Alert.alert('mount')
  }
  render() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Main />
      </PersistGate>
    </Provider>
  )
  }
}
////////////////////////////////////////////////////////////////////////////////
