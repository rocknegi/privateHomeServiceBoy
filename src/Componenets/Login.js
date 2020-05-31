import React, { useState } from 'react'
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform,StyleSheet } from 'react-native'


const Login = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Email"
                                value={username}
                                textContentType='emailAddress'
                                autoCapitalize="none"
                                style={styles.input}
                                onChange={e => setUsername(e.target.value)}
                            />
                            <TextInput
                                placeholder="Password"
                                value={password}
                                secureTextEntry={true}
                                style={styles.input}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </View>
                        <TouchableOpacity 
                        onPress={()=>navigation.navigate('Dashboard')}
                        style={styles.button}>
                            <Text style={styles.buttonText}>
                                Login
                </Text>
                        </TouchableOpacity>
                    </View>

                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default Login
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    button: {
        backgroundColor: '#cfd8dc',
        alignSelf: 'center',
        padding: 10,
        paddingHorizontal: '8%',
        borderRadius: 6,
    },
    buttonText: {
        color: '#fafafa',
        fontSize: 17
    },
    text: {
        textAlign:'center'
    },
    form: {
        flex: 1,
        justifyContent: 'center'
    },
    inputContainer: {
        // flex:1,
        marginHorizontal: '10%',
        marginTop: '10%',
        justifyContent: 'center'
    },
    input: {
        backgroundColor: '#eee',
        borderRadius: 6,
        margin: 10,
        padding: 10
    },

})