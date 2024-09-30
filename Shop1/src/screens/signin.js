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
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isValidEmail, isValidPassword, isValidUser, isValidVnPhone, checkUsername, checkBirthday } from '../utils/Validations';


function Signin(props) {
    //navigation
    const { navigation, route, } = props;
    // //functions of navigate to/back
    const { navigate, goBack, replace } = navigation;
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    var isValidationOK = () => user.length > 2 && password.length > 3;


    const checkUser = (username) => {
        if (isValidVnPhone(username) == true) {
            let usernamefix = username.slice(1);
            setUser(usernamefix)
        }
        else if (isValidVnPhone('0'.concat(username)) == true) {
            setUser(username)
        }
    }
   

    const onLogin = () => {
        var APIurl = "http://14.225.205.26/BE/KDS/signinShop.php";
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        var Data = {
            user: user,
            password: password
        };
        fetch(APIurl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
            .then((Response) => Response.json())
            .then(async (Response) => {
                if (Response[0] == 'Success') {
                    AsyncStorage.setItem('shopID', Response[1])
                    replace('tab')
                }
                else {
                    Alert.alert(Response[0])
                }
            })
            .catch((error) => {
                Alert.alert("No internet " + error);
            })
    }
  

    return (
        <View style={{
            flex: 1,
            backgroundColor:'#6490B0'
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
                            source={require('../../assets/images/shop.png')} />
                        
                        <Text style={{
                            color: 'white',
                            fontSize: 35,
                            bottom: 5,
                        }}>Shop</Text>
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
                                        fontFamily: 'SanFranciscoDisplay-Regular',
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
                                        fontFamily: 'SanFranciscoDisplay-Regular',
                                        color: '#1D2129'
                                    }}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={{
                                marginTop: 30,
                                backgroundColor: 'white' ,
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

                        >
                            <Text style={{
                                fontFamily: 'SanFranciscoText-Medium',
                                // fontWeight:'800',
                                fontSize: 17,
                                color: 'black'
                            }}>LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.5, }} >

                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>

    )
}
export default Signin