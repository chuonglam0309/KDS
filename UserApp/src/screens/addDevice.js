import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SelectDropdown from 'react-native-select-dropdown';

// import { colors } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UIHeader} from '..//components/index'
import { colors, icons, fontSizes } from "../constants";


function AddDevice(props) {
  //navigation
  const { navigation, route } = props;
  // //functions of navigate to/back
  const { navigate, goBack } = navigation;
  // declare variable UserID
  const [accountID, setAccountID] = useState('')

  //receive data from homeScreen
  const {sn}= route.params
  const Serial = sn



  // declare variable  device serial number
  // const [sn, setSN] = useState('')
  const [deviceName, setDeviceName] = useState('')
  const [address, setAddress] = useState('')

  // declare variable  validate
  var isValidationOK = () => deviceName.length > 0  




  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'

  };

  const deviceType = [
    'Light',
    'Fan',
    'Air-condition',
    'Socket 1channel',
    'Socket 2channel',
    'Socket 3channel',
    'Socket 4channel',
  ];




  const urlAdd = 'http://14.225.192.41/BE/KDS/addDevice.php';

  const getStatus = async () => {
    try {
      let status = await AsyncStorage.getItem('StatusConnection');
      if(status == 'true')
      {
        console.log('connected')}
      else{
        console.log('not')
      }
    }
    catch (error) {
      alert(error);
    }
  };


  const getAsyncstorage = async () => {
    try {
      let accountID = await AsyncStorage.getItem('accountID');
      // set value userID
      setAccountID(accountID);
    }
    catch (error) {
      alert(error);
    }
  };

  function onAddDevice() {
    console.log(accountID);
    const Data = {
      accountID: accountID,
      deviceName: deviceName,
      serial: Serial,
      address :address
    };


    fetch(urlAdd, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data)
    })
      .then((e) => 
      // console.log(e)
      e.json()
      ) //check response type of API (CHECK OUTPUT OF DATA IS IN JSON)
      .then((rep) => {
        console.log(rep);
          if(rep[0] == "Successful")
          {
            Alert.alert('Notification', 'Successfully added device. You can check in DeviceList', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Move DeviceList Screen',
                onPress: () =>
                  navigate('home')
                  
              },
            ]);
          }
          else{
            alert(rep[0])
          }
      })
      .catch((error) => {
        console.log("Error Occure" + error);

      })
  }



  useEffect(() => {
    getAsyncstorage()
  }, [])











  return (
    <View style={{
      flex: 1,
      backgroundColor: 'white'
    }}>
      <UIHeader
        title={'Add device'}
        leftIconName={"chevron-left"}   
        onPressLeftIcon={() =>
          navigate('config')
        }
      />
      <SafeAreaView></SafeAreaView>
      <View style={styles.container}>

        <View style={styles.mainContainer} >
          <View style={styles.detail}>
           <Text style={{
             padding: 5,
             fontSize: 16,
           }}>{Serial}</Text>
              
          </View>
          <View style={styles.detail}>
            <TextInput
              onChangeText={(name) => setDeviceName(name)}
              placeholder='Device name'
              style={styles.input} />
          </View>
          <View style={styles.detail}>
            <TextInput
              onChangeText={(address) => setAddress(address)}
              placeholder='Address'
              style={styles.input} />
          </View>
          <View style={{
            alignItems: 'center',
          }}>
          
          </View>

          <TouchableOpacity
            style={{
              marginTop: 30,
              backgroundColor: isValidationOK()  ? colors.primary : colors.inactive,
              width: '100%',
              padding: 10,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
            }}
            onPress={() => {
              onAddDevice();
            }}
            disabled={!isValidationOK() }


          >
            <Text style={{
               color: 'white',
               fontSize: 16
            }}>ADD</Text>
          </TouchableOpacity>



       



        </View>

      </View>
    </View>

  );
}
export default AddDevice
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  blankContainer: {
    flex: 3,
    backgroundColor: colors.primary
  },
  mainContainer: {
    flex: 7,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginTop: 10,

  },
  detail: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#F1F1F2',
    borderRadius: 10,
    marginVertical: 10
  },
  title: {
    color: colors.inactive,
    fontFamily: 'SanFranciscoDisplay-Regular',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    padding: 5,
    fontSize: 16,
  },

  dropdown2BtnStyle: {
    height: 45,

    backgroundColor: '#FFF',
    borderRadius: 8,
    backgroundColor: '#F1F1F2',
    width: '100%'

  },
  dropdown2BtnTxtStyle: {
    textAlign: 'left',
    fontSize: 16
  },
  dropdown2DropdownStyle: { backgroundColor: '#EFEFEF' },
  dropdown2RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
  dropdown2RowTxtStyle: { color: '#444', textAlign: 'left' },





});
