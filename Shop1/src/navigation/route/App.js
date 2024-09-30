import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import createPO from '../../screens/createPO';
import Signin from '../../screens/signin';
import BottomTab from '../bottomTab/UITab';
import CheckPO from '../../screens/checkPO';

const Stack = createNativeStackNavigator();
export default function App() {



    return(
       <NavigationContainer>
        <Stack.Navigator
            initialRouteName='signin'
            screenOptions={{
                headerShown: false,               
            }}
        >           
            <Stack.Screen name='tab' component={BottomTab}/>
            <Stack.Screen name='signin' component={Signin}/>
            <Stack.Screen name='createPO' component={createPO}/>
            <Stack.Screen name='checkPO' component={CheckPO}/>

        </Stack.Navigator>
       </NavigationContainer>     
    )
}