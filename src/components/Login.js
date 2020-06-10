import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, FlatList, ColorPropType, KeyboardAvoidingView, Dimensions, Platform, SafeAreaView, AsyncStorage, ToastAndroid } from 'react-native'
import firestore from '@react-native-firebase/firestore';

const data = firestore().collection('Boys');
const PrimayColor = '#D87314';

export default class index extends Component {
    state = {
        dialingCode: '+237',
        username:'',
        password:''
    }

    static navigationOptions = () => {
        return {
            headerShown: false
        }
    }

    checkCreds = ()=>{
        let countryCode = '+237'
        let email = countryCode + this.state.username + '@domainName.com';
        data.doc('POelJlDzmzSK7UYArrA6').get().then(data=>{
            if(data["_data"]===undefined)
            ToastAndroid.showWithGravity('User with this phone no does not exist',ToastAndroid.SHORT,ToastAndroid.BOTTOM)

            // else if(data["_data"]["pass"]!=this.state.password)
            // ToastAndroid.showWithGravity('Wrong password',ToastAndroid.SHORT,ToastAndroid.BOTTOM)
            else {
                this.props.navigation.navigate('Dashboard',{
                    user:'POelJlDzmzSK7UYArrA6'
                })
                AsyncStorage.setItem('user','POelJlDzmzSK7UYArrA6')
            }
        })
       
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>

                <Image
                    style={styles.logo}
                    source={require('../assets/images/logo_white.png')}
                />
                <Text style={{ fontSize: Platform.OS === 'android' ? 25 : 16, fontFamily: Platform.OS === 'android' ? 'HT Gelateria W01 Regular' : 'ComicSansMS', textAlign: 'center', marginBottom: 10 }}>
                    Vos besoins sont nos Services
                    </Text>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{marginTop:'10%'}}>
                        <View style={styles.field}>
                            <TextInput style={{ marginLeft: 5 }}>{`${this.state.dialingCode}`}</TextInput>
                            <TextInput
                                // placeholder="Telefon no is Obligatory"
                                style={[styles.input]}
                                keyboardType={'number-pad'}
                                value={this.state.username}
                                onChangeText={(value)=>this.setState({username:value})}
                            />
                        </View>

                        <View style={[styles.field,{flexDirection:'column',marginTop:5}]}>
                            <TextInput
                                placeholder="Password"
                                style={[styles.input,{textAlign:'center'}]}
                                autoCapitalize='none'
                                value={this.state.password}
                                onChangeText={(value)=>this.setState({password:value})}
                            />
                        </View>

                        <TouchableOpacity style={styles.buttonContainer} onPress={this.checkCreds}>
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>

                    </View>
                </TouchableWithoutFeedback>

            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor: '#fafafa'
    },
    logo: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: 150,
        width: 150,
        // marginBottom: 5
    },
    field: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 100,
        alignItems: "center",
        backgroundColor: '#fafafa',
        marginBottom: 20,
        marginTop: 10,
        marginHorizontal: '18%',
        borderColor: PrimayColor
    },
    icon: {
        color: '#999999', paddingLeft: 10, fontSize: 20
    },
    input: {
        height: 50,
        color: '#757575',
        paddingHorizontal: 10,
        width: '100%'
    },
    buttonContainer: {
        backgroundColor: PrimayColor,
        borderRadius: 100,
        marginHorizontal: '18%',
        height: 50,
        justifyContent: 'center',
        marginBottom: 20
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    signup: {
        flex: 1,
        justifyContent: 'flex-end',
        alignSelf: 'center',
        paddingBottom: 10
    },
    modal: {
        flexDirection: 'row', justifyContent: 'space-between'
    },
    modalText: {
        fontSize: 22,
        flexWrap: 'wrap',
        textAlign: 'center'
    }
})