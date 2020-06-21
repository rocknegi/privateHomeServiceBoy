import React, { Component } from 'react'
import { Text, View, Alert, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, FlatList, ColorPropType, KeyboardAvoidingView, Dimensions, Platform, SafeAreaView, AsyncStorage, ToastAndroid } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';

import { styles } from './theme/theme';
import ChangeUserData from './ChangeUserData';
import Map from './map';

const PrimayColor = '#D87314';
const data = firestore().collection('ManagersData');
const boys = firestore().collection('Boys');

export default class Account extends Component {
    state = {
        password: '',
        newPassword: '',
        isModalVisible: false,
        isMapModalVisible: false,
        marker: {
            latitude: 0,
            longitude: 0,
        },
    }

    async componentDidMount() {
        const user = await AsyncStorage.getItem('user');

        boys.doc(user).get().then(doc => {
            if (doc.data().lat !== 0) {
                this.setState({
                    marker: {
                        latitude: doc.data().lat,
                        longitude: doc.data().long
                    }
                })
            }
        })


    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible })
    }
    toggleMapModal = () => {
        this.setState({ isMapModalVisible: !this.state.isMapModalVisible })
    }
    checkCreds = async () => {
        const user = await AsyncStorage.getItem('user');
        if (this.state.newPassword.length === 0)
            ToastAndroid.showWithGravity('New pass can not be empty', ToastAndroid.SHORT, ToastAndroid.BOTTOM)

        else {
            boys.doc(user).get().then(doc => {
                console.log(doc.data())
                if (doc["_data"] === undefined)
                    ToastAndroid.showWithGravity('Wrong old password', ToastAndroid.SHORT, ToastAndroid.BOTTOM)
                else if (doc["_data"]["pass"] != this.state.password)
                    ToastAndroid.showWithGravity('Wrong old password2', ToastAndroid.SHORT, ToastAndroid.BOTTOM)

                else {
                    boys.doc(user).update({
                        pass: this.state.newPassword
                    });
                    ToastAndroid.showWithGravity('password changed', ToastAndroid.LONG, ToastAndroid.BOTTOM)
                    this.props.navigation.navigate('Login')
                }
            })
        }

    }
    saveMarkerLocation = (location) => {
        this.setState({
            marker: {
                latitude: location.latitude,
                longitude: location.longitude
            }
        }, () => this.saveData())
    };

    saveData = async () => {
        const user = await AsyncStorage.getItem('user');
        // console.log(user)
        boys.doc(user).update({
            lat: this.state.marker.latitude,
            long: this.state.marker.longitude
        })

    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Modal
                    isVisible={this.state.isModalVisible}
                    style={{
                        justifyContent: 'center',
                    }}
                    onBackdropPress={this.toggleModal}
                    swipeDirection={['up', 'left', 'right', 'down']}
                >
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
                </Modal>
                <Modal
                    // style={{ maxHeight:'80%',paddingTop:'10%'}}
                    isVisible={this.state.isMapModalVisible}
                // onBackdropPress={this.toggleMapModal}
                >
                    <Map
                        coords={this.state.marker}
                        saveMarkerLocation={this.saveMarkerLocation}
                        toggle={this.toggleMapModal}
                    />
                </Modal>
                <View style={[styles.header, { height: 50 }]}>
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
                        <Image
                            style={{ height: 35, width: 38, margin: 5 }}
                            source={require('../assets/images/back.png')} />

                    </TouchableWithoutFeedback>

                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ marginTop: '5%', flex: 1 }}>
                            <TouchableOpacity style={[styles.buttonContainer, { marginTop: 10, marginHorizontal: '30%' }]} onPress={this.toggleModal}>
                                <Text style={styles.buttonText}>Change password</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.buttonContainer, { marginTop: 20, marginHorizontal: '30%' }]} onPress={this.toggleMapModal}>
                                <Text style={styles.buttonText}>Set Location</Text>
                            </TouchableOpacity>

                            <ChangeUserData />

                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>

            </SafeAreaView>
        )
    }
}
