import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Switch, TextInput } from 'react-native'
import firestore from '@react-native-firebase/firestore'

const boys = firestore().collection('Boys');

const Dashboard = () => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [data, setData] = useState([]);
    const [incomingOrder, setIncomingOrder] = useState(null);
    const [action, setAction] = useState(false);

    const toggleSwitch = () => {
        setIsEnabled(isEnabled => !isEnabled);
        console.log(isEnabled)
        boys.doc('boy1').set({
            ...data,
            available:!isEnabled
        })
    }
    // boys.doc('boy1').set({
    //     name:'boy1',
    //     phone:2294518795,
    //     available:false
    // })
    boys.doc('boy1').collection('orders').doc('order').set({
        time:1700,
        duration:2,
    })

    useEffect(() => {
        let data;
        return boys.doc('boy1').onSnapshot((snapshot) => {
            data = snapshot.data();
            setData(data);  
            console.log(data.available)
            setIsEnabled(data.available);     
        });
    }, []);

    useEffect(()=>{
        let data=[];
        return boys.doc('boy1').collection('orders').onSnapshot((snapshot) => {
           snapshot.forEach(doc=>{
            data.push(({ ...doc.data(), id: doc.id }))
           })
            setIncomingOrder(data); 
            if(data.length>0)setAction(true) 
        });
    },[])

    const handleAccept = ()=> setAction(false)
    const handleReject = ()=> setIncomingOrder(null)

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.xAxis, { marginBottom: '2%',marginLeft:10 }]}>
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
            </View>
            <View style={[styles.xAxis, { marginBottom: '0%' }]}>
                <Text style={{ fontSize: 20, padding: 5, paddingLeft: 0 }}>Week Planner</Text>
            </View>
            <View style={[styles.xAxis]}>
                {/* <Text style={styles.text}></Text> */}
                <Text style={styles.text}>Mo</Text>
                <Text style={styles.text}>Di</Text>
                <Text style={styles.text}>Mi</Text>
                <Text style={styles.text}>Do</Text>
                <Text style={styles.text}>Fr</Text>
                <Text style={styles.text}>Sa</Text>
                <Text style={styles.text}>So</Text>
            </View>
            <View style={[styles.xAxis, { marginLeft: 0 }]}>
                <Text style={styles.text}>12 {"\n"}  |{"\n"}18</Text>
                <TextInput style={styles.text} placeholder="Mo" />
                <TextInput style={styles.text} placeholder="Di" />
                <TextInput style={styles.text} placeholder="Mi" />
                <TextInput style={styles.text} placeholder="Do" />
                <TextInput style={styles.text} placeholder="Fr" />
                <TextInput style={styles.text} placeholder="Sa" />
                <TextInput style={styles.text} placeholder="So" />
            </View>
            <View style={[styles.xAxis, { marginLeft: 0 }]}>
                <Text style={styles.text}>18 {"\n"}  |{"\n"}01</Text>
                <TextInput style={styles.text} placeholder="Mo" />
                <TextInput style={styles.text} placeholder="Di" />
                <TextInput style={styles.text} placeholder="Mi" />
                <TextInput style={styles.text} placeholder="Do" />
                <TextInput style={styles.text} placeholder="Fr" />
                <TextInput style={styles.text} placeholder="Sa" />
                <TextInput style={styles.text} placeholder="So" />
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity>
                    <Text style={[styles.text,{fontSize:20}]}>
                        Incoming Request
                    </Text>
                </TouchableOpacity>
            </View>
                {incomingOrder&&
                <View>
                    {incomingOrder.map(item=>(
                          <View style={{justifyContent:'space-around',flexDirection:'row'}}  key={item.time}>
                        <View>
                            <Text style={styles.text}>Duration : {item.duration} hrs</Text>
                            <Text style={styles.text}>Time : {item.time} hrs</Text>
                        </View>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Route</Text>
                        </TouchableOpacity>
                        </View>
                    ))}
                         {action&&<View style={{justifyContent:'space-around',flexDirection:'row',marginTop:'10%'}}>
                            <TouchableOpacity style={styles.button} onPress={handleAccept}>
                            <Text style={styles.buttonText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleReject} style={[styles.button,{backgroundColor:'#fafafa',borderColor:'#D87314',borderWidth:1}]}>
                            <Text style={[styles.buttonText,{color:'#000'}]}>Reject</Text>
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
    xAxis: {
        alignItems: 'flex-start',
        marginLeft: '14%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
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
        fontSize: 18
    },
    button: {
        backgroundColor: '#D87314',
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        alignSelf:'center',
        padding:10
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        padding: 10,
    },
})
