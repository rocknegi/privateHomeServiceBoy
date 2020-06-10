import React, { useEffect, useState } from 'react'
import { Text, View, Alert, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, FlatList, ColorPropType, KeyboardAvoidingView, Dimensions, Platform, SafeAreaView, AsyncStorage, ToastAndroid } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { styles } from './theme/theme';
import DataInput from './DataInput';

function ChangeUserData() {
    const [data, setData] = useState([]);
    const [user, setUser] = useState('');

    const boys = firestore().collection('Boys');

    const getUser = async () => {
        const user = await AsyncStorage.getItem('user');
        setUser(user);
    }

    useEffect(() => {
        getUser();
        return boys.doc(user).onSnapshot(doc => {
            let data = [];
            data.push(doc.data());
            setData(data)
            //   console.log(data)
        })
    }, [user])

    const saveData = ()=>{
        
    }

    return (
        <SafeAreaView>
            <View>
                {data.map(item => (
                    <View key={item.name} style={{ flex: 0 }}>
                        <DataInput data={item} />
                    </View>
                ))}

                <TouchableOpacity style={[styles.buttonContainer, { marginTop: 10, marginHorizontal: '30%' }]} onPress={saveData}>
                    <Text style={styles.buttonText}>Save Data</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default ChangeUserData
