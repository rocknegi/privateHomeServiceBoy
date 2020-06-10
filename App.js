import React from 'react'
import { View, Text } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import Login from './src/components/Login'
import Dashboard from './src/components/Dashboard'
import landingPage from './src/components/LandingPage';
import Account from './src/components/Account';

const StackNavigation = createStackNavigator({
  Dashboard,
  Account
},{
  initialRouteName:'Dashboard',
  headerMode:'none'
})

const AppNavigator = createSwitchNavigator({
  landingPage,
  Login,
  Dashboard : StackNavigation
},{
  initialRouteName:'landingPage'
})

const AppContainer = createAppContainer(AppNavigator)

export default App = () =>{
  return(
    <AppContainer />
  )
}
