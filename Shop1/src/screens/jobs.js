import { StyleSheet, Text, View, Button, FlatList, Alert, TouchableOpacity,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import UIHeader from '../components/UIHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';







const Job = (props) => {
  const { navigation, route } = props;
  // //functions of navigate to/back
  const { navigate, goBack } = navigation;
  const [deviceList, setDeviceList] = useState([])
  const [shopID, setShopID] = useState(0)




  const handleListOutGas = async(ID)=>{
    const url = 'http://14.225.205.26/BE/KDS/handleListOutGasShop.php';
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
      // console.log(rep);
        if(rep != "No Device"){
          setDeviceList(rep)
          // console.log(rep);
        }
        
    } catch (error) {
      console.log(error);
    }
  }



  useFocusEffect(
    React.useCallback(() => {
      const getAsyncstorage = async () => {
        try {
          console.log('run Job');
          const shopID = await AsyncStorage.getItem('shopID');
          setShopID(shopID)
          await handleListOutGas(1);
        } catch (error) {
          console.log(error);
        }
      };
      getAsyncstorage();
    }, [])
  );

  return (
    <View style={{
      flex:1,
      paddingHorizontal:10
    }}>
         <UIHeader
        title={''}
        // rightIconName='sign-out-alt'
        // onPressRightIcon={() => {
        //   AsyncStorage.clear()
        //   navigate('signin')
        // }
        // }
      />
      <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: "#343A76",
          }}>Job List</Text>
      <View style={{
        flex: 1,
        // backgroundColor:'red'
      }}>
        {
          deviceList.length > 0 ? 
          <FlatList
          data={deviceList}
          style={{
            // backgroundColor:'red'
          }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.btnFlatlist}
            onPress={()=>{
              navigate('createPO',{
                serialNumber:item.serialNumber,
                productID: item.productID,
                productName: item.name,
                netW: item.netW,
                price:item.price,
                accountLastname: item.lastname,
                accountFirstname: item.firstname,
                address: item.address,
                mobile : item.phone,
                shopID:shopID,
                oldBottle:item.oldBottle,
                weightValve:item.weightValve,
              })
              // console.log(item)
            }}
            >
              <View style={{
                flex: 1,
                alignItems: 'center',
                // backgroundColor:'red',
                paddingVertical:3
              }}>
          
                <Text style={{
                    color: '#4980F6',
                    fontWeight: '600',
                    fontSize: 16
                  }}>{item.firstname} {item.lastname}
                  </Text>
                <View style={{
                  flex: 1,
                  width:'90%',
                  flexDirection:'row',
                  justifyContent:'center'
                }}>
                  <View style={{
                    // backgroundColor:'blue',
                    width:'35%',
                    // alignItems:'flex-end',
                    justifyContent:'space-around'
                  }}>
                    <Text style={{color:'black'}}>Serial no: </Text>
                    <Text  style={{color:'black'}}>Phone: </Text>
                    <Text  style={{color:'black'}}>Address: </Text>
                    <Text  style={{color:'black'}}>Remaining gas: </Text>
                    <Text  style={{color:'black'}}>Product Gas: </Text>

                  </View>
                  <View style={{
                    width:'60%',
                    // backgroundColor:'yellow', 
                    justifyContent:'space-around'
                  }}>
                    <Text  style={{color:'black'}}>{item.serialNumber}</Text>
                    <Text  style={{color:'black'}}>{item.phone}</Text>
                    <Text  style={{color:'black'}}>{item.address}</Text>
                    <Text  style={{color:'black'}}>{item.gas}Kg ({item.perGas}%)</Text>
                    <Text  style={{color:'black'}}>{item.name}</Text>

                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
          }
          keyExtractor={item => item.serialNumber}
          numColumns={1}
        /> 
        :
        <Text style={{
          alignSelf:'center',
          fontSize:16
        }}>No devices</Text>
        }

      </View>

    </View>
  )}

export default Job

const styles = StyleSheet.create({
  btnFlatlist: {
    width: "90%",
    height: 140,
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



})