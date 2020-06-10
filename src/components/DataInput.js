import React, { useState } from 'react'
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import firestore from '@react-native-firebase/firestore';

import { styles } from './theme/theme';

export default function DataInput({ data,user }) {

    const [gender, setGender] = useState(data.gender);
    const [image, setImage] = useState(data.image);
    const [phone, setPhone] = useState((data.phone).toString());
    const boys = firestore().collection('Boys');
    // console.log(user)
    const saveData = ()=>{
        boys.doc(user).update({
            gender,
            image,
            phone
        })
        Keyboard.dismiss
    }
    return (
        <SafeAreaView>

                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <Text style={{alignSelf:'center',fontSize:15}}>Gender</Text>
                        <TextInput
                            style={[styles.input, { textAlign: 'center',width:'70%' }]}
                            value={gender}
                            onChangeText={(value) => setGender(value)}
                        />
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <Text style={{alignSelf:'center',fontSize:15}}>Image</Text>
                        <TextInput
                            style={[styles.input, { textAlign: 'center',width:'70%' }]}
                            value={image}
                            onChangeText={(value) => setImage(value)}
                        />
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <Text style={{alignSelf:'center',fontSize:15}}>Phone</Text>
                        <TextInput
                            style={[styles.input, { textAlign: 'center',width:'70%' }]}
                            value={phone}
                            onChangeText={(value) => setPhone(value)}
                        />
                    </View>
                    <TouchableOpacity style={[styles.button,{padding:10,width:'30%'}]} onPress={saveData}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
        </SafeAreaView>
    )
}
