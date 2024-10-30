import { StyleSheet, Text, View, NativeModules, NativeEventEmitter, Platform, PermissionsAndroid, Button, FlatList, Alert, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react';

import BleManager from 'react-native-ble-manager';
import { BLEDevice } from '../components/bleDevices';
import RNSpeedometer from 'react-native-speedometer'
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import UIHeader from '../components/UIHeader';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);



const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; // UUID của service cần đọc
const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // UUID của characteristic cần đọc


const CreatePo = (props) => {
  const date = new Date() // get datetime current


  const { navigation, route } = props;
  // //functions of navigate to/back
  const { navigate, goBack } = navigation;
  const { serialNumber, productID, productName, oldBottle, netW, price, accountLastname, accountFirstname, address, mobile, shopID,weightValve } = route.params

  const OldBottle = Number(oldBottle)
  const NetW = Number(netW)
  const Price = (Number(price)).toFixed(0)

  const [newProduct, setNewProduct] = useState([])

  const [valve, setValve] = useState(0)

  const [productList, setProductList] = useState([])
  const [productListFix, setProductListFix] = useState([])

  // ẩn hiện modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [deviceSelected, setDeviceSelected] = useState('')

  const [devices, setDevices] = useState([])
  const [isBLE, setIsBLE] = useState(false)
  const [isScanning, setIsScanning] = useState(false)//Kiểm tra xem có đang scan tìm thiết bị không??
  const [isConnected, setIsConnected] = useState(true)// Kiểm tra xem đã kết nối thiết bị nào chưa??
  // const [deviceSelected, setDeviceSelected] = useState('')
  const [value, setValue] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  var isValidationOK = () => data.calib > 0 && data.oldGasTank > 0 && data.newGasTank > 0 && valve > 0;
  const [dataNewEmptybottle, setDataNewEmptybottle] = useState(0);

  const [data, setData] = useState({
    calib: 0,
    oldGasTank: 0,
    newGasTank: 0,
  });
  const [PO, setPO] = useState({
    oldGiveBackGas: 0,
    oldGiveBackMoney: 0,
    newPayGas: 0,
    newPayMoney: 0,
  })

  const array = [];


  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  };

  const renderItem = ({ item }) => (
    <BLEDevice device={item} onPress={() => {
      connectToDevice(item)
      console.log('nó đây', item);
    }} />
  );

  const startScan = () => {
    // setRefreshing(true)
    if (!isScanning) {
      BleManager.scan([], 5, false).then(() => {
        // Success code
        console.log("Scan started");
        setRefreshing(false)
      })
        .catch(e => console.log(e))

    }
  };



  //phát hiện thiết bị sau khi scan
  const handleDiscoverDevice = (device) => {
    // console.log(device.id);
    const { name, rssi, id: mac } = device; // Lấy giá trị name, rssi và id của thiết bị
    // // Kiểm tra xem thiết bị đã tồn tại trong mảng devices hay chưa
    const isExist = array.some(d => d.mac === mac);
    // // Nếu chưa tồn tại thì thêm mới vào mảng devices
    if (!isExist) {
      array.push({ name: name || '', rssi: rssi || '', mac })

    }
    setDevices(array)
    // console.log('scan');

  };


  const enableBluetooth = () => {
    BleManager.enableBluetooth()
      .then(() => {
        console.log('Bluetooth is enabled');
        setIsBLE(true)
      })
      .catch((error) => {
        console.log('Error enabling Bluetooth:', error);
      });
  };



  // kết nối thiết bị được chọn trên flatlist dựa vào macAddress
  const connectToDevice = (device) => {
    // A8:81:7E:6B:45:6C
    setDeviceSelected(device.mac)
    BleManager.connect(device.mac)
      .then(() => {
        // Success code
        console.log("Connected");
        // setDeviceSelected(device)
        setIsConnected(true)

        BleManager.retrieveServices(device.mac).then(
          (peripheralInfo) => {
            // Success code
            // console.log("Peripheral info:", peripheralInfo);
            console.log('Retrieved services');
            startStreamingData(device)
            // readFromDevice(device)
          }
        );

      })
      .catch((error) => {
        // Failure code
        console.log('error');
      });
  }



  const disconnecToDevice = (mac) => {
    // A8:81:7E:6B:45:6C

    BleManager.disconnect(mac)
      .then(() => {
        // Success code
        console.log("Disconnected");
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }





  // đọc dữ liệu pin từ thiết bị đọc liên tục
  const startStreamingData = async (device) => {
    BleManager.startNotification(device.mac, serviceUUID, characteristicUUID)
      //'0000180f-0000-1000-8000-00805f9b34fb','00002a19-0000-1000-8000-00805f9b34fb'
      .then(() => {
        console.log('Started continuous reading');

        // Lắng nghe sự kiện khi có dữ liệu mới
        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleNewData);
      })
      .catch((error) => {
        console.log('Error starting continuous reading:', error);
      });



    // gọi hàm set dữ liệu cho biến value
    const handleNewData = (data) => {
      // setValue(data.value[0])
      // setTest(data)
      let stringData = '';

      for (let i = 0; i < (data.value).length; i++) {
        stringData += String.fromCharCode(data.value[i]);
      }
      console.log(Number(stringData.split("|")[0]));
      setValue(Number(stringData.split("|")[0]));

    };




    // BleManager.read(// đây là đọc dữ liệu 1 lần
    //   item.mac,
    //   "0000180f-0000-1000-8000-00805f9b34fb",
    //   "00002a19-0000-1000-8000-00805f9b34fb"
    // )
    //   .then((readData) => {
    //     // Success code
    //     console.log("Read: " + readData);

    //     // https://github.com/feross/buffer
    //     // https://nodejs.org/api/buffer.html#static-method-bufferfromarray
    //     // const buffer = Buffer.from(readData);
    //     // const sensorData = buffer.readUInt8(1, true);
    //   })
    //   .catch((error) => {
    //     // Failure code
    //     console.log(error);
    //   });
  }


  // đọc dữ liệu 1 lần
  const readFromDevice = (device) => {
    BleManager.read(
      device.mac,
      serviceUUID,
      characteristicUUID
    )
      .then((readData) => {
        // Success code
        console.log('New data:', readData[0]);
        setValue(readData[0])
        // https://github.com/feross/buffer
        // https://nodejs.org/api/buffer.html#static-method-bufferfromarray

      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }


  useEffect(() => {
    onProduct(1)
    isBleEnable()
    handleAndroidPermissions()
    BleManager.start({ showAlert: false })
      .then(() => {
        // Success code
        console.log("Module initialized");
        bleManagerEmitter.addListener("BleManagerDiscoverPeripheral", (device) => {
          handleDiscoverDevice(device)
        });
        startScan()

      });
  }, [isBLE])




  const isBleEnable = () => {
    BleManager.checkState().then((state) => {
      if (state == 'on') {
        setIsBLE(true)
      }
      else {
        setIsBLE(false)
      }
    });
  }



  const handleCalib = () => {
    setData((prevData) => ({
      ...prevData,
      calib: value
    }));
  };

  const handleOldGas = () => {
    setData((prevData) => ({
      ...prevData,
      oldGasTank: value
    }));
    setPO((prePO) => ({
      ...prePO,
      oldGiveBackGas: (value - OldBottle).toFixed(1),
      oldGiveBackMoney: Math.ceil((value - OldBottle).toFixed(1) * Price)
    }));
  };

  const handleNewGas = () => {
    setData((prevData) => ({
      ...prevData,
      newGasTank: value
    }));
    setPO((prePO) => ({
      ...prePO,
      newPayGas: (value - dataNewEmptybottle - valve).toFixed(1),
      newPayMoney: Math.ceil((value - dataNewEmptybottle - valve).toFixed(1) * (newProduct.price / newProduct.netW))
    }));
  };





  const reScan = () => {
    BleManager.start({ showAlert: false })
      .then(() => {
        // Success code
        console.log("Module initialized");
        bleManagerEmitter.addListener("BleManagerDiscoverPeripheral", (device) => {
          handleDiscoverDevice(device)
        });
        startScan()

      });
  }




  const onProduct = async (ID) => {
    const url = 'http://14.225.205.26/BE/KDS/handleProduct.php';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    try {
      var Data = {
        shopID: ID,
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data)
      });
      const rep = await response.json();
      const new_productlist = await rep.map(function (item) {
        return item.name // chuyển đổi danh sách thông tin sản phẩm thanh danh sách tên sản phẩm
      });
      setProductListFix(new_productlist)
      setProductList(rep)
    } catch (error) {
      console.log(error);
    }
  }



  const BillModal = ({ isVisible, onClose, accountFirstname, accountLastname, date, address, mobile, PO, newProduct, productName, Price }) => {
    return (
      <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 5 }}>
          <View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 32, textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 6, color: 'black' }}>{accountFirstname} {accountLastname}</Text>
              <Text style={{ fontSize: 16, color: '#726E6E' }}>{date.getDate()}, {date.toLocaleString('en-US', { month: 'short' })}, {date.getFullYear()}</Text>
              <Text>Address: {address}</Text>
              <Text>Phone: {mobile}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <View>
                <Text style={styles.titleBill}>LPG(kg)</Text>
                <Text style={styles.content}>{PO.newPayGas}</Text>
                <Text style={styles.content}>{PO.oldGiveBackGas}</Text>
              </View>
              <View>
                <Text style={styles.titleBill}>Items</Text>
                <Text style={styles.content}>{newProduct.name}</Text>
                <Text style={styles.content}>{productName}</Text>
              </View>
              <View>
                <Text style={styles.titleBill}>Price</Text>
                <Text style={styles.content}>{Math.ceil(newProduct.price / newProduct.netW)}</Text>
                <Text style={styles.content}>{(Price)}</Text>
              </View>
              <View>
                <Text style={styles.titleBill}>Amount</Text>
                <Text style={styles.content}>{PO.newPayMoney}</Text>
                <Text style={styles.content}>{PO.oldGiveBackMoney * -1}</Text>
              </View>
            </View>
            <View style={{ height: 0.5, backgroundColor: 'black', width: '90%', alignSelf: 'center', marginVertical: 10 }} />
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={styles.titleBill}>Total</Text>
                <Text style={styles.content}>{PO.newPayMoney - PO.oldGiveBackMoney}</Text>
              </View>
              <View style={{ height: 0.5, backgroundColor: 'black', width: '90%', alignSelf: 'center', marginVertical: 10 }} />
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#5F9AD8',
              paddingVertical: 12,
              borderRadius: 8,
              width: '45%',
              alignItems: 'center',
              marginVertical: 10,
            }}
            onPress={() => {
              setIsModalVisible(false)
            }}>
            <Text style={{
              color: 'white'
            }}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#5F9AD8',
              paddingVertical: 12,
              borderRadius: 8,
              width: '45%',
              alignItems: 'center',
              marginVertical: 10,
            }}
            onPress={() => {
              addPO()
              disconnecToDevice(deviceSelected.mac)
            }}>
            <Text style={{
              color: 'white'
            }}>Confirm PO</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };



  const addPO = async () => {
    const url = 'http://14.225.205.26/BE/KDS/addPO.php';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    try {
      var Data = {
        serialNumber: serialNumber,
        amountPaid: PO.newPayMoney - PO.oldGiveBackMoney,
        productID: newProduct.productID,
        quantity: PO.newPayGas,
        total: PO.newPayMoney,
        oldQuantity: PO.oldGiveBackGas,
        oldProductID: productID,
        moneyRefund: PO.oldGiveBackMoney,
        shopID: shopID,
        valve:valve

      };
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data)
      });
      const rep = await response.json();
      console.log(rep);
      if (rep[0] == 'Success') {
        navigate('checkPO', {
          serialNumber: serialNumber,
          accountLastname: accountLastname,
          accountFirstname: accountFirstname,
          address: address,
          mobile: mobile,
          checkOutID: rep[1]
        })
      }
      else {
        alert(rep[0])
      }
    } catch (error) {
      console.log(error);
    }
  }




  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  
  return (
    <View >
      {
        isBLE ?
          undefined
          :
          <View>
            <Text style={{ textAlign: 'center' }}>Please click <Text>" Enable Bluetooth "</Text></Text>
            <Button title="Enable Bluetooth" onPress={enableBluetooth} />
          </View>

      }
      <Button title="Scan" onPress={() => {
        setIsConnected(false)
        console.log('đang scan');
      }} />






      {isConnected ?
        <ScrollView contentContainerStyle={{
          paddingBottom: 100,
          // flex:1
        }}>
          <View style={{
            paddingHorizontal: 10,
            paddingVertical: 10
          }}>
            <View style={{ marginVertical: 10, }}>
              {/* <RNSpeedometer value={value} size={300} labelWrapperStyle={{ height: 0, width: 0 }} /> */}
              {/* <Speedometer value={value} totalValue={100} showIndicator  showLabels /> */}
              <Text style={{ textAlign: 'center', fontSize: 100 }}>{value}</Text>
              <Text style={{ textAlign: 'center', fontSize: 60, color: 'black', fontWeight: '600' }}>Kg</Text>

              {/* 
              <Text style={{ textAlign: 'center', fontSize: 20 }}>gas mới : {PO.newPayGas} Kg</Text>
              <Text style={{ textAlign: 'center', fontSize: 20 }}>gas cũ : {PO.oldGiveBackGas} Kg</Text>
              <Text style={{ textAlign: 'center', fontSize: 20 }}>newProduct.grossW: {newProduct.grossW} Kg</Text>
              <Text style={{ textAlign: 'center', fontSize: 20 }}>newProduct.netW: {newProduct.netW} Kg</Text>
              <Text style={{ textAlign: 'center', fontSize: 20 }}>newProduct.price: {Math.ceil((newProduct.price/ newProduct.netW))} Kg</Text>
              <Text style={{ textAlign: 'center', fontSize: 20 }}>old .price: {Price} Kg</Text>
              <Text style={{ textAlign: 'center', fontSize: 20 }}>new .price: {PO.newPayMoney} Kg</Text> */}

            </View>
            <View style={{
              // marginVertical: 20,
              // backgroundColor:'blue'
            }}>
              <View style={styles.confirmView}>
                <Text style={styles.title}>Standard : {data.calib}</Text>
                <TouchableOpacity
                  onPress={() => {
                    handleCalib()
                  }}
                  style={styles.buttonConfirm}>
                  <Text style={styles.titleButtonConfirm}>OK</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.confirmView}>
                <Text style={styles.title}>Old Bottle : {data.oldGasTank}</Text>
                <TouchableOpacity
                  onPress={() => {
                    handleOldGas()
                  }}
                  style={styles.buttonConfirm}>
                  <Text style={styles.titleButtonConfirm}>OK</Text>
                </TouchableOpacity>

              </View>
              <View style={{
                // backgroundColor:'red',
                paddingVertical: 5
              }}>
                <SelectDropdown
                  data={productListFix}
                  // defaultValueByIndex={0}
                  // defaultValue={'Egypt'}
                  onSelect={(selectedItem, index) => {
                    setPO((prePO) => ({
                      ...prePO,
                      newPayGas: 0,
                      newPayMoney: 0
                    }));
                    for (i = 0; i < productList.length; i++) {
                      if (productList[i].name == selectedItem)
                        setNewProduct(productList[i])
                          // console.log(productList[i]);
                          ;
                    }
                  }}
                  search
                  defaultButtonText={'Select New Product'}

                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={styles.dropdownCountry}
                  buttonTextStyle={styles.dropdownCountryTxt}
                  renderDropdownIcon={isOpened => {
                    return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdownDropdownStyle}
                  rowStyle={styles.dropdownCountryRowStyle}
                  rowTextStyle={styles.dropdownCountryRowTxtStyle}
                />



              </View>
              <View style={styles.confirmView}>
                <Text style={styles.title} >New Bottle : {data.newGasTank}</Text>
                <TouchableOpacity
                  onPress={() => {
                    handleNewGas()
                  }}
                  style={styles.buttonConfirm}>
                  <Text style={styles.titleButtonConfirm}>OK</Text>
                </TouchableOpacity>
              </View>
              <View style={{
                flexDirection:'row',
                justifyContent:'space-around'
              }}>
                <TextInput
                  style={{
                    width: '48%',
                    borderRadius: 10,
                    backgroundColor: 'white',
                    textAlign: 'center',
                    height: 45,
                    fontSize: 15,
                    // alignSelf: 'center',
                  }}
                  onChangeText={(newWeight) => {
                    setDataNewEmptybottle(Number(newWeight))
                  }}
                  keyboardType='number-pad'
                  placeholder='Enter Gas Tank'
                  placeholderTextColor='#949DA5'
                />
                <TextInput
                 style={{
                  width: '48%',
                  borderRadius: 10,
                  backgroundColor: 'white',
                  textAlign: 'center',
                  height: 45,
                  fontSize: 15,
                  // alignSelf: 'center',
                }}
                onChangeText={(valve) => {
                  setValve(Number(valve))
                }}
                placeholder='Enter Valve'
                placeholderTextColor='#949DA5'
                keyboardType='number-pad'
                />
              </View>

            </View>
            <View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true)
                disconnecToDevice(deviceSelected)
              }}
              disabled={isValidationOK() == false}
              style={{
                backgroundColor: '#5F9AD8',
                backgroundColor: isValidationOK() == true
                  ? '#5F9AD8' : '#b3b3b3',
                paddingVertical: 12,
                borderRadius: 10,
                width: '70%',
                alignItems: 'center',
                marginVertical: 10,
                alignSelf: "center"
              }}>
              <Text style={styles.titleButtonConfirm}>Preview PO</Text>
            </TouchableOpacity>
            <BillModal
              isVisible={isModalVisible}
              onClose={() => {
                setIsModalVisible(!isModalVisible)
              }}
              accountFirstname={accountFirstname}
              accountLastname={accountLastname}
              date={date}
              address={address}
              mobile={mobile}
              PO={PO}
              newProduct={newProduct}
              productName={productName}
              Price={Price}
            />

          </View>
        </ScrollView>
        :
        <FlatList
          contentContainerStyle={{ paddingBottom: 70 }}
          data={devices}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.mac}
          refreshing={refreshing}
          onRefresh={() => {
            reScan()
          }}
        />

      }
    </View>
  )
}

export default CreatePo

const styles = StyleSheet.create({
  buttonConfirm: {
    backgroundColor: '#5F9AD8',
    paddingVertical: 12,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
    marginVertical: 10,
  },
  titleButtonConfirm: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  },
  confirmView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    // backgroundColor:'red'
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1E21',
    // alignSelf: 'center'
  },

  dropdownCountry: {
    width: '98%',
    height: 45,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10
  },
  dropdownCountryTxt: { color: '#444', textAlign: 'center', fontSize: 15 },
  dropdownDropdownStyle: { backgroundColor: 'white', borderRadius: 10 },
  dropdownCountryRowStyle: { borderBottomColor: '#C5C5C5' },
  dropdownCountryRowTxtStyle: { color: '#444', textAlign: 'left' },
  titleBill: {
    fontSize: 18,
    color: '#156EE4'
  },
  content: {
    fontSize: 15,
    color: 'black'
  }



})