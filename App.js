import React from 'react'
import { View, Text } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import Login from './src/Componenets/Login'
import Dashboard from './src/Componenets/Dashboard'

const AppNavigator = createSwitchNavigator({
  Login,
  Dashboard
})

const AppContainer = createAppContainer(AppNavigator)

export default App = () =>{
  return(
    <AppContainer />
  )
}
