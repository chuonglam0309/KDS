import React, { useState,useEffect } from 'react';
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
} from 'react-native'
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission, notificationListenr, getToken} from '../utils/commonUtils';
import LinearGradient from 'react-native-linear-gradient'
import { isValidEmail, isValidPassword, isValidUser, isValidVnPhone, checkUsername, checkBirthday } from '../utils/Validations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, } from "../constants";
import { MqttClient } from '../utils/MqttClient';//library MQTT for clients

function Signin(props) {
    //navigation
    const { navigation, route, } = props;
    // //functions of navigate to/back
    const { navigate, goBack, replace } = navigation;
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [mobileToken, setMobileToken] = useState('')

    var isValidationOK = () => user.length > 2 && password.length > 3;






    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          alert('A new FCM message arrived!', remoteMessage);
        });
    
        return unsubscribe;
      }, []);
    
      useEffect(() => {
        requestUserPermission();
        notificationListenr();
        (async () => {
            setMobileToken(await getToken());
        })();
      }, []);


    const checkUser = (username) => {
        if (isValidVnPhone(username) == true) {
            let usernamefix = username.slice(1);
            setUser(usernamefix)
        }
        else if (isValidVnPhone('0'.concat(username)) == true) {
            setUser(username)
        }
        else if (isValidEmail(username) == true) {
            setUser(username)
        }
    }
    async function connectMQTT(){
        return MqttClient.onConnect(onSuccess, onConnectionLost);
    }

    const onLogin = () => {
        // var APIurl = "http://192.168.1.41/BE/KDS/signin.php";
        var APIurl = "http://14.225.192.41/BE/KDS/signin.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        var Data = {
            user: user,
            password: password,
            mobileToken: mobileToken
        };
        fetch(APIurl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
            .then((Response) =>Response.json())
            .then((data) => {
                if (data[0] == 'Success') {
                    AsyncStorage.setItem('accountID', data[1])
                    replace('UITab')
                }
                else {
                    alert(data[0]);
                }
                console.log(data);
            })
            .catch((error) => {
               console.log(error)
            })
    }





    // const onSuccess = () => {
    //     console.info('Mqtt Connected');
    //   };
    //   const onConnectionLost = () => {
    //     console.info('Mqtt Fail to connect');
    //   };

    return (
        <LinearGradient colors={['#437FD1', '#6490B0']} style={{
            flex: 1
        }}>
            <ScrollView contentContainerStyle={{
            }}>
                <SafeAreaView style={{
                    flex: 1
                }}>
                    <View style={{
                        flex: 4,
                        alignItems: 'center',
                        // backgroundColor: 'red'
                    }}>
                        <Image
                            style={{
                                width: '50%',
                                height: null,
                                aspectRatio: 1,
                                alignSelf: 'center',
                                // borderWidth:1
                            }}
                            source={require('../../assets/images/smarthome.png')} />
                        <Text style={{
                            color: 'white',
                            fontSize: 35,
                            bottom: 5,

                        }}>Enduser</Text>
                    </View>
                    <View style={{
                        flex: 3.0,
                        // backgroundColor: 'red',
                        margin: 5,
                        justifyContent: 'space-around'
                    }}>
                        <View style={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                width: '90%',
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'white'

                            }}>
                                <TextInput
                                    placeholder="Mobile number or Email "
                                    keyboardType='default'
                                    autoCapitalize='none'
                                    onChangeText={(user) => {
                                        setUser('')
                                        checkUser(user)
                                    }}
                                    style={{
                                        marginVertical: 10,
                                        marginHorizontal: 10,
                                        fontSize: 18,
                                        // fontFamily: 'SanFranciscoDisplay-Regular',
                                        color: '#1D2129',
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    width: '90%',
                                    marginVertical: 10,
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: 'white'
                                }}
                            >
                                <TextInput
                                    placeholder="Password"
                                    keyboardType='default'
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    onChangeText={(password) => {
                                        setPassword(password)
                                    }}
                                    style={{
                                        marginVertical: 10,
                                        marginHorizontal: 10,
                                        fontSize: 18,
                                        // fontFamily: 'SanFranciscoDisplay-Regular',
                                        color: '#1D2129'
                                    }}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={{
                                marginTop: 30,
                                backgroundColor: isValidationOK() == true
                                    ? 'white' : colors.inactive,
                                width: '80%',
                                padding: 10,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 8,
                            }}
                            onPress={() => {
                                onLogin()
                                
                            }}
                            disabled={isValidationOK() == false}

                        >
                            <Text style={{
                                // fontFamily: 'SanFranciscoText-Medium',
                                // fontWeight:'800',
                                fontSize: 17,
                                color: 'black'
                            }}>LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* <View style={{
                        flex: 4,
                        backgroundColor: 'blue',
                        justifyContent: 'flex-end',

                    }}>
                        <View style={{
                            width: '80%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'center'


                        }}>
                            <View style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: 'white',
                                marginHorizontal: 5,

                            }} />
                            <Text style={{
                                color: 'white',
                                fontFamily: 'SanFranciscoDisplay-Regular',
                            }}>OR</Text>
                            <View style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: 'white',
                                marginHorizontal: 5,
                            }} />
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                navigate('SignUpMobileEmail')
                            }}
                        >
                            <Text style={{
                                color: 'white',
                                textAlign: 'center',
                                fontFamily: 'SanFranciscoDisplay-Regular',
                            }}
                            >Don't have an account? Sign up</Text>
                        </TouchableOpacity>


                    </View> */}
                    <View style={{ flex: 5,alignItems:'center' }} >
                        <TouchableOpacity
                            onPress={()=>{
                                navigate('signup')
                            }}
                        >
                            <Text style={{
                                color:'white',
                                textDecorationLine: 'underline',
                            }}>New user ? Register now</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </LinearGradient>

    )
}
export default Signin