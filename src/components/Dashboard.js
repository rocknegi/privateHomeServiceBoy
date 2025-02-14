import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, TextInput, PermissionsAndroid, Linking, Alert, AsyncStorage, Dimensions, ScrollView, TouchableWithoutFeedback, YellowBox } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import { Switch } from 'react-native-switch';

// console.disableYellowBox = true;
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
    const [rejected, setRejected] = useState(false);
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 })
    const [isModalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState('');
    const [firstData, setFirstData] = useState([]);
    const [secondData, setSecondData] = useState([]);

    // const user = navigation.getParam('user')

    const toggleSwitch = () => {
        setIsEnabled(isEnabled => !isEnabled);
        // console.log(isEnabled)
        boys.doc(user).update({
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
            setIncomingOrder(data)
            // setIncomingOrder(JSON.parse(data[0][0]));
            // console.log(data)
            // if (data.length > 0) {
            //     orders.doc(data[0].number.toString()).get().then(snapshot => {
            //         accepted = snapshot.data().accepted
            //         // if (data.length > 0 && !accepted) alert(action)
            //         // else alert(action)

            //     })
            // }
        });
    }, [user])

    useEffect(() => {
        return boys.doc(user).collection('14-18').onSnapshot(snapshot => {
            let data = []
            snapshot.forEach(doc => {
                data.push({ ...doc.data() })
            })
            console.log(data)
            setFirstData(data)
        })
    }, [user])

    useEffect(() => {
        return boys.doc(user).collection('19-01').onSnapshot(snapshot => {
            let data = []
            snapshot.forEach(doc => {
                data.push({ ...doc.data() })
            })
            // console.log(data)
            setSecondData(data)
        })
    }, [user])

    const handleAccept = () => {
        // setAction(false);
        // alert(accepted)
        if (incomingOrder.length > 0 && !accepted) {
            console.log(incomingOrder)
            orders.doc(incomingOrder[0].phoneNo.toString()).update({
                // ...incomingOrder[0],
                accepted: true
            });

            boys.doc(user).update({
                // ...incomingOrder[0],
                FBK: true
            });
            // // toggleReject()
        }
        else {
            orders.doc(incomingOrder[0].phoneNo.toString()).update({
                // ...incomingOrder[0],
                accepted: false
            });
            boys.doc(user).update({
                // ...incomingOrder[0],
                FBK: false
            });
        }

        // setAccepted(true)
        // toggleSwitch();

    }
    const handleReject = () => {
        if (incomingOrder.length > 0 && !rejected) {
            orders.doc(incomingOrder[0].phoneNo.toString()).update({
                // ...incomingOrder[0],
                accepted: false
            });
            boys.doc(user).update({
                // ...incomingOrder[0],
                FBK: false
            });
            // toggleAccept()
        }

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
    const toggleAccept = () => {
        setAccepted(!accepted);
        handleAccept();
    }
    const toggleReject = () => {
        setRejected(!rejected);
        handleReject();
    }
    const openMap = async (lat, long) => {

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
                    Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${position.coords.latitude},${position.coords.longitude}&destination=${lat},${long}`)
                });
            } else {
                Alert.alert('Please grant location permission');
            }
        } catch (err) {
            alert(err);
        }
    }

    const setText = (time, value, day) => {

        boys.doc(user).collection(time).doc(day).set({
            ST: value
        })

    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ flex: 1 }}>
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
                        style={{ flex: 0.82, height: 45, width: 45, marginRight: 10, resizeMode: 'contain', alignSelf: 'center' }}
                        source={require('../assets/images/logo_white.png')}
                    />
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Account')}>
                        <Image
                            style={{ height: 25, width: 25, marginRight: 10 }}
                            source={require('../assets/images/user.webp')} />
                    </TouchableWithoutFeedback>
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

                <View style={{ marginTop: 15, alignItems: 'center', marginBottom: 15 }}>
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
                        backgroundInactive={'#f7867e'}
                        circleActiveColor={'#57d941'}
                        circleInActiveColor={'red'}
                        changeValueImmediately={true}
                        renderInsideCircle={() => isEnabled ? <Text style={{ color: '#fafafa', fontSize: 11 }}>ON</Text> : <Text style={{ color: '#fafafa', fontSize: 11 }}>OFF</Text>} // custom component to render inside the Switch circle (Text, Image, etc.)
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
                {/* <View style={{ marginTop: 15, alignItems: 'center', marginBottom: 10 }}>
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
                        renderInsideCircle={() => <Text style={{ color: '#fafafa', fontSize: 11 }}>OFF</Text>} // custom component to render inside the Switch circle (Text, Image, etc.)
                        changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                        renderActiveText={false}
                        renderInActiveText={false}
                        switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                        switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                        switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                        switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.

                    />
                </View> */}
                <View style={[{ marginBottom: '0%', backgroundColor: '#97b54a', marginLeft: 0 }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 10, textAlign: 'center', color: '#fafafa' }}>Day/Week Planner</Text>
                </View>
                <View style={[styles.xAxis, { marginLeft: 0, paddingHorizontal: 8, marginBottom: '-10%' }]}>
                    <Text style={[styles.text,]}>   </Text>
                    <Text style={styles.text}>Mo</Text>
                    <Text style={styles.text}>TUE</Text>
                    <Text style={styles.text}>WED</Text>
                    <Text style={styles.text}>THU</Text>
                    <Text style={styles.text}>FR</Text>
                    <Text style={styles.text}>SA</Text>
                    <Text style={styles.text}>SO</Text>
                </View>
                <View style={[styles.xAxis, { marginLeft: 0 }]}>
                    <Text style={styles.text}>14 {"\n"}  |{"\n"}19</Text>

                    {firstData[0] ? firstData[0]['ST'] === '1' ? <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                        <TextInput value={firstData[0]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '1')} style={styles.text} placeholder="Mo" />
                    </View> : <View style={{ backgroundColor: 'red', width: 22 }}>
                            <TextInput value={firstData[0]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '1')} style={styles.text} placeholder="Mo" />
                        </View> :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '1')} style={styles.text} placeholder="Mo" />
                        </View>
                    }

                    {firstData[1] ? firstData[1]['ST'] === '1' ? <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                        <TextInput value={firstData[1]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '2')} style={styles.text} placeholder="TUE" />
                    </View> :
                        <View style={{ backgroundColor: 'red', width: 22 }}>
                            <TextInput value={firstData[1]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '2')} style={styles.text} placeholder="TUE" />
                        </View>
                        :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '2')} style={styles.text} placeholder="TUE" />
                        </View>
                    }

                    {firstData[2] ? firstData[2]['ST'] === '1' ? <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                        <TextInput value={firstData[2]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '3')} style={styles.text} placeholder="WED" />
                    </View> :
                        <View style={{ backgroundColor: 'red', width: 22 }}>
                            <TextInput value={firstData[2]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '3')} style={styles.text} placeholder="WED" />
                        </View> :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '3')} style={styles.text} placeholder="WED" />
                        </View>
                    }

                    {firstData[3] ? firstData[3]['ST'] === '1' ? <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                        <TextInput value={firstData[3]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '4')} style={styles.text} placeholder="THU" />
                    </View> :
                        <View style={{ backgroundColor: 'red', width: 22 }}>
                            <TextInput value={firstData[3]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '4')} style={styles.text} placeholder="THU" />
                        </View> :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '4')} style={styles.text} placeholder="THU" />

                        </View>
                    }

                    {firstData[4] ? firstData[4]['ST'] === '1' ? <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                        <TextInput value={firstData[4]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '5')} style={styles.text} placeholder="FR" />
                    </View> :
                        <View style={{ backgroundColor: 'red', width: 22 }}>
                            <TextInput value={firstData[4]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '5')} style={styles.text} placeholder="FR" />
                        </View> :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '5')} style={styles.text} placeholder="FR" />
                        </View>
                    }

                    {firstData[5] ? firstData[5]['ST'] === '1' ? <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                        <TextInput value={firstData[5]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '6')} style={styles.text} placeholder="SA" />
                    </View> :
                        <View style={{ backgroundColor: 'red', width: 22 }}>
                            <TextInput value={firstData[5]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '6')} style={styles.text} placeholder="SA" />
                        </View> :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '6')} style={styles.text} placeholder="SA" />
                        </View>
                    }

                    {firstData[6] ? firstData[6]['ST'] === '1' ? <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                        <TextInput value={firstData[6]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '7')} style={styles.text} placeholder="SO" />
                    </View> :
                        <View style={{ backgroundColor: 'red', width: 22 }}>
                            <TextInput value={firstData[6]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '7')} style={styles.text} placeholder="SO" />
                        </View> :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('14-18', value, '7')} style={styles.text} placeholder="SO" />
                        </View>
                    }


                </View>
                <View style={styles.divider}></View>
                <View style={[styles.xAxis, { marginLeft: 0 }]}>
                    <Text style={[styles.text]}>19 {"\n"}  |{"\n"}01</Text>


                    {secondData[0] ? secondData[0]['ST'] === '1' ?
                        <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                            <TextInput value={secondData[0]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '1')} style={styles.text} placeholder="Mo" />
                        </View>
                        :
                        <View style={{ backgroundColor: 'red', width: 22 }}>
                            <TextInput value={secondData[0]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '1')} style={styles.text} placeholder="Mo" />
                        </View>
                        :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '1')} style={styles.text} placeholder="Mo" />
                        </View>
                    }
                    {secondData[1] ? secondData[1]['ST'] === '1' ?
                        <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                            <TextInput value={secondData[1]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '2')} style={styles.text} placeholder="TUE" />
                        </View>
                        :
                        <View style={{ backgroundColor: 'red', width: 22 }}>
                            <TextInput value={secondData[1]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '2')} style={styles.text} placeholder="TUE" />
                        </View>
                        :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '2')} style={styles.text} placeholder="TUE" />
                        </View>
                    }
                    {secondData[2] ? secondData[2]['ST'] === '1' ?
                        <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                            <TextInput value={secondData[2]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '3')} style={styles.text} placeholder="WED" />
                        </View>
                        :
                        <View style={{ backgroundColor: 'red', width: 22 }}>
                            <TextInput value={secondData[2]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '3')} style={styles.text} placeholder="WED" />
                        </View>
                        :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '3')} style={styles.text} placeholder="WED" />

                        </View>
                    }
                    {secondData[3] ? secondData[3]['ST'] === '1' ?
                        <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                            <TextInput value={secondData[3]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '4')} style={styles.text} placeholder="THU" />
                        </View>
                        :
                        <View style={{ backgroundColor: 'red' }}>
                            <TextInput value={secondData[3]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '4')} style={styles.text} placeholder="THU" />
                        </View>
                        :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '4')} style={styles.text} placeholder="THU" />
                        </View>
                    }
                    {secondData[4] ? secondData[4] === '1' ?
                        <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                            <TextInput value={secondData[4]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '5')} style={styles.text} placeholder="FR" />
                        </View>
                        :
                        <View style={{ backgroundColor: 'red' }}>
                            <TextInput value={secondData[4]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '5')} style={styles.text} placeholder="FR" />
                        </View>
                        :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '5')} style={styles.text} placeholder="FR" />

                        </View>
                    }
                    {secondData[5] ? secondData[5] === '1' ?
                        <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                            <TextInput value={secondData[5]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '6')} style={styles.text} placeholder="SA" />
                        </View>
                        :
                        <View style={{ backgroundColor: 'red' }}>
                            <TextInput value={secondData[5]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '6')} style={styles.text} placeholder="SA" />
                        </View>
                        :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '6')} style={styles.text} placeholder="SA" />

                        </View>
                    }
                    {secondData[6] ? secondData[6] === '1' ?
                        <View style={{ backgroundColor: '#97b54a', width: 22 }}>
                            <TextInput value={secondData[6]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '7')} style={styles.text} placeholder="SO" />
                        </View>
                        :
                        <View style={{ backgroundColor: 'red', width: 22 }}>
                            <TextInput value={secondData[6]['ST']} keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '7')} style={styles.text} placeholder="SO" />
                        </View>
                        :
                        <View style={{ backgroundColor: '#3a86fc', width: 22 }}>
                            <TextInput keyboardType={'number-pad'} onChangeText={value => setText('19-01', value, '7')} style={styles.text} placeholder="SO" />
                        </View>
                    }



                </View>
                <View style={styles.divider}></View>
                <View style={[styles.divider, { marginTop: '10%', backgroundColor: PrimayColor }]}></View>
                <View style={{ alignItems: 'center' }}>
                    <View style={[styles.button, { margin: 10 }]}>
                        <Text style={[styles.buttonText, { fontSize: 20 }]}>
                            Incoming Request
                    </Text>
                    </View>
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
                                <Text style={styles.tableRow}>{item.deliveryTime} hrs</Text>
                                <Text style={styles.tableRow}>{item.serviceDuration} hrs</Text>
                                <TouchableOpacity
                                    onPress={() => openMap(item.lat, item.long)}
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <Text style={{ alignSelf: 'center', fontSize: 20, marginTop: 10 }}>Accept or reject Job</Text>
                            <View>
                                <View style={{ marginTop: 15, alignItems: 'center', alignSelf: 'flex-start' }}>
                                    <Switch
                                        onValueChange={toggleAccept}
                                        value={accepted}
                                        disabled={incomingOrder.length > 0 ? false : true}
                                        activeText={'On'}
                                        inActiveText={'Off'}
                                        circleSize={32}
                                        barHeight={35}
                                        circleBorderWidth={1}
                                        backgroundActive={'#a7eb9b'}
                                        backgroundInactive={'#f7867e'}
                                        circleActiveColor={'#57d941'}
                                        circleInActiveColor={'red'}
                                        changeValueImmediately={true}
                                        renderInsideCircle={() => accepted ? <Text style={{ color: '#fafafa', fontSize: 11 }}>ON</Text> : <Text style={{ color: '#fafafa', fontSize: 11 }}>OFF</Text>} // custom component to render inside the Switch circle (Text, Image, etc.)
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
                                {/* <View style={{ marginTop: 15,alignItems:'center',marginBottom:10}}>
                <Switch
                    onValueChange={toggleReject}
                    value={rejected}
                    disabled={incomingOrder.length>0?false:true}
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
            </View> */}
                            </View>
                        </View>
                    </View>

                }
            </ScrollView>
        </SafeAreaView >
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
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        height: 40,
        flexDirection: 'row'
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
