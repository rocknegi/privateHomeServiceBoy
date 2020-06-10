import React, { Component } from 'react'
import { Text, View, Alert, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, FlatList, ColorPropType, KeyboardAvoidingView, Dimensions, Platform, SafeAreaView, AsyncStorage, ToastAndroid } from 'react-native'
import firestore from '@react-native-firebase/firestore';

import { styles } from './theme/theme';
const PrimayColor = '#D87314';
const data = firestore().collection('ManagersData');

export default class Account extends Component {
    state = {
        password: '',
        newPassword: '',
    }

    checkCreds = async() => {
        const user = await AsyncStorage.getItem('user');
        if(this.state.newPassword.length===0)
        ToastAndroid.showWithGravity('New pass can not be empty',ToastAndroid.SHORT,ToastAndroid.CENTER)

        else{
            data.doc(user).get().then(doc => {
                if (doc["_data"] === undefined)
                ToastAndroid.showWithGravity('Wrong old password',ToastAndroid.SHORT,ToastAndroid.CENTER)
                else if (doc["_data"]["pass"] != this.state.password)
                ToastAndroid.showWithGravity('Wrong old password',ToastAndroid.SHORT,ToastAndroid.CENTER)

                else {
                    data.doc(user).update({
                        pass:this.state.newPassword
                    });
                    ToastAndroid.showWithGravity('password changed',ToastAndroid.LONG,ToastAndroid.BOTTOM)
                    this.props.navigation.navigate('Login')
                }
            })
        }

    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.header, { height: 50 }]}>
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
                        <Image
                            style={{ height: 35, width: 38, margin: 5 }}
                            source={require('../assets/images/back.png')} />

                    </TouchableWithoutFeedback>

                </View>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ marginTop: '10%' }}>
                        <View style={styles.field}>
                            <TextInput
                                placeholder="Old password"
                                style={[styles.input, { textAlign: 'center' }]}
                                keyboardType={'number-pad'}
                                value={this.state.password}
                                onChangeText={(value) => this.setState({ password: value })}
                            />
                        </View>

                        <View style={[styles.field, { flexDirection: 'column', marginTop: 5 }]}>
                            <TextInput
                                placeholder="New Password"
                                style={[styles.input, { textAlign: 'center' }]}
                                autoCapitalize='none'
                                value={this.state.newPassword}
                                onChangeText={(value) => this.setState({ newPassword: value })}
                            />
                        </View>

                        <TouchableOpacity style={[styles.buttonContainer, { marginTop: 10, marginHorizontal: '30%' }]} onPress={this.checkCreds}>
                            <Text style={styles.buttonText}>Change</Text>
                        </TouchableOpacity>

                    </View>
                </TouchableWithoutFeedback>

            </SafeAreaView>
        )
    }
}
