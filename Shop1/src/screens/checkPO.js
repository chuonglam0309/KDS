import { StyleSheet, Text, View, NativeModules, NativeEventEmitter, Platform, PermissionsAndroid, Button, FlatList, Alert, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'

import UIHeader from '../components/UIHeader';
import { LoadingModal } from "react-native-loading-modal";




const CheckPO = (props) => {
  const { navigation, route } = props;
  // //functions of navigate to/back
  const { navigate, goBack } = navigation;
  const { serialNumber, accountLastname, accountFirstname, address, mobile, checkOutID } = route.params
  const date = new Date() // get datetime current
  const [modalShow, setModalShow] = useState(false)

  const [PO, setPO] = useState({
    newName: '',
    newGas: 0,
    newMoney: 0,
    oldName: '',
    oldGas: 0,
    oldMoney: 0,
    status: 0,
    total: 0,
    shopID: 0,
  });








  useEffect(() => {
    onCheckOutDetail()
  }, [])

  const onCheckOutDetail = async () => {
    const url = 'http://14.225.205.26/BE/KDS/checkOutDetail.php';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    try {
      var Data = {
        checkOutID: checkOutID,
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data)
      });
      const rep = await response.json();
      setPO((prePO) => ({
        ...prePO,
        newName: rep[1].newPname,
        newGas: rep[1].quantity,
        newMoney: rep[1].total,
        oldName: rep[1].oldPname,
        oldGas: rep[1].oldQuantity,
        oldMoney: rep[1].moneyRefund,
        status: rep[1].status,
        total: rep[1].amountPaid,
        shopID: rep[1].shopID,
      }));
    } catch (error) {
      console.log(error);
    }
  }
  const payNow = async () => {
    const url = 'http://14.225.205.26/BE/KDS/paynow.php';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    try {
      var Data = {
        checkOutID: checkOutID,
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data)
      });
      const rep = await response.json();
      if (rep[0] == 'Success') {
        setModalShow(true)
        setTimeout(() => {
          onCheckOutDetail()
          setModalShow(false)
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{
      flex: 1
    }}>
      <UIHeader
        title={''}

      />
       <LoadingModal modalVisible={modalShow} ><Text > Loading..</Text></LoadingModal>

      <View style={{ flex: 1, }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 32, textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 6, color: 'black' }}>{accountFirstname} {accountLastname}</Text>
          <Text style={{ fontSize: 20, color: '#726E6E' }}>{date.getDate()}, {date.toLocaleString('en-US', { month: 'short' })}, {date.getFullYear()}</Text>
          <Text style={styles.content}>Address: {address}</Text>
          <Text style={styles.content}>Phone: {mobile}</Text>

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
          <View>
            <Text style={styles.titleBill}>LPG(kg)</Text>
            <Text style={styles.content}>{PO.newGas}</Text>
            <Text style={styles.content}>{PO.oldGas}</Text>
          </View>
          <View>
            <Text style={styles.titleBill}>Items</Text>
            <Text style={styles.content}>{PO.newName}</Text>
            <Text style={styles.content}>{PO.oldName}</Text>
          </View>
          {/* <View>
                <Text style={styles.titleBill}>Price</Text>
                <Text style={styles.content}></Text>
                <Text style={styles.content}></Text>
              </View> */}
          <View>
            <Text style={styles.titleBill}>Amount</Text>
            <Text style={styles.content}>{PO.newMoney}</Text>
            <Text style={styles.content}>{PO.oldMoney}</Text>
          </View>

        </View>

        <View>
          <View style={{ height: 1, backgroundColor: 'black', width: '80%', alignSelf: 'center', marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignSelf: 'center' }}>
            <Text style={{
              color: '#156EE4',
              fontSize: 20
            }}>Total</Text>
            <Text style={styles.content}>{PO.total}</Text>
          </View>

          <View style={{ height: 0.5, backgroundColor: 'black', width: '80%', alignSelf: 'center', marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignSelf: 'center', }}>
            <Text style={{
              color: '#156EE4',
              fontSize: 20,
            }}>Payment status</Text>
            {
              PO.status == 0 ?
                <Text style={{
                  color: '#ED1313',
                }}>unpaid</Text>
                :
                <Text style={{
                  color: '#368815',
                }}>paid</Text>
            }
            {/* <Text>{PO.status == 0 ? 'unpaid' : 'paid'}</Text> */}

          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignSelf: 'center', marginVertical: 10 }}>
            <Text style={{
              color: '#156EE4',
              width: '80%',
            }}>Pay by</Text>
            <Text>cash</Text>
          </View>
          {
            PO.status == 0 ? undefined :
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignSelf: 'center' }}>
                <Text style={{
                  color: '#156EE4',
                }}>Cashier</Text>
                <Text style={styles.content}>{PO.shopID}</Text>
              </View>
          }
        </View>
        {
          PO.status == 0 ?
          <TouchableOpacity
          onPress={() => {
            payNow()
          }}
          style={{
            backgroundColor: '#5F9AD8',
            paddingVertical: 10,
            width: '60%',
            alignSelf: 'center',
            alignItems: "center",
            borderRadius: 8,
            marginVertical: 20,
          }}>
          <Text style={{
            color: 'white',
            fontSize: 16,
          }}>Pay Now</Text>
        </TouchableOpacity>
        :     
        <TouchableOpacity
        onPress={() => {
          navigate('tab')
        }}
        style={{
          backgroundColor: '#5F9AD8',
          paddingVertical: 10,
          width: '60%',
          alignSelf: 'center',
          alignItems: "center",
          borderRadius: 8,
          marginVertical: 20,
        }}>
        <Text style={{
          color: 'white',
          fontSize: 16,
        }}>Back</Text>
      </TouchableOpacity>
        }


      </View>
    </View>
  )
}

export default CheckPO

const styles = StyleSheet.create({

  titleBill: {
    fontSize: 20,
    color: '#156EE4'
  },
  content: {
    fontSize: 15,
    color: 'black'
  }

})







// 