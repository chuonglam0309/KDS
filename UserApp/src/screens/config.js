import React, { useState, useEffect, useRef } from 'react';
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
  LogBox,
  PermissionsAndroid,
  Linking
} from 'react-native'
import { MqttClient } from '../utils/MqttClient';//library MQTT for clients
import { UIHeader, ImageC } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WifiManager from 'react-native-wifi-reborn';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../constants';
import { LoadingModal } from "react-native-loading-modal";



function Config(props) {
  //navigation
  const { navigation, route } = props;
  // //functions of navigate to/back
  const { navigate, goBack } = navigation;
  //  unhide and hide password
  const [hidePass, setHidePass] = useState(true); 


  //declare variable ssid & password
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')

  var isValidationOK = () => ssid.length > 0 && password.length > 0;


  const [wifiList, setWifiList] = useState([])
  const [ssidConnected, setSsidConnected] = useState('')

  const [serialDevice,setSerialDevice] =  useState('')
  const [myInterval, setMyInterval] = useState('')


  const [refreshing, setRefreshing] = useState(false);


  const [modalShow, setModalShow] = useState(false)





  LogBox.ignoreAllLogs()
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'

  };
  const onConnect = () => {


    let formData = new FormData();
    formData.append('id', ssid);
    formData.append('pass', password);
    var url = "http://192.168.4.1";
    fetch(url, {
      method: 'POST',
      // headers: headers,
      body: formData,
    })
    setModalShow(true)
     
    setTimeout(() => {
      navigate('addDevice', {
        sn: serialDevice
      });
      setModalShow(false)
    }, 8000);



  }
  // Nhập địa chỉ cần đến
  // var Data = {
  //     name: ssid,
  //     age: password
  // }
  // var url = new URL("http://192.168.1.41/BE/IOT/test.php");
  // Object.keys(Data).forEach(key => url.searchParams.append(key, Data[key]))
  // fetch(url)
  // Alert.alert('Successfully ^^ Please Waiting');
  // setTimeout(() => {
  //     navigate('addDeviceScreen',{
  //         sn: ssidDevice
  //     });
  // }, 5000);






  const initWifi = async () => {
    try {
      console.log('running');
      let ssidDevice = await WifiManager.getCurrentWifiSSID();
      setSsidConnected(ssidDevice)
      // console.log((ssidDevice.indexOf('T2EC', 0) > -1))
      // if (ssidDevice.indexOf('KDS', 0) > -1) {
      //   ssidDevice = ssidDevice.slice(5,22)
      //   setSerialDevice(ssidDevice)
      // }
      // else {
      //   setSerialDevice(ssidDevice)
      // }
      // ssidDevice = ssidDevice.split('_')[1]
      // let ssidDeviceFix = ssidDevice.substring(ssidDevice.indexOf("_") + 1)
      let ssidDeviceFix = ssidDevice.split('_').slice(1, 3).join('_');
      setSerialDevice(ssidDeviceFix)

      let lastPast = ssidDevice.substring(ssidDevice.lastIndexOf("_") + 1)
      if(lastPast == 'GA'){
        console.log('đây là gas alarm')
    }
    else{
        console.log("Scale")
    }
    





      // console.log('Your current connected wifi SSID is ' + ssidDevice);
      // console.log(ssidDevice.slice(4,));
      // if (ssidDevice.indexOf('T2EC_', 0) > -1) {
      //     setSsidDevice(ssid.slice(4,))
      // }
      // else {
      // }
      // // setSsidDevice(ssidDevice)
    } catch (error) {

      // setSsid('Cannot get current SSID!' + error.message);
      console.log('Cannot get current SSID!', { error });
    }
  }


  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "SmartHome App Permission",
          message:
            "Location permission is required to connect with or scan for Wifi networks. ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        initWifi();
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const scanWifi = async () => {
    try {
      const data = await WifiManager.reScanAndLoadWifiList()
      const new_SSID = data.map(function (item) {
        return item.SSID; // 
      });
      setWifiList(new_SSID)
    } catch (error) {
      console.log(error);
    }
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      scanWifi();
      setRefreshing(false)
    });
  }, []);


  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }











  useEffect(() => {
    WifiManager.setEnabled(true)
    requestLocationPermission();
    scanWifi();
  }, []);





  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor:"white"
    }}>
      <UIHeader
        title={''}
        leftIconName={"chevron-left"}   
        onPressLeftIcon={() =>
          {
            navigate('UITab')
            clearInterval(myInterval)
          }
        }
        // rightIconName='sign-out-alt'
        // onPressRightIcon={() => {
        //   AsyncStorage.clear()
        //   MqttClient.disconnect()
        //   navigate('signin')
        // }
        // }
      />
      <View
        style={{ flex: 1 }}>
        <LoadingModal modalVisible={modalShow} ><Text > Loading..</Text></LoadingModal>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{
            flex: 1,
            alignItems: 'center',
          }}>
            <Text style={{
              color:'black'
            }}>Your current connected wifi SSID is :<Text style={{
              fontWeight: 'bold',

            }}>{ssidConnected}</Text>  </Text>

            <Text style={{
              color:'black'
            }}>Please connect to the wifi of the device you want to add. </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.sendIntent("android.settings.WIFI_SETTINGS");
                setMyInterval(setInterval(initWifi, 5000))
              }}
            >
              <Text style={{
                color: '#3378F6',
                borderBottomWidth: 1,
                borderBottomColor: '#3378F6'
              }}>Open Settings</Text></TouchableOpacity>
            <Image source={require('../../assets/images/wf.jpeg')} style={{ width: 200, height: 150 }} />
            <View style={styles.sessionInput}>
              <SelectDropdown
                data={wifiList}
                // defaultValueByIndex={0}
                // defaultValue={'Egypt'}
                onSelect={(selectedItem, index) => {
                  console.log('Wifi is Selected:', selectedItem);
                  setSsid(selectedItem)

                }}
                search
                defaultButtonText={'Select SSID'}

                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.dropdownCountry}
                buttonTextStyle={styles.dropdownCountryTxt}
                // renderDropdownIcon={isOpened => {
                //   return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                // }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdownDropdownStyle}
                rowStyle={styles.dropdownCountryRowStyle}
                rowTextStyle={styles.dropdownCountryRowTxtStyle}
              />
              <TouchableOpacity
                onPress={() => {
                  onRefresh()
                  scanWifi()
                }}
              >
                <Icon name='sync-alt' size={15} color="grey" />
              </TouchableOpacity>
            </View>
            <View style={styles.sessionInput}>
              <TextInput
                placeholder='Enter Password'
                secureTextEntry={hidePass ? true : false}
                style={styles.inputPassword}
                onChangeText={(password) => setPassword(password)}
              />


              <TouchableOpacity
                style={styles.unhide}
                onPress={() => setHidePass(!hidePass)}
              >
                <Icon
                  name={hidePass ? 'eye-slash' : 'eye'}
                  size={15}
                  color="grey"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={isValidationOK() == false}
              style={{
                height: 40,
                backgroundColor: isValidationOK() == true
                  ? colors.primary : colors.inactive,
                justifyContent: 'center',
                margin: 15,
                width: '80%',
                alignItems: 'center',
                borderRadius: 8,
              }}
              onPress={() => {
                clearInterval(myInterval)// xoá vòng lăppj gọi lại tên wifi đang kết nối 
                onConnect()
                // console.log(serialDevice);
              }
              }
            >
              <Text style={styles.connectText}>SEND</Text>
            </TouchableOpacity>
              {/* <Text>{serialDevice}</Text> */}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>

  )
}
export default Config
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  connectText: {
    color: 'white',
    fontSize: 16
  },
  dropdownCountry: {
    width: '90%',
    height: 40,
    marginVertical: 5,
    backgroundColor: 'white'
  },
  dropdownCountryTxt: { color: '#444', textAlign: 'left', fontSize: 16 },
  dropdownDropdownStyle: { backgroundColor: '#EFEFEF' },
  dropdownCountryRowStyle: { borderBottomColor: '#C5C5C5' },
  dropdownCountryRowTxtStyle: { color: '#444', textAlign: 'left' },
  sessionInput: {
    flexDirection: 'row',
    borderWidth: 0.5,
    width: '80%',
    borderColor: '',
    marginTop: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
},
inputPassword:{
  width:'90%',
  color:'black'
}


})
