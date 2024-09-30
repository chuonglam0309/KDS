import React,{useEffect} from 'react';
import { Platform, StyleSheet, Text, View, Button,BackHandler } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signin from '../screens/signin';
import Home from '../screens/home';
import Signup from '../screens/signup';
import Config from '../screens/config';
import AddDevice from '../screens/addDevice';
import Monitor from '../screens/monitor';
import BottomTab from './bottomTab/bottomTab';
import Payment from '../screens/paymentStatus';
import ConfigS from '../screens/configS';
const Stack = createNativeStackNavigator();

export default function App() {
    
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='signin'
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            >   
                {/* <Stack.Screen name={"paymentStatus"} component={Payment} /> */}
                <Stack.Screen name={"signup"} component={Signup} />
                <Stack.Screen name={"signin"} component={Signin} />
                <Stack.Screen name={"UITab"} component={BottomTab} />
                <Stack.Screen name={"config"} component={Config} />
                <Stack.Screen name={"addDevice"} component={AddDevice} />
                <Stack.Screen name={"monitor"} component={Monitor} />
                <Stack.Screen name={"configS"} component={ConfigS} />







            </Stack.Navigator>
        </NavigationContainer>
    )
}
