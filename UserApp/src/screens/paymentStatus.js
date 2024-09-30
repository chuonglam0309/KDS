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
  Alert,
  ImageBackground
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
// import { colors } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UIHeader } from '..//components/index'
import { colors, icons, fontSizes } from "../constants";


function Payment(props) {
  //navigation
  const { navigation, route } = props;
  // //functions of navigate to/back
  const { navigate, goBack } = navigation;



  const [accountID, setAccountID] = useState(0)

  const [POlist, setPOlist] = useState([])


  const handlePO = async (ID) => {

    const url = 'http://14.225.192.41/BE/KDS/handleCheckOutForUser.php';

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
      setPOlist(rep[1])
      // console.log(rep[1]);

      // setIsDataLoaded(true); // Đánh dấu là dữ liệu đã được tải về thành công
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const getAsyncstorage = async () => {
        try {
          console.log('run');
          const accountID = await AsyncStorage.getItem('accountID');
          setAccountID(accountID)
          handlePO(accountID)
        } catch (error) {
          console.log(error);
        }
      };

      getAsyncstorage();
    },[])
  );








  return (
    <View style={{
      flex: 1,
    }}>
      <ImageBackground source={require('../../assets/images/imbg.png')} resizeMode="cover" style={{
        flex: 1,
      }}>
        <View style={{
          flex: 1.6,
          // backgroundColor:"red",
          justifyContent: 'flex-end',
          paddingHorizontal: 15
        }}>
          <Text style={{
            fontSize: 25,
            fontWeight: 'bold',
            color: '#003072'
          }}>Bills: </Text>
          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: '#003072'
          }}> <Text style={{
            fontSize: 35
          }}></Text>
          </Text>




        </View>
        <View style={{
          flex: 3,
          // backgroundColor:'yellow'
        }}>
          {POlist.length > 0 ?
               <FlatList
               data={POlist}
               style={{
                 // backgroundColor:'red'
               }}
               renderItem={({ item }) => (
                 <TouchableOpacity style={styles.btnFlatlist}>
                   <View style={{
                     flex: 1,
                    //  backgroundColor:'red'
                   }}
                   >
                     <Text style={{
                      alignSelf:'center',
                      color:'#003072',
                       fontSize:15,
                       fontWeight:'500'
                    }}>{item.name}</Text>
                    <Text style={{
                      alignSelf:'center',
                      color:'#8291A8',
                      fontSize:11,
                    }}>{item.serialNumber}</Text>

                     <View style={{
                       flexDirection:'row',
                       justifyContent:'space-around',
                       paddingVertical:10,
                      
                     }}>
                     <Text style={{
                       color:'#003072',
                       fontSize:15,
                       fontWeight:'700'
                     }}>{item.newPname}</Text>
                     <Text style={{
                       color:'#7B8BA2',
                       fontWeight:'bold'
                     }}>{POlist.length > 0 ? item.createdOnUTC.substring(0,item.createdOnUTC.indexOf(' ')): undefined}</Text>
   
                     </View>
                  
                     {
                       item.paidOnUTC != null ? 
                       <View style={{
                         flexDirection:'row',
                         justifyContent:'space-around',
                         paddingVertical:10,
                        
                       }}>
                       <Text style={{
                         color:'#0097FB',
                         fontSize:17,
                         fontWeight:'600'
                       }}>$: {item.amountPaid}</Text>
                       <Text style={{
                         color:'#00A280',
                         fontSize:15,
                       }}>Paid {POlist.length > 0 ? item.paidOnUTC.substring(0, item.paidOnUTC.indexOf(' ')) : undefined}</Text>
   
                       </View>
                       :
                       <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                         paddingVertical:10,
                         paddingHorizontal: 50
                       }}>
                       <Text style={{
                         color:'#0097FB',
                         fontSize:17,
                         fontWeight:'600'
                       }}>$: {item.amountPaid}</Text>
                      <Text style={{
                         color:'red',
                         fontSize:15,
                       }}>
                        Unpaid
                      </Text>
                       </View>
                     }
                   </View>
                 </TouchableOpacity>
               )
               }
               keyExtractor={item => item.checkOutDetailID}
               numColumns={1}
             />
             : 
             <Text  style={{
              color:'#0097FB',
              fontSize:17,
              fontWeight:'600',
              paddingHorizontal:15
            }}>Oops , bill not found</Text>

          }
       

        </View>

      </ImageBackground>
    </View>


  );
}
export default Payment
const styles = StyleSheet.create({
  btnFlatlist: {
    width: "90%",
    height: 120,
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





});
