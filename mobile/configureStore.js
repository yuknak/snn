////////////////////////////////////////////////////////////////////////////////

import { createStore as
  reduxCreateStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist'
import { encryptTransform } from 'redux-persist-transform-encrypt';
import AsyncStorage from '@react-native-community/async-storage';

import apiStateReducer from './src/redux/ApiState';
import appStateReducer from './src/redux/AppState';
import uiStateReducer from './src/redux/UiState';
import settingStateReducer from './src/redux/SettingState';
import appInfoStateReducer from './src/redux/AppInfoState'; //redux-rn-misc-enhancer

////////////////////////////////////////////////////////////////////////////////
// redux-rn-misc-enhancer
// to get globally state of app(active, inactive etc)
// https://github.com/quipper/redux-rn-misc-enhancer

import { compose } from 'redux';
import {
  applyAppStateListener,
  //applyNetInfoListener, // NetInfo is deprecated
} from 'redux-rn-misc-enhancer';

const enhancer = compose(
  applyAppStateListener(),
  //applyNetInfoListener(),
);

////////////////////////////////////////////////////////////////////////////////
// Using Redux-Thunk framework with persist and encrypting

const encryptor = encryptTransform({
  secretKey: 'n84BHzJe',
  onError: function(error) {
  }
})

const persistConfig = {
  version: 1,
  key: 'snncli.root',
  storage: AsyncStorage,
  transforms: [encryptor],
  whitelist: ['settingState'],
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    appInfoState: appInfoStateReducer,// redux-rn-misc-enhancer
    apiState: apiStateReducer,
    appState: appStateReducer,
    uiState: uiStateReducer,
    settingState: settingStateReducer,
  })
)

//TODO: loggers must be only worked at development
//https://hacknote.jp/archives/26111/

const store = reduxCreateStore(
  //persistedReducer, applyMiddleware(logger, thunk)
  //persistedReducer, applyMiddleware(thunk)
  persistedReducer, compose(enhancer, applyMiddleware(thunk))
)

export const persistor = persistStore(store)
export default store

////////////////////////////////////////////////////////////////////////////////