import React, { useState } from 'react'
import { View, Text, TextInput, SafeAreaView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import { styles } from './theme/theme';

export default function DataInput({ data }) {

    const [gender, setGender] = useState(data.gender);
    const [image, setImage] = useState(data.image);
    const [phone, setPhone] = useState((data.phone).toString());

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

        </SafeAreaView>
    )
}
