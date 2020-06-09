import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, Switch, TextInput, PermissionsAndroid, Linking, Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
const PrimayColor = '#D87314'

const boys = firestore().collection('Boys');
const orders = firestore().collection('Managers');

const Dashboard = () => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [data, setData] = useState([]);
    const [incomingOrder, setIncomingOrder] = useState(null);
    const [action, setAction] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 })
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleSwitch = () => {
        setIsEnabled(isEnabled => !isEnabled);
        // console.log(isEnabled)
        boys.doc('boy1').set({
            ...data,
            available: !isEnabled
        })
    }
    // boys.doc('boy1').set({
    //     name:'boy1',
    //     phone:2294518795,
    //     available:false
    // })
    // boys.doc('boy1').collection('orders').doc('order').set({
    //     time:1700,
    //     duration:2,
    // })

    useEffect(() => {
        let data;
        return boys.doc('boy1').onSnapshot((snapshot) => {
            data = snapshot.data();
            setData(data);
            // console.log(data.available)
            if (data) (setIsEnabled(data.available))
        });
    }, []);

    useEffect(() => {
        return boys.doc('boy1').collection('orders').onSnapshot((snapshot) => {
            let data = [];
            let accepted = false;
            snapshot.forEach(doc => {
                data.push({ ...doc.data() })
            })
            setIncomingOrder(data);
            if (data.length > 0) {
                orders.doc(data[0].number.toString()).get().then(snapshot => {
                    accepted = snapshot.data().accepted
                    if (data.length > 0 && !accepted) setAction(true)

                })
            }
        });
    }, [])

    const handleAccept = () => {
        setAction(false);
        orders.doc(incomingOrder[0].number.toString()).update({
            // ...incomingOrder[0],
            accepted: true
        });
        setAccepted(true)
        toggleSwitch();

    }
    const handleReject = () => {
        setAction(false)
        boys.doc('boy1').collection('orders').doc('order').delete();
    }
    const handleComplted = () => {
        setAccepted(false)
        boys.doc('boy1').collection('orders').doc('order').delete();
        toggleSwitch()
    }

    const viewOrder = () => {

    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const openMap = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Private home services needs Location Permission',
                    message:
                        'Private home services needs Location Permission',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(position => {
                    // setLocation({latitude:position.coords.latitude,longitude:position.coords.longitude})
                    Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${position.coords.latitude},${position.coords.longitude}&destination=${position.coords.latitude + 0.02},${position.coords.longitude + 0.02}`)
                });
            } else {
                Alert.alert('Please grant location permission');
            }
        } catch (err) {
            alert(err);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                isVisible={isModalVisible}
                // onModalShow={afterModalOpen}
                style={{
                    justifyContent: 'center',
                    // margin: 0,
                }}
                onBackdropPress={toggleModal}
                swipeDirection={['up', 'left', 'right', 'down']}
            >
                <View>
                    {incomingOrder && <View>
                        {incomingOrder.map(item => (
                            <View key={item.balance} style={{ backgroundColor: '#fafafa', alignItems: 'center', padding: 10 }}>
                                <Text style={styles.text}>Balance : {item.balance}</Text>
                                <Text style={styles.text}>Champagne : {item.champagne}</Text>
                                <Text style={styles.text}>Champagne Glass : {item.champagneGlass}</Text>
                                <Text style={styles.text}>Delivery Time : {item.deliveryTime}</Text>
                                <Text style={styles.text}>Hotess : {item.hotess}</Text>
                                <Text style={styles.text}>Time : {item.time} hrs</Text>
                                <Text style={styles.text}>Total : {item.total}</Text>
                            </View>
                        ))}
                        <TouchableOpacity onPress={toggleModal} style={[styles.button, { margin: 10 }]}>
                            <Text style={styles.buttonText}>
                                close
                            </Text>
                        </TouchableOpacity>
                    </View>}
                </View>
            </Modal>
            <View style={styles.header}>
                <Image
                    style={{ height: 25, width: 25, marginRight: 10 }}
                    source={require('../assets/images/user.webp')} />
            </View>
            {/* <View style={[styles.xAxis, { marginBottom: '2%',marginLeft:10 }]}>
                <Text style={{ fontSize: 20, padding: 10,textAlign:'left',flex:1,paddingLeft:0 }}>Boy1</Text>
                <Text style={{ fontSize: 20, padding: 10 }}>Available?</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    style={{ marginTop: 10, marginRight: 5 }}
                />
            </View> */}
            <View style={[{ marginBottom: '0%', backgroundColor: '#97b54a', marginLeft: 0 }]}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 10, textAlign: 'center', color: '#fafafa' }}>Day/Week Planner</Text>
            </View>
            {/* <View style={[styles.xAxis,{ marginLeft: 0,paddingHorizontal:8 }]}>
                <Text style={[styles.text,]}>   </Text>
                <Text style={styles.text}>Mo</Text>
                <Text style={styles.text}>Di</Text>
                <Text style={styles.text}>Mi</Text>
                <Text style={styles.text}>Do</Text>
                <Text style={styles.text}>Fr</Text>
                <Text style={styles.text}>Sa</Text>
                <Text style={styles.text}>So</Text>
            </View> */}
            <View style={[styles.xAxis, { marginLeft: 0 }]}>
                <Text style={styles.text}>14 {"\n"}  |{"\n"}18</Text>
                <TextInput style={styles.text} placeholder="Mo" />
                <TextInput style={styles.text} placeholder="Di" />
                <TextInput style={styles.text} placeholder="Mi" />
                <TextInput style={styles.text} placeholder="Do" />
                <TextInput style={styles.text} placeholder="Fr" />
                <TextInput style={styles.text} placeholder="Sa" />
                <TextInput style={styles.text} placeholder="So" />
            </View>
            <View style={styles.divider}></View>
            <View style={[styles.xAxis, { marginLeft: 0 }]}>
                <Text style={[styles.text]}>19 {"\n"}  |{"\n"}01</Text>
                <TextInput style={styles.text} placeholder="Mo" />
                <TextInput style={styles.text} placeholder="Di" />
                <TextInput style={styles.text} placeholder="Mi" />
                <TextInput style={styles.text} placeholder="Do" />
                <TextInput style={styles.text} placeholder="Fr" />
                <TextInput style={styles.text} placeholder="Sa" />
                <TextInput style={styles.text} placeholder="So" />
            </View>
            <View style={styles.divider}></View>
            <View style={[styles.divider, { marginTop: '10%', backgroundColor: PrimayColor }]}></View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={[styles.button, { margin: 10 }]}>
                    <Text style={[styles.buttonText, { fontSize: 20 }]}>
                        Incoming Request
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: '#3a86fc' }}>
                <Text style={styles.tableHeading}>Order Nr</Text>
                <Text style={styles.tableHeading}>Start</Text>
                <Text style={styles.tableHeading}>Duration</Text>
                <Text style={styles.tableHeading}>Location</Text>
            </View>
            {incomingOrder &&
                <View>
                    {incomingOrder.map(item => (
                        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', backgroundColor: '#a8caff' }} key={item.time}>
                            <Text style={styles.tableRow}>1257</Text>
                            <Text style={styles.tableRow}>{item.time} hrs</Text>
                            <Text style={styles.tableRow}>{item.serviceTime} hrs</Text>
                            <View style={{
                                flex: 1,
                                borderWidth: 2,
                                borderColor: '#fafafa',
                                // padding: 5
                            }}>
                                <Image style={{width:30,height:30,alignSelf:'center'}} 
                            source={require('../assets/images/map.png')}/>
                            </View>
                            {/* <TouchableOpacity style={[styles.button,{padding:0}]} onPress={openMap}> */}

                            {/* </TouchableOpacity> */}
                            {/* <TouchableOpacity style={styles.button} onPress={toggleModal}>
                            <Text style={styles.buttonText}>Order</Text>
                        </TouchableOpacity> */}
                        </View>
                    ))}
                    {action && <View style={{ justifyContent: 'space-around', flexDirection: 'row', marginTop: '10%' }}>
                        <TouchableOpacity style={styles.button} onPress={handleAccept}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleReject} style={[styles.button, { backgroundColor: '#fafafa', borderColor: '#D87314', borderWidth: 1 }]}>
                            <Text style={[styles.buttonText, { color: '#000' }]}>Reject</Text>
                        </TouchableOpacity>
                    </View>}
                    {accepted && <View style={{ justifyContent: 'space-around', flexDirection: 'row', marginTop: '10%' }}>
                        <TouchableOpacity onPress={handleComplted} style={[styles.button, { backgroundColor: '#fafafa', borderColor: '#D87314', borderWidth: 1 }]}>
                            <Text style={[styles.buttonText, { color: '#000' }]}>Completed</Text>
                        </TouchableOpacity>
                    </View>}
                </View>

            }
        </SafeAreaView>
    )
}

export default Dashboard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        height: 100
    },
    header: {
        backgroundColor: PrimayColor,
        padding: 5,
        alignItems: 'flex-end'
    },
    xAxis: {
        alignItems: 'flex-start',
        marginLeft: '14%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        // paddingHorizontal:10
        // marginBottom: '7%'
    },
    yAxis: {
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        marginTop: '5%',
    },
    text: {
        flexWrap: 'wrap',
        marginBottom: '10%',
        fontSize: 18,
    },
    button: {
        backgroundColor: '#D87314',
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        padding: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        padding: 10,
    },
    divider: {
        backgroundColor: '#97b54a',
        height: 1,
        marginTop: '-7%'
    },
    tableHeading: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fafafa',
        borderWidth: 2,
        borderColor: '#fafafa',
        padding: 5
    },
    tableRow: {
        flex: 1,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#fafafa',
        padding: 5
    }
})
