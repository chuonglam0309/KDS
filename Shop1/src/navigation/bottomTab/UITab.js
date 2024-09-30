import * as React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Home from '../../screens/home';
import Profile from '../../screens/profile';
import Job from '../../screens/jobs';




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
           <Tab.Screen name="job" component={Job}//user
          options={{
            tabBarIcon: ({ focused }) => (<Icon name="shipping-fast" color={focused ? "#437FD1" : '#767676'} size={30} />)
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