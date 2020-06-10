import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, TextInput, PermissionsAndroid, Linking, Alert, AsyncStorage, Dimensions, ScrollView } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import { Switch } from 'react-native-switch';

const PrimayColor = '#D87314'

const boys = firestore().collection('Boys');
const orders = firestore().collection('Managers');
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const Dashboard = ({ navigation }) => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [data, setData] = useState([]);
    const [incomingOrder, setIncomingOrder] = useState(null);
    const [action, setAction] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 })
    const [isModalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState('');

    // const user = navigation.getParam('user')

    const toggleSwitch = () => {
        setIsEnabled(isEnabled => !isEnabled);
        // console.log(isEnabled)
        boys.doc(user).set({
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
    const getUser = async () => {
        const user = await AsyncStorage.getItem('user');
        setUser(user);
    }

    useEffect(() => {
        let data;
        getUser();
        return boys.doc(user).onSnapshot((snapshot) => {
            data = snapshot.data();
            setData(data);
            // console.log(data.available)
            if (data) (setIsEnabled(data.available))
        });
    }, [user]);

    useEffect(() => {
        getUser();
        return boys.doc(user).collection('orders').onSnapshot((snapshot) => {
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
    }, [user])

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
        boys.doc(user).collection('orders').doc('order').delete();
    }
    const handleComplted = () => {
        setAccepted(false)
        boys.doc(user).collection('orders').doc('order').delete();
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
            <ScrollView style={{flex:1}}>
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

            <View style={{ marginTop: 15,alignItems:'center',}}>
                <Switch
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    disabled={false}
                    activeText={'On'}
                    inActiveText={'Off'}
                    circleSize={32}
                    barHeight={35}
                    circleBorderWidth={1}
                    backgroundActive={'#a7eb9b'}
                    backgroundInactive={'#a7eb9b'}
                    circleActiveColor={'#57d941'}
                    circleInActiveColor={'#57d941'}
                    changeValueImmediately={true}
                    renderInsideCircle={() => <Text style={{color:'#fafafa',fontSize:11}}>ON</Text>} // custom component to render inside the Switch circle (Text, Image, etc.)
                    changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                    renderActiveText={false}
                    renderInActiveText={false}
                    switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                    switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                    switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                    switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.

                />
                </View>
                <View style={{ marginTop: 15,alignItems:'center',marginBottom:10}}>
                <Switch
                    onValueChange={toggleSwitch}
                    value={!isEnabled}
                    disabled={false}
                    circleSize={32}
                    barHeight={35}
                    circleBorderWidth={1}
                    backgroundActive={'#f7867e'}
                    backgroundInactive={'#f7867e'}
                    circleActiveColor={'red'}
                    circleInActiveColor={'red'}
                    changeValueImmediately={true}
                    renderInsideCircle={() => <Text style={{color:'#fafafa',fontSize:11}}>OFF</Text>} // custom component to render inside the Switch circle (Text, Image, etc.)
                    changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                    renderActiveText={false}
                    renderInActiveText={false}
                    switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                    switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                    switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                    switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.

                />
            </View>
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
                <TextInput style={styles.text} placeholder="TUE" />
                <TextInput style={styles.text} placeholder="WED" />
                <TextInput style={styles.text} placeholder="THU" />
                <TextInput style={styles.text} placeholder="FR" />
                <TextInput style={styles.text} placeholder="SA" />
                <TextInput style={styles.text} placeholder="SO" />
            </View>
            <View style={styles.divider}></View>
            <View style={[styles.xAxis, { marginLeft: 0 }]}>
                <Text style={[styles.text]}>19 {"\n"}  |{"\n"}01</Text>
                <TextInput style={styles.text} placeholder="Mo" />
                <TextInput style={styles.text} placeholder="TUE" />
                <TextInput style={styles.text} placeholder="WED" />
                <TextInput style={styles.text} placeholder="THU" />
                <TextInput style={styles.text} placeholder="FR" />
                <TextInput style={styles.text} placeholder="SA" />
                <TextInput style={styles.text} placeholder="SO" />
            </View>
            <View style={styles.divider}></View>
            <View style={[styles.divider, { marginTop: '10%', backgroundColor: PrimayColor }]}></View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={[styles.button, { margin: 10 }]} onPress={toggleModal}>
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
                        <View style={{ flexDirection: 'row', backgroundColor: '#a8caff' }} key={item.time}>
                            <Text style={styles.tableRow}>{item.orderNo}</Text>
                            <Text style={styles.tableRow}>{item.time} hrs</Text>
                            <Text style={styles.tableRow}>{item.serviceTime} hrs</Text>
                            <TouchableOpacity
                                onPress={openMap}
                                style={{
                                    flex: 1,
                                    borderWidth: 2,
                                    borderColor: '#fafafa',
                                    // padding: 5
                                }}>
                                <Image style={{ width: 30, height: 30, alignSelf: 'center' }}
                                    source={require('../assets/images/map.png')} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={[styles.button,{padding:0}]} onPress={openMap}> */}

                            {/* </TouchableOpacity> */}
                            {/* <TouchableOpacity style={styles.button} onPress={toggleModal}>
                            <Text style={styles.buttonText}>Order</Text>
                        </TouchableOpacity> */}
                        </View>
                    ))}
                    {/* {action && <View style={{ justifyContent: 'space-around', flexDirection: 'row', marginTop: '10%' }}>
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
                    </View>} */}
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <Text style={{alignSelf:'center',fontSize:20}}>Accept or reject Job</Text>
                        <View>
                        <View style={{ marginTop: 15,alignItems:'center',}}>
                <Switch
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    disabled={false}
                    activeText={'On'}
                    inActiveText={'Off'}
                    circleSize={32}
                    barHeight={35}
                    circleBorderWidth={1}
                    backgroundActive={'#a7eb9b'}
                    backgroundInactive={'#a7eb9b'}
                    circleActiveColor={'#57d941'}
                    circleInActiveColor={'#57d941'}
                    changeValueImmediately={true}
                    renderInsideCircle={() => <Text style={{color:'#fafafa',fontSize:11}}>ON</Text>} // custom component to render inside the Switch circle (Text, Image, etc.)
                    changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                    renderActiveText={false}
                    renderInActiveText={false}
                    switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                    switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                    switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                    switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.

                />
                </View>
                <View style={{ marginTop: 15,alignItems:'center',marginBottom:10}}>
                <Switch
                    onValueChange={toggleSwitch}
                    value={!isEnabled}
                    disabled={false}
                    circleSize={32}
                    barHeight={35}
                    circleBorderWidth={1}
                    backgroundActive={'#f7867e'}
                    backgroundInactive={'#f7867e'}
                    circleActiveColor={'red'}
                    circleInActiveColor={'red'}
                    changeValueImmediately={true}
                    renderInsideCircle={() => <Text style={{color:'#fafafa',fontSize:11}}>OFF</Text>} // custom component to render inside the Switch circle (Text, Image, etc.)
                    changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                    renderActiveText={false}
                    renderInActiveText={false}
                    switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                    switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                    switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                    switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.

                />
            </View>
                        </View>
                    </View>
                </View>

            }
            </ScrollView>
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
        fontSize: 15,
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
        flex: 0.9,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#fafafa',
        padding: 5,
    }
})
