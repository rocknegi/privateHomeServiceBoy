import { StyleSheet } from 'react-native'
export const PrimayColor = '#D87314'
export const styles = StyleSheet.create({
    header:{
        backgroundColor:PrimayColor,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    button: {
        backgroundColor: PrimayColor,
        alignSelf: 'center',
        marginHorizontal: 5,
        paddingHorizontal: '3%',
        borderRadius: 6,
    },
    buttonText: {
        color: '#fafafa',
        textAlign:'center'
    },
    text: {
        textAlign:'center'
    },
    form: {
        flex: 1,
        justifyContent: 'center'
    },
    inputContainer: {
        // flex:1,
        marginHorizontal: '10%',
        marginTop: '10%',
        justifyContent: 'center'
    },
    input: {
        backgroundColor: '#eee',
        borderRadius: 6,
        margin: 10,
        padding: 10
    },
    card: {
        elevation: 8,
        height:100,
        padding:15,
        margin:10,
        borderRadius:6,
        minWidth:150,
        backgroundColor:"#eee"
    },
    menu:{
        width:50,
        height:50,
        padding:0,
    },
    heading:{
        fontSize:18,
        textAlign:'center',
        backgroundColor:'#ed8f47',
        marginTop:10,
        padding:5,
        color:'#fafafa'
    },
    table:{
        flexDirection:'row',
        // justifyContent:'space-between',
        padding:10,
        paddingHorizontal:0
    },
    green:{
        backgroundColor:'green',
        flex:0,
        height:20,
        width:20,
        borderRadius:10,
        marginLeft:5,
        alignSelf:'center'
    },
    red:{
        backgroundColor:'red',
        flex:0,
        height:20,
        width:20,
        borderRadius:10,
        marginLeft:5,
        alignSelf:'center'
    },
    buttonContainer: {
        backgroundColor: PrimayColor,
        borderRadius: 100,
        marginHorizontal: '18%',
        height: 50,
        justifyContent: 'center',
        marginBottom: 20
    },
})