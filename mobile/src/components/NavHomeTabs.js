////////////////////////////////////////////////////////////////////////////////

import * as React from 'react'
import { Footer, FooterTab, Button, Text,Icon } from 'native-base'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Home from './Home'
import Settings from './Settings'
import Category from './Category'
import Search from './Search'

////////////////////////////////////////////////////////////////////////////////
// Custom tabBar made with NativeBase by yn
// Base code has been taken from
/// https://reactnavigation.org/docs/bottom-tab-navigator

function MyTabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <Footer>
    <FooterTab>

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        /*
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        */

        return (
          <Button key={index} vertical onPress={onPress} active={isFocused}>
            <Icon name={options.icon} />
            <Text>{label}</Text>
          </Button>
        )
      })}
    </FooterTab>
    </Footer>
  )
}

////////////////////////////////////////////////////////////////////////////////

const Tab = createBottomTabNavigator()

export default function NavHomeTabs() {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="Home"
        options={{title: "ホーム",icon:"home"}} component={Home} />
      <Tab.Screen name="Category"
        options={{title: "カテゴリ",icon:"list"}} component={Category} />
      <Tab.Screen name="Search"
        options={{title: "検索",icon:"search"}} component={Search} />
    </Tab.Navigator>
  )
}

////////////////////////////////////////////////////////////////////////////////
