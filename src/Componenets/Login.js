import React from 'react'
import { View, Text } from 'react-native'

const Login = ({navigation}) => {
    return (
        <View>
            <Text>Login</Text>
            <Text onPress={()=>navigation.navigate('Dashboard')}>Dashboard</Text>
        </View>
    )
}

export default Login
