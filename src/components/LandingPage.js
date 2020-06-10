import React from 'react'
import { View, Text, StyleSheet, Animated, Dimensions,SafeAreaView, Platform } from 'react-native'

class ImageLoader extends React.Component {
    state = {
        opacity: new Animated.Value(0)
    }
    onLoad = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true
        }).start()
    }

    render() {
        return (
            <Animated.Image
                onLoad={this.onLoad}
                {...this.props}
                style={[
                    {
                        opacity: this.state.opacity,
                        transform: [
                            {
                                scale: this.state.opacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.85, 1],
                                })
                            }
                        ]
                    },
                    this.props.style
                ]}
            />
        )
    }

}

class landingPage extends React.Component {
    static navigationOptions = () => {
        return {
            headerShown: false
        }
    }

    componentDidMount(){
        setTimeout(()=>{
            this.props.navigation.navigate('Login')
        },2500)
    }

    render() {
        const { navigation } = this.props
        return (
               <SafeAreaView style={{backgroundColor:'#D87314',flex:1}}>
               {/* <Text style={styles.heading}>Private Home Service</Text> */}
                <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                        <ImageLoader
                            source={require('../assets/images/logo_white.png')}
                            style={styles.images}
                        />
                    <Text style={{ fontSize: Platform.OS==='android'?28:18,fontFamily:Platform.OS==='android'?'HT Gelateria W01 Regular':'ComicSansMS', textAlign: 'center',transform: [{ rotate: '-5deg'}] }}>
                    Vos besoins sont nos Services
                    </Text>
                    </View>
                </View>


                {/* <View style={{ flex: 0.5 }}>
                    <Text style={{ fontSize: 50, textAlign: 'center' }}>
                        VIDEO
                </Text>
                </View> */}
                <View style={{justifyContent: 'center',alignItems:'center' }}>
                    {/* <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={styles.button}
                    > */}
                        <Text style={[styles.buttonText,{fontFamily:'DavidLibre-Regular'}]}>Loading...</Text>
                    {/* </TouchableOpacity> */}
                </View>
               </SafeAreaView>
        )
    }
}

export default landingPage
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center'
    },
    heading: {
        textAlign: 'center',
        fontSize: 40,
        top: 10
    },
    images: {
        resizeMode: 'contain',
        height: Dimensions.get('window').width/3.3,
        width: Dimensions.get('window').width/3.3,
        alignSelf: 'center'
    },
    button: {
        paddingVertical: 10,
        marginHorizontal: 10,
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        padding: 10,
        elevation: 10,
    },
})