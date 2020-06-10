import React, { Component } from 'react'
import { Text, StyleSheet, Dimensions, PermissionsAndroid, Platform,TouchableOpacity, View } from 'react-native'
import MapView from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';
import { Marker } from 'react-native-maps';
import { PrimayColor } from '../theme/theme';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class Map extends Component {
    state = {
        region: {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 1,
            longitudeDelta: 1,
        },
        marker:{
            latitude: 0,
            longitude: 0,
        }
    }

    setMarkerLocation=(location)=>{
        this.setState({marker:{
            latitude:location.latitude,
            longitude:location.longitude
        }})
    }
    componentDidMount() {
        if (Platform.OS === 'android')
            this.requestStoragePermission();
        else
            Geolocation.getCurrentPosition(position => {
                this.setState({region:{
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,latitude:position.coords.latitude,longitude:position.coords.longitude
                },marker:{
                    latitude:position.coords.latitude,longitude:position.coords.longitude
                }})
            });
    }
    requestStoragePermission = async () => {
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
                    if(this.props.coords.latitude!==0){
                        this.setState({region:{
                            latitudeDelta: 0.003,
                            longitudeDelta: 0.003,latitude:this.props.coords.latitude,longitude:this.props.coords.longitude
                        },marker:{
                            latitude:this.props.coords.latitude,longitude:this.props.coords.longitude
                        }})
                    }
                    else{
                        this.setState({region:{
                            latitudeDelta: 0.003,
                            longitudeDelta: 0.003,latitude:position.coords.latitude,longitude:position.coords.longitude
                        },marker:{
                            latitude:position.coords.latitude,longitude:position.coords.longitude
                        }})
                    }

                });
            } else {
                Alert('Please grant location permission');
            }
        } catch (err) {
            alert(err);
        }
    }

    confirmLocation = ()=>{
        console.log('saved')
        this.props.saveMarkerLocation(this.state.marker)
        this.props.toggle()
    }

    render() {
        return (
            <View>
              <MapView 
                style={{height}}
                region= {this.state.region}>
                    <Marker draggable
                        coordinate={this.state.marker}
                        onDragEnd={(e) => this.setMarkerLocation(e.nativeEvent.coordinate)}
                    />
                </MapView>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={this.confirmLocation}>Confirm Location</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    button: {
        position:'absolute',
        backgroundColor: PrimayColor,
        borderRadius: 6,
        height: 50,
        justifyContent: 'center',
        padding:8,
        bottom:20,
        margin:10
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
})
// this.setState({ marker: e.nativeEvent.coordinate })