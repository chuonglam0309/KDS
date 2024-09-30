import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    Button,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { isValidEmail, isValidPassword, isValidUser, isValidVnPhone, checkUsername, checkBirthday } from '../utils/Validations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, icons, fontSizes } from "../constants";

function SignUp(props) {
    const { navigation, route, } = props;
    const { navigate, goBack } = navigation;

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [note, setNote] = useState({
        phone: '',
        email:'',
      });


    var isValidationOK = () => firstname.length > 2 && lastname.length > 2 && address.length > 10 && email.length > 0 && phone.length > 0 && password == confirm ;

    const checkPhone = (phone) => {
        if (isValidVnPhone(phone) == true) {
            let usernamefix = phone.slice(1);
            setPhone(usernamefix)
            setNote((prevNote) => ({
                ...prevNote,
                phone: ''
              }));
        }
        else if (isValidVnPhone('0'.concat(phone)) == true) {
            setPhone(phone)
            setNote((prevNote) => ({
                ...prevNote,
                phone: ''
              }));
        }
        else{
            setPhone('')
            setNote((prevNote) => ({
                ...prevNote,
                phone: 'Invalid Phone number'
              }));
        }   
    }

    const checkMail = (mail) => {
        if(isValidEmail(mail) == true){
            setEmail(mail)
            setNote((prevNote) => ({
                ...prevNote,
                email: ''
              }));
        }
        else{
            setEmail('')
            setNote((prevNote) => ({
                ...prevNote,
                email: 'Invalid mail'
              }));
        }
    }
    const checkMail1 = (mail) => {
        if(isValidEmail(mail) == true){
            console.log('đúng là mail');
        }
        else{
            console.log('không phải  mail');

        }
    }






    const onRegister = () => {
        var APIurl = "http://14.225.192.41/BE/KDS/signup.php";
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        var Data = {
            email: email,
            phone: phone,
            password: password,
            firstname: firstname,
            lastname:lastname,
            address:address,
        };
        fetch(APIurl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
            .then((Response) => Response.json())
            .then((Response) => {
                if(Response[1] == 'Successful'){
                    Alert.alert('Registration Successful')
                    setTimeout(() => {
                       navigate('signin')
                      }, 4000)
                }
                else{
                    Alert.alert(Response[0])
                }
                // if(Response[1] != 'Successful'){
                //     Alert.alert(Response[0]);
                // }
            })
            .catch((error) => {
                Alert.alert( error);
            })
    }








    return (
        <LinearGradient
            // behavior={Platform.OS === "ios" ? "padding" : "height"}
            colors={['#437FD1', '#6490B0']} style={{
                flex: 1
            }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.titleHeader}>Sign up</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.sectionName}>
                        <TextInput
                          onChangeText={(firstname)=>setFirstname(firstname)}
                            style={{
                                width:'45%',
                                borderWidth:1,
                                borderRadius:8,
                                textAlign:'center',
                                borderColor:colors.inactive,
                                marginRight:5,height:45,
                            }}
                            placeholder='First name' />
                        <TextInput
                            onChangeText={(lastname)=>setLastname(lastname)}
                             style={{
                                width:'45%',
                                borderWidth:1,
                                borderRadius:8,
                                textAlign:'center',
                                borderColor:colors.inactive,
                                height:45,
                            }}
                            placeholder='Last name' />
                    </View>
                    <View 
                        style={{
                            width:'90%',
                            borderWidth:1,
                            borderRadius:8,
                            textAlign:'center',
                            borderColor:colors.inactive,
                            alignSelf:'center',
                            marginTop:10,
                            alignItems:'center',height:45,
                        }}
                        >
                        <TextInput
                            onChangeText={(address)=>setAddress(address)}
                            placeholder='Address' />
                    </View>
                    <View
                       style={{
                        width:'90%',
                        alignSelf:'center',
                        marginTop:10,
                        alignItems:'center',
                    }}>
                        <TextInput
                            style={{
                                height:45,
                                textAlign:'center',
                                borderWidth:1,
                                borderRadius:8,
                                width:'100%',
                                borderColor:colors.inactive,
                            }}
                            onChangeText={(mail)=>checkMail(mail)}
                            placeholder='Email' />
                        <Text style={styles.noteText}>{note.email}</Text>
                    </View>
                    <View
                        style={{
                            width:'90%',
                            alignSelf:'center',
                            alignItems:'center',
                        }}
                        >
                        <TextInput
                            style={{
                                height:45,
                                textAlign:'center',
                                borderWidth:1,
                                borderRadius:8,
                                width:'100%',
                                borderColor:colors.inactive,
                            }}
                            onChangeText={(phone)=>checkPhone(phone)}
                            placeholder='Phone' />
                        <Text style={styles.noteText}>{note.phone}</Text>
                    </View>
                    <View style={{
                    }}>
                        <Text style={{
                                fontSize: 18,
                                color: '#437FD1',
                                textAlign: 'center'
                                }}>Password</Text>
                        <View 
                        style={{
                            width:'90%',
                            borderWidth:1,
                            borderRadius:8,
                            textAlign:'center',
                            borderColor:colors.inactive,
                            alignSelf:'center',
                            marginTop:10,
                            alignItems:'center',
                            height:45,
                        }}
                        >
                        <TextInput
                            style={{
                                textAlign:'center',
                            }}
                            onChangeText={(password)=>setPassword(password)}
                            secureTextEntry={true}
                            placeholder='Password' />
                        </View>
                        <View
                        style={{
                            width:'90%',
                            borderWidth:1,
                            borderRadius:8,
                            textAlign:'center',
                            borderColor:colors.inactive,
                            alignSelf:'center',
                            marginTop:10,
                            alignItems:'center',
                            height:45,
                        }}
                        >
                        <TextInput
                            style={{
                                textAlign:'center',
                            }}
                            onChangeText={(confirm)=>setConfirm(confirm)}
                            secureTextEntry={true}
                            placeholder='Confirm Password' />
                        </View>
                    </View>

                    <TouchableOpacity 
                    onPress={()=>{
                        onRegister()
                    }}
                        disabled={isValidationOK() == false} 
                        style={{
                            width:'80%',
                            borderRadius:15,
                            alignSelf:'center',
                            marginTop:10,
                            alignItems:'center',
                            // backgroundColor:'#437FD1',
                            backgroundColor: isValidationOK() == true
                                    ? '#437FD1' : colors.inactive,
                            height:42,justifyContent:'center'
                        }}>
                        <Text style={{color:'white',fontSize:15}}>CREATE</Text>
                    </TouchableOpacity>
                    
                </View>
                <View style={{backgroundColor:'white',alignItems:'center'}}>
                        <TouchableOpacity
                            onPress={()=>{
                                navigate('signin')
                            }}
                        >
                        <Text style={{color:'#437FD1'}}>Already have an account? </Text>
                        </TouchableOpacity>
                </View>
            </ScrollView>




        </LinearGradient>
    )
}
export default SignUp
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleHeader: {
        fontSize: 28,
        color: 'white',
        // fontFamily: 'SanFranciscoDisplay-Regular',
        fontWeight: '600'
    },
    body: {
        flex: 9,
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 10,
    },
    sectionName:{
        flexDirection:'row',
        justifyContent:'center'
    },
    noteText:{
        color:'red',
        fontSize:15,
        margin:5
    }
    
})