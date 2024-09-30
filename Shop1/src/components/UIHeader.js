// Input : title, leftIconName, rightIconName,onPressLeftIcon, onPressRightIcon
// Output header có tên: title, icon trái,phải theo fontAwesome:leftIconName, rightIconName.  chức năng trái phải :onPressLeftIcon, onPressRightIcon
import React, {Component} from 'react'
import {
    TouchableOpacity, 
    Text,
    View,
    SafeAreaView
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
// import {colors, fontSizes} from '../constants'

function UIHeader(props) {
    const {
        title, 
        leftIconName,
        rightIconName,
        onPressLeftIcon,
        onPressRightIcon,
        iconColor
    } = props
    return <SafeAreaView style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor:'blue'
        marginTop:10
   
    }}>
        <Icon      
            name={leftIconName}
            style={{padding:5}}
            size={20} color={iconColor || '#343A76'}
            onPress={onPressLeftIcon}
        /> 
        <Text style={{
            paddingBottom:5,
            fontSize: 20,
            // alignSelf:'center',
            color: '#343A76',
            fontWeight:'bold',
            // fontWeight:'600',
            fontFamily: 'SanFranciscoText-Medium',
        }}>{title}</Text>
        <Icon            
            name={rightIconName}
            style={{padding:5}}
            size={30} color={iconColor || '#343A76'}
            onPress={onPressRightIcon}
        />    
    </SafeAreaView>
}
export default UIHeader