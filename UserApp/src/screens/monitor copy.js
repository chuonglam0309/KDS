import React, { useState, useEffect } from 'react';
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
  Button
} from 'react-native'
import { MqttClient } from '../utils/MqttClient';//library MQTT for clients
import { UIHeader, ImageC } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';



function Monitor(props) {
  //navigation
  const { navigation, route } = props;
  // //functions of navigate to/back
  const { navigate, goBack } = navigation;

  //const [date, setDate] = useState(new Date())// get datetime current
  //functions of params in route
  //receive data from homeScreen
  const { serialNumber, deviceName } = route.params;

  const maxWeight = 100;
  const [weight, setWeight] = useState(0)
  const [battery, setBattery] = useState(0)
  const [time, setTime] = useState('')
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [perGas, setPerGas] = useState(0)
  const [weightVal, setWeightVal] = useState(0)
  const [oldBottle, setOldBottle] = useState(0)



2
  const onSubscribe = message => {
    // console.log(message);

    // var batteryMess = Number(message.split("_")[0])
    // var weightMess = Number(message.split("_")[1])



    setBattery(Number(message.split("_")[0]));
    setWeight(Number(message.split("_")[1]));
    setPerGas(((Number(message.split("_")[1]) - (oldBottle+weightVal)) / 12) * 100)
    let date = new Date() // get datetime current
    setTime(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);


  };




  const url = 'http://14.225.192.41/BE/KDS/monitor.php';

  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
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




  //  function connectMQTT(){
  //     return MqttClient.onConnect(onSuccess, onConnectionLost)

  // }



  const onSuccess = () => {
    console.info('Mqtt Connected');
    MqttClient.onSubscribe(serialNumber, onSubscribe);
  };




  const handleValue = async (ID) => {
    try {
      // console.log(ID);
      var Data = {
        serialNumber: ID,
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data)
      });
      const rep = await response.json();
      // console.log(rep);
      setBattery(rep[0].battery);
      setWeight(rep[0].gas);
      setTime(rep[0].time);
      setPerGas(rep[0].perGas)
      setOldBottle(rep[0].oldBottle)
      setWeightVal(rep[0].weightValve)
    } catch (error) {
      console.log(error);
    }
  };
  const getAsyncstorage = async () => {
    try {
      let accountID = await AsyncStorage.getItem('accountID');
      await handleValue(serialNumber);
    } catch (error) {
      console.log('error');
    }
  };




  useEffect(() => {
    getAsyncstorage()
    console.log('effect1');
    MqttClient.onSubscribe(serialNumber, onSubscribe);
  }, []);







  return (
    <SafeAreaView style={{
      flex: 1,
    }}>
      <UIHeader
        title={deviceName}
        leftIconName={"chevron-left"}
        onPressLeftIcon={() =>
          goBack()
        }
        rightIconName={'cogs'}
        onPressRightIcon={() => {
          navigate('configS')
        }}
      />
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.gasbottleIcons}>
            {
              (perGas) <= 0 ?
                (
                  <View>
                    <Image
                      style={styles.imageBottel}
                      source={require('../../assets/images/icon-gas/0.png')}
                      resizeMode='contain' />
                    <Text style={styles.warningText}>Warning: Low Gas </Text>
                  </View>
                )
                :
                (perGas) < 11 ?
                  (
                    <View>
                      {/* <ImageC imagePath='../../assets/images/icon-gas/10.png'/> */}
                      <Image
                        style={styles.imageBottel}
                        source={require('../../assets/images/icon-gas/10.png')}
                        resizeMode='contain' />
                      <Text style={styles.warningText}>Warning: Low Gas </Text>
                    </View>
                  )
                  : (perGas) < 21 ?
                    (
                      <Image
                        style={styles.imageBottel}
                        source={require('../../assets/images/icon-gas/20.png')}
                        resizeMode='contain' />
                    )
                    : (perGas) < 51 ?
                      (
                        <Image
                          style={styles.imageBottel}
                          source={require('../../assets/images/icon-gas/50.png')}
                          resizeMode='contain' />
                      )
                      : (perGas) < 81 ?
                        (
                          <Image
                            style={styles.imageBottel}
                            source={require('../../assets/images/icon-gas/80.png')}
                            resizeMode='contain' />
                        )
                        :
                        (
                          <Image
                            style={styles.imageBottel}
                            source={require('../../assets/images/icon-gas/100.png')}
                            resizeMode='contain' />
                        )
            }
            <Text style={styles.gasbottleText}>{perGas} %</Text>
          
          </View>
          <View style={styles.batteryIcons}>
            {
              battery == 0 ?
                (
                  <View>
                    <Image
                      style={styles.imageBattery}
                      source={require('../../assets/images/icon-battery/0.png')}
                      resizeMode='contain' />
                    <Text style={styles.warningText}>Warning: Low Battery </Text>
                  </View>
                )
                : battery < 11 ?
                  (
                    <View>
                      <Image
                        style={styles.imageBattery}
                        source={require('../../assets/images/icon-battery/10.png')}
                        resizeMode='contain' />
                      <Text style={styles.warningText}>Warning: Low Battery </Text>
                    </View>
                  )
                  : battery < 21 ?
                    (
                      <View>
                        <Image
                          style={styles.imageBattery}
                          source={require('../../assets/images/icon-battery/20.png')}
                          resizeMode='contain' />
                        <Text style={styles.warningText}>Warning: Low Battery </Text>
                      </View>
                    )
                    : battery < 31 ?
                      (
                        <View>
                          <Image
                            style={styles.imageBattery}
                            source={require('../../assets/images/icon-battery/30.png')}
                            resizeMode='contain' />
                          <Text style={styles.warningText}>Warning: Low Battery </Text>
                        </View>
                      )
                      : battery < 41 ?
                        (
                          <View>
                            <Image
                              style={styles.imageBattery}
                              source={require('../../assets/images/icon-battery/40.png')}
                              resizeMode='contain' />
                            <Text style={styles.warningText}>Warning: Low Battery </Text>
                          </View>
                        )
                        : battery < 51 ?
                          (
                            <Image
                              style={styles.imageBattery}
                              source={require('../../assets/images/icon-battery/50.png')}
                              resizeMode='contain' />
                          )
                          : battery < 61 ?
                            (
                              <Image
                                style={styles.imageBattery}
                                source={require('../../assets/images/icon-battery/60.png')}
                                resizeMode='contain' />
                            )
                            : battery < 71 ?
                              (
                                <Image
                                  style={styles.imageBattery}
                                  source={require('../../assets/images/icon-battery/70.png')}
                                  resizeMode='contain' />
                              )
                              : battery < 81 ?
                                (
                                  <Image
                                    style={styles.imageBattery}
                                    source={require('../../assets/images/icon-battery/80.png')}
                                    resizeMode='contain' />
                                )
                                : battery < 91 ?
                                  (
                                    <Image
                                      style={styles.imageBattery}
                                      source={require('../../assets/images/icon-battery/90.png')}
                                      resizeMode='contain' />
                                  )
                                  : battery <= 100 ?
                                    (
                                      <Image
                                      style={styles.imageBattery}
                                        source={require('../../assets/images/icon-battery/100.png')}
                                        resizeMode='contain' />
                                    )
                                    :
                                    <Text style={{
                                      textAlign: 'center'
                                    }}>No data </Text>
            }
                <Text style={styles.batteryText}>{battery} %</Text>
          </View>
          <Text style={styles.noteText}>Total: {weight} Kg</Text>
          <Text style={styles.noteText}>Tank: {oldBottle} Kg</Text>
          <Text style={styles.noteText}>Valve: {weightVal} Kg</Text>

          
        </View>
        
        <View style={{
          alignItems: 'center',
          // backgroundColor:'red',
          paddingBottom: 10,
        }}>
          <Text style={{
            color: 'black',
            fontSize: 18
          }}>Time update: {time}</Text>
        </View>

      </View>

    </SafeAreaView>

  )
}
export default Monitor
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white'
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  noData: {
    fontSize: 20,
    color: '#ff0000',
    textAlign: 'center'
  },
  batteryIcons: {
    flex: 1  ,
    alignItems:'center'
  },

  warningText: {
    fontSize: 20,
    color: '#ff0000',
    textAlign: 'center'
  },
  batteryText: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343A76',
    textAlign: 'center'
  },
  imageBattery: {
    width: 200,
    height: 220,
    marginTop: 20,
    // backgroundColor:'red'
  },
  gasbottleIcons: {
    flex: 1,
    // backgroundColor:'blue',
  },
  imageBottel: {
    width: undefined,
    height: 220,
  },
  gasbottleText: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343A76',
    textAlign: 'center'
  },
  noteText:{
    fontSize:18,
    fontWeight:'400',
    marginHorizontal:15,
    color:'black'
  }
})
