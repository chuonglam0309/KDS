import { StyleSheet, Text, View, Button, FlatList, Alert, TouchableOpacity,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import UIHeader from '../components/UIHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';







const Home = (props) => {
  const { navigation, route } = props;
  // //functions of navigate to/back
  const { navigate, goBack } = navigation;

  const [shopID, setShopID] = useState(1)
  const [deviceList, setDeviceList] = useState([])





  const onDeviceListOnShop = async(ID) => {
    const url = 'http://14.225.205.26/BE/KDS/homeShop.php';
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
        setDeviceList(rep)
    } catch (error) {
      console.log(error); 
    }
  }




  useFocusEffect(
    React.useCallback(() => {
      const getAsyncstorage = async () => {
        try {
          console.log('run');
          const shopID = await AsyncStorage.getItem('shopID');
          setShopID(shopID)
          await onDeviceListOnShop(1);
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
        rightIconName='sign-out-alt'
        onPressRightIcon={() => {
          AsyncStorage.clear()
          navigate('signin')
        }
        }
      />
      <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: "#343A76",
          }}>Customer List</Text>
      <View style={{
        flex: 1,
          // backgroundColor:'red'
      }}>
                <FlatList
          data={deviceList}
          style={{
            // backgroundColor:'red'
          }}
          renderItem={({ item }) => (
            <View style={styles.btnFlatlist}
            >
              <View style={{
                flex: 1,
                alignItems: 'center',
                // backgroundColor:'blue',
                paddingVertical:3
              }}>
                <View style={{
                  position: 'absolute',
                  right: 5,
                  top: 5
                }}>
                  {
                    item.status == 1 ?
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
                <Text style={{
                    color: '#4980F6',
                    fontWeight: '600',
                    fontSize: 16,
                    marginBottom:5

                  }}>{item.firstname} {item.lastname}
                  </Text>
                <View style={{
                  flex: 1,
                  width:'90%',
                  flexDirection:'row',
                  justifyContent:'center'
                }}>
                  <View style={{
                    // backgroundColor:'red',
                    width:'25%',
                    // alignItems:'flex-end',
                    // alignContent:'flex-end',
                    // alignItems:'flex-end'
                  }}>
                    <Text style={{
                      marginBottom:10
                    }}>Phone: </Text>
                    <Text>Address: </Text>
                  </View>
                  <View style={{
                    width:'75%',
                    // backgroundColor:'yellow', 
                  }}>
                    <Text style={{
                      marginBottom:10
                    }}>{item.phone}</Text>
                    <Text style={{
                      // flexWrap:'wrap-reverse'
                    }}>{item.address}</Text>
                  </View>
                </View>
              </View>
            </View>
          )
          }
          keyExtractor={item => item.phone}
          numColumns={1}
        />

      </View>

    </View>
  )}

export default Home

const styles = StyleSheet.create({
 
  btnFlatlist: {
    width: "90%",
    height: 100,
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