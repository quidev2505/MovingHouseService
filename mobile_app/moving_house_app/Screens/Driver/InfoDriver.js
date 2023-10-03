import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native"
import { Icon } from "@rneui/base";
import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local
import api_url from "../../api_url";
import axios from "axios";
import { AirbnbRating } from '@rneui/themed';

import { Avatar } from '@rneui/themed';

import { Ionicons } from '@expo/vector-icons';

function InfoDriver({ navigation }) {
  const [dataDriver, setDataDriver] = useState({})

  //Lấy thông tin tài xế
  const get_info_driver = async () => {

    try {
      const value_local = await AsyncStorage.getItem('already_login_driver');
      const dataLocal = JSON.parse(value_local)
      if (dataLocal) {
        const username = dataLocal.username


        if (username) {
          await axios.get(`${api_url}/v1/driver/view_detail_driver_with_username/${username}`).then((data) => {
            const data_driver = data.data;

            const ob = {
              username: username,
              avatar: `${api_url}/${data_driver.avatar}`,
              fullname: data_driver.fullname,
              address: data_driver.address,
              gender: data_driver.gender,
              phonenumber: data_driver.phonenumber,
              email: data_driver.email,
              vehicle_type: data_driver.vehicle_type,
              location_delivery: data_driver.location_delivery,
              start_average: data_driver.start_average == null ? 0 : data_driver.start_average,
              profile_code: data_driver.profile_code,
              username: data_driver.username,
              citizen_id: data_driver.citizen_id,
              date_of_birth: data_driver.date_of_birth,
              id_rating: data_driver.id_rating,
              id_delivery: data_driver.id_delivery
            }

            setDataDriver(ob);
          }).catch((e) => {
            console.log(e)
          })
        }
      }





    } catch (e) {
      // error reading value
      console.log(e)
    }
  }

  useEffect(() => {
    get_info_driver();
  }, [])


  const createTwoButtonAlert = () =>
    Alert.alert('Thông báo', 'Bạn muốn đăng xuất khỏi tài khoản ?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      { text: 'Xác nhận', onPress: () => log_out_local() },
    ]);


  const log_out_local = async () => {
    try {
      await AsyncStorage.removeItem('already_login_driver')
      navigation.navigate("DriverLogin")
    } catch (e) {
      // remove error
      console.log(e)
    }

    console.log('Done.')
  }

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "white" }}>
        <View style={{ marginTop: 20 }}>
          <Avatar
            size={100}
            rounded
            source={{ uri: `${dataDriver.avatar}` }}
          />
        </View>
        <Text style={{ color: "orange", fontSize: 25, marginTop: 12, fontWeight: "bold" }}>{dataDriver.fullname}</Text>
        <AirbnbRating style={{ marginTop: -10 }} isDisabled={true} count={5} defaultRating={dataDriver.start_average} size={30} reviews={[
          'Rất Tệ',
          'Tệ',
          'Bình thường',
          'Hoàn hảo',
          'Xuất sắc',
        ]} />


        <View style={{ marginTop: 20, width: "100%", padding: 10 }}>
          <Text style={{ backgroundColor: "orange", padding: 5, borderRadius: 5, color: "white", fontSize: 19 }}>Thông tin hồ sơ</Text>

          <View style={{ display: "flex", flexDirection: "row", marginTop: 15, marginLeft: 5, marginRight: 5, justifyContent: "space-between" }}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Ionicons
                name="key-sharp"
                size={20}
              />
              <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataDriver.profile_code}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Ionicons
                name="call-sharp"
                size={20}
              />
              <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataDriver.phonenumber}</Text>
            </View>
          </View>


          <View style={{ display: "flex", flexDirection: "row", marginTop: 15, marginLeft: 5, marginRight: 5, justifyContent: "space-between" }}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Ionicons
                name="transgender"
                size={20}
              />
              <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataDriver.gender}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Ionicons
                name="mail"
                size={20}
              />
              <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataDriver.email}</Text>
            </View>
          </View>


          <View style={{ display: "flex", flexDirection: "row", marginTop: 15, marginLeft: 5 }}>
            <Ionicons
              name="car"
              size={20}
            />
            <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataDriver.vehicle_type}</Text>
          </View>

          <View style={{ display: "flex", flexDirection: "row", marginTop: 15, marginLeft: 5 }}>
            <Ionicons
              name="location"
              size={20}
            />
            <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataDriver.location_delivery}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", marginTop: 15, marginLeft: 5 }}>
            <Ionicons
              name="home"
              size={20}
            />
            <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataDriver.address}</Text>
          </View>

          <Text style={{ backgroundColor: "orange", padding: 5, borderRadius: 5, color: "white", fontSize: 19, marginTop: 10 }}>Thông tin tài khoản</Text>
          <View style={{ display: "flex", flexDirection: "row", marginTop: 17, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, padding: 5 }}>
            <Ionicons
              name="person-circle-outline"
              size={25}
            />
            <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataDriver.username}</Text>
          </View>
        </View>


        <TouchableOpacity style={styles.button1} onPress={createTwoButtonAlert}>
          <Text style={styles.buttonText}>Lịch sử vận chuyển

          </Text>

        </TouchableOpacity>

        <TouchableOpacity style={styles.button1} onPress={createTwoButtonAlert}>
          <Text style={styles.buttonText}>Lịch sử đánh giá

          </Text>

        </TouchableOpacity>


        {/* Đăng xuất */}
        <TouchableOpacity style={styles.button} onPress={createTwoButtonAlert}>
          <Text style={styles.buttonText}>Đăng Xuất
            &nbsp;
            <Ionicons
              name="log-out-outline"
              size={35}
              style={{ marginLeft: 10 }}
            />
          </Text>

        </TouchableOpacity>
      </View>
    </ScrollView>


  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'orange',
    borderRadius: 10,
    padding: 10,
    height: "fit-content",
    width: 350,
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30
  },
  button1: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
    height: "fit-content",
    width: 350,
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  button2: {
    backgroundColor: 'orange',
    borderRadius: 10,
    padding: 10,
    width: 325
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: "center"
  },
  rating: {
    paddingVertical: 10,
  },
});


export default InfoDriver