import { StyleSheet, Text, View, Button, FlatList, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import UIHeader from '../components/UIHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';







const Profile = (props) => {
  const { navigation, route } = props;
  // //functions of navigate to/back
  const { navigate, goBack } = navigation;

  return (
    <View >
         <UIHeader
        title={''}
        rightIconName='sign-out-alt'
        onPressRightIcon={() => {
          AsyncStorage.clear()
          navigate('signin')
        }
        }
      />
      <Text>Profile</Text>

    </View>
  )}

export default Profile

const styles = StyleSheet.create({
 



})