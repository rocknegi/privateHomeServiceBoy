import React, { useState } from 'react'
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, Keyboard, PermissionsAndroid, Platform, } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker';

import { styles } from './theme/theme';

export default function DataInput({ data, user }) {

    const [gender, setGender] = useState(data.gender);
    const [image, setImage] = useState(data.image);
    const [phone, setPhone] = useState((data.phone).toString());
    const boys = firestore().collection('Boys');
    // console.log(user)
    const saveData = () => {
        boys.doc(user).update({
            gender,
            image,
            phone
        })
        Keyboard.dismiss
    }

    const uploadPhoto = async () => {
        const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE &&
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Private home services needs Location Permission',
                message:
                    'Private home services needs Location Permission',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        )
        if (permission) {
            const options = {
                title: 'Select Avatar',
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
            };
            ImagePicker.showImagePicker(options, (response) => {
                console.log('Response = ', response);

                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    const source = { uri: response.uri };

                    // You can also display the image using data:
                    // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                    // this.setState({
                    //     avatarSource: source,
                    // });
                    setImage('data:image/jpeg;base64,' + response.data)
                }
            })

        }

    }

    return (
        <SafeAreaView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={{ alignSelf: 'center', fontSize: 15 }}>Gender</Text>
                <TextInput
                    style={[styles.input, { textAlign: 'center', width: '70%' }]}
                    value={gender}
                    onChangeText={(value) => setGender(value)}
                />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={{ alignSelf: 'center', fontSize: 15 }}>Image</Text>
                {/* <TextInput
                            style={[styles.input, { textAlign: 'center',width:'70%' }]}
                            value={image}
                            onChangeText={(value) => setImage(value)}
                        /> */}
                <TouchableOpacity style={[styles.input, { width: '70%' }]} onPress={uploadPhoto}>
                    <Text style={[styles.buttonText, { color: '#000' }]}>
                        Upload
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={{ alignSelf: 'center', fontSize: 15 }}>Phone</Text>
                <TextInput
                    style={[styles.input, { textAlign: 'center', width: '70%' }]}
                    value={phone}
                    onChangeText={(value) => setPhone(value)}
                />
            </View>
            <TouchableOpacity style={[styles.button, { padding: 10, width: '30%' }]} onPress={saveData}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
