import * as React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Home from '../../screens/home';
import Payment from '../../screens/paymentStatus';
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
    BackHandler,
    Button,
    FlatList
  } from 'react-native'
// import 



const Tab = createBottomTabNavigator();
const screenOptions = ({ route }) => ({
    tabBarShowLabel: false,
    headerShown: false,
    // tabBarActiveTintColor: 'white',
    // tabBarInactiveTintColor: colors.inactive,    
    // tabBarActiveBackgroundColor: colors.primary,
    // tabBarInactiveBackgroundColor: colors.primary,  
  });



function BottomTab(props) {
    return (
      // initialRouteName="Profile"
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="home" component={Home} options={{//home
          tabBarIcon: ({ focused, size, color }) => (<Icon name={'home'} color={focused ? "#437FD1" : '#767676'} size={30} />)
        }} />
           <Tab.Screen name="payment" component={Payment}//user
          options={{
            tabBarIcon: ({ focused }) => (
            // <Icon name="money" color={focused ? "#437FD1" : '#767676'} size={30} />
            <Image style={{
               width:30,
               height:30,
               tintColor:focused ? "#437FD1" : '#767676',
               resizeMode: 'contain',
              }}
                source={require('../../../assets/images/payment.jpg')}
              />            )
          }}
        />
        {/* <Tab.Screen name="profile" component={Profile}//user
          options={{
            tabBarIcon: ({ focused }) => (<Icon name="info-circle" color={focused ? "#437FD1" : '#767676'} size={30} />)
          }}
        /> */}
      </Tab.Navigator>
    );
  };
  
  export default BottomTab;