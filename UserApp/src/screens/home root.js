import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

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
import { MqttClient } from '../utils/MqttClient';//library MQTT for clients
import { UIHeader, ImageC } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';




function Home(props) {
  //navigation
  const { navigation, route } = props;
  // //functions of navigate to/back
  const { navigate, goBack } = navigation;

  //const [date, setDate] = useState(new Date())// get datetime current
  const [deviceList, setDeviceList] = useState([])// get datetime current
  const [name, setName] = useState('')
  const [accountID, setAccountID] = useState(0)
  const [serialList, setSerialList] = useState([]);// danh sách serial dùng để subcribe
  const [isConnected, setIsConnected] = useState(false)








const onSubscribe = message => {
    console.log(message);
    handleValue(accountID)
};


  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     () => {
  //       // code chức năng cho phím back  ở đây
  //       return true;
  //     }
  //   );
  //   return () => backHandler.remove();
  // }, []);


// xử lý sự kiện khi mqtt kết nối đến broker thành công
  const onSuccess = () => {
    console.info('Mqtt Connected');
    setIsConnected(true)
};

// xử lý sự kiện khi mqtt  mất kết nối đến broker 
const onConnectionLost = () => {
    // setMqttConnected(false);
    console.info('Mqtt Fail to connect');
    // AsyncStorage.setItem('StatusConnection', 'false');
    setIsConnected(false)

}; 


useEffect(() => {
  console.log('đang sub');
        if (MqttClient.Isconnect() == true) {
            for (let i of serialList) {
                MqttClient.onSubscribe(i, onSubscribe);
                console.log('subeb');
            }
        }
    }, [serialList,isConnected])


 useEffect(() => {
        if (MqttClient.Isconnect() == false) {
          MqttClient.onConnect(onSuccess, onConnectionLost);
          console.log('đã kết nối');
        }
      }, [])



  const handleValue = async (ID) => {

    const url = 'http://14.225.192.41/BE/KDS/home.php';

    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    try {
      var Data = {
        accountID: ID,
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data)
      });
      const rep = await response.json();
      // if(rep[0] != "No Device"){
        setDeviceList(rep)

        const sn_list = rep.map(function (item) {
          return item.serialNumber // 
      });
        setSerialList(sn_list)
      // }
      // else{
      console.log('call api');
      // }
      // setIsDataLoaded(true); // Đánh dấu là dữ liệu đã được tải về thành công
      setName(rep[0].lastname)
    } catch (error) {
      console.log(error);
    }
  };


  // const getAsyncstorage = async () => {
  //   try {
  //     let accountID = await AsyncStorage.getItem('accountID');
  //     await handleValue(accountID);
  //   } catch (error) {
  //     console.log('error');
  //   }
  // };





  useFocusEffect(
    React.useCallback(() => {
      const getAsyncstorage = async () => {
        try {
          console.log('run');
          const accountID = await AsyncStorage.getItem('accountID');
          setAccountID(accountID)
          await handleValue(accountID);
        } catch (error) {
          console.log(error);
        }
      };

      getAsyncstorage();
    }, [])
  );





  return (
    <SafeAreaView style={{
      flex: 1,
      paddingHorizontal:5,
    }}>
      <StatusBar barStyle="dark-content" />

      <UIHeader
        title={''}
        // leftIconName={"chevron-left"}   
        // onPressLeftIcon={() =>
        //   navigate('Tab')
        // }
        rightIconName='sign-out-alt'
        onPressRightIcon={() => {
          AsyncStorage.clear()
          MqttClient.disconnect()
          navigate('signin')
        }
        }
      />
      <View style={styles.Header}>
        <Text style={{
          color: '#b3b3b3',
          fontWeight: '600',
          fontSize: 18
        }}>
          Welcome,
        </Text>

        <Text style={{
          fontSize: 18,
          fontWeight: '700',
          color: '#343A76',
        }}> {name}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleBody}>
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: "#343A76",
          }}>Device List</Text>
          {/* <TouchableOpacity
                        onPress={() =>
                            navigate('', {
                            })
                        }
                    >
                        <FontAwesome5 name='pen' size={10} color={colors.gray} />
                    </TouchableOpacity> */}
        </View>
        <FlatList
          data={deviceList}
          style={{
            // backgroundColor:'red'
          }}
          ListHeaderComponent={
            <TouchableOpacity
              onPress={() => navigate('config')}
              style={{
                width: "90%",
                height: 130,
                marginVertical: 6,
                alignSelf: 'center',
                shadowColor: '#171717',
                shadowOffset: { width: -2, peak: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 5,
                backgroundColor: 'white',
                borderRadius: 8
              }}>
              <View style={{
                flex: 1,
                alignItems: 'center',
              }}>
                <View style={{
                  flex: 3 / 4,
                  justifyContent: 'center',
                  
                }}>
                  <View style={{
                    backgroundColor: '#437FD1',
                    justifyContent: 'center',
                    borderRadius: 50,
                    width: 60,
                    height: 60,
                    alignItems: 'center'

                  }}>
                    <FontAwesome5 name='plus' size={25} style={{
                      color: 'white'
                    }} />
                  </View>
                </View>
                <View style={{
                  flex: 1 / 4,
                  // backgroundColor:'red'
                }}>
                  <Text style={{
                    color: '#437FD1',
                    // fontFamily: 'SanFranciscoDisplay-Regular',
                    fontWeight: '700',
                  }}>Add Device</Text>
                </View>
              </View>

            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.btnFlatlist}
              onPress={() => {
                // if (MqttClient.Isconnect() == true) {

                //     navigate('monitor', {
                //         id: item.deviceID,
                //         sn: item.Sn,
                //         name: item.name
                //     })
                // }
                // else {
                //     alert('No connection to Server')
                // }
                navigate('monitor',{
                  serialNumber:item.serialNumber,
                  deviceName: item.name,
                })
              }}
            >
              <View style={{
                flex: 1,
                alignItems: 'center',
                // backgroundColor:'red'
              }}>
                <View style={{
                  position: 'absolute',
                  right: 5,
                  top: 5
                }}>
                  {
                    item.device_status == 1 ?
                      <Image style={{
                        resizeMode: 'contain',
                        width: 20,
                        height: 20,
                      }}
                        source={require('../../assets/images/online.png')}
                      />
                      :
                      <Image style={{
                        resizeMode: 'contain',
                        width: 20,
                        height: 20,
                        tintColor: '#dbd9d9'
                      }}
                        source={require('../../assets/images/offline.png')}
                      />
                  }
                </View>
                <View style={{
                  flex: 0.7,
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: '#0B1C33',
                    fontWeight: '600',
                    // fontFamily: 'SanFranciscoDisplay-Thin',
                    fontSize: 16

                  }}
                  >{item.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )
          }


          keyExtractor={item => item.serialNumber}
          numColumns={1}
        />
      </View>


    </SafeAreaView>

  )
}
export default Home
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white'
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  btnFlatlist: {
    width: "90%",
    height: 130,
    marginVertical: 6,
    alignSelf: 'center',
    shadowColor: '#171717',
    shadowOffset: { width: -2, peak: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10
  },
  Header: {
    flex: 1,
    // backgroundColor:'blue'
    flexDirection: 'row'
  },
  body: {
    flex: 9,
    // backgroundColor:'blue'
  },
})