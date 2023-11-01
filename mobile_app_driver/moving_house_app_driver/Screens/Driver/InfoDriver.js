import React, { useEffect, useState, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, RefreshControl, KeyboardAvoidingView } from "react-native"
import { Icon } from "@rneui/base";
import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local
import api_url from "../../api_url";
import axios from "axios";
import { AirbnbRating } from '@rneui/themed';

import { Avatar } from '@rneui/themed';

import { Ionicons } from '@expo/vector-icons';


import DatalistInput from '@avul/react-native-datalist-input';

function InfoDriver({ navigation }) {
  console.disableYellowBox = true;

  const [check_show_dropdown, setCheckShowDropDown] = useState(false)

  const [dataDriver, setDataDriver] = useState({})


  const [valueList, setValueList] = useState(''); //Giá trị datalistinput
  const [dataList, setDataList] = useState([])


  //Hiển thị ra dữ liệu
  const update_data_list = async () => {
    await axios
      .get(`https://geocode.maps.co/search?q=${valueList}&format=json`)
      .then((data) => {
        let result = data.data;
        if (result) {
          let arr_result = result.map((item, index) => {
            return item.display_name
          });

          setDataList(arr_result)
        }
      }).catch((e) => {
        console.log(e)
      })

  }


  useEffect(() => {
    update_data_list()
  }, [valueList])

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
              star_average: data_driver.star_average == null ? 0 : data_driver.star_average,
              profile_code: data_driver.profile_code,
              username: data_driver.username,
              citizen_id: data_driver.citizen_id,
              date_of_birth: data_driver.date_of_birth,
              id_rating: data_driver.id_rating,
              id_delivery: data_driver.id_delivery,
              license_plate: data_driver.license_plate,
              status: data_driver.status,
              current_position: data_driver.current_position
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

  //Thay đổi trạng thái tài xế
  const changeStatusDriver = async (status, fullname) => {
    await axios.patch(`${api_url}/v1/driver/updateonefield_driver_withname/${fullname}`, { status: status === "Sẵn sàng" ? "Đang bận" : "Sẵn sàng" }).then((data) => {
      Alert.alert('Thông báo', 'Thay đổi trạng thái tài xế thành công !', [
        { text: 'Xác nhận' },
      ]);

      get_info_driver()
    }).catch((e) => {
      console.log(e)
    })
  }

  //Chuyển qua lịch sử vận chuyển
  const navigate_to_deliveryHistory = () => {
    navigation.navigate("DeliveryHistory")
  }

  //Chuyển qua lịch sử đánh giá
  const navigate_to_ratingHistory = () => {
    navigation.navigate("RatingHistory")
  }



  //Load page khi kéo xuống
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    get_info_driver();
    setRefreshing(false);

  }, []);


  //Cập nhật lại vị trí hiện tại của tài xế
  const update_current_position = async (fullname) => {
    await axios.patch(`${api_url}/v1/driver/updateonefield_driver_withname/${fullname}`, { current_position: valueList }).then((data) => {
      Alert.alert('Thông báo', 'Thay đổi vị trí hiện tại thành công !', [
        { text: 'Xác nhận' },
      ]);

      get_info_driver()
    }).catch((e) => {
      console.log(e)
    })
  }

  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "white" }}>
        <View style={{ marginTop: 20 }}>
          <Avatar
            size={100}
            rounded
            source={{ uri: `${dataDriver.avatar}` }}
          />
        </View>
        <Text style={{ color: "orange", fontSize: 25, marginTop: 12, fontWeight: "bold" }}>{dataDriver.fullname}</Text>
        <AirbnbRating style={{ marginTop: -10 }} isDisabled={true} count={5} defaultRating={dataDriver.star_average} size={30} reviews={[
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
              name="card"
              size={20}
            />
            <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataDriver.license_plate}</Text>
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

          <View style={{ display: "flex", flexDirection: "column", marginTop: 17, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, padding: 5 }}>
            <View>
              <Text style={{ color: "black", fontSize: 17, fontWeight: "bold", marginBottom: 5 }}>Trạng thái:     </Text>

            </View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Ionicons
                  name="radio-button-on-sharp"
                  size={25}
                  color={dataDriver.status === "Sẵn sàng" ? "green" : "red"}
                />
                <Text style={{ marginRight: 10, marginLeft: 10, fontSize: 17, color: dataDriver.status === "Sẵn sàng" ? "green" : "red" }}>{dataDriver.status}</Text>
              </View>


              <TouchableOpacity onPress={() => changeStatusDriver(dataDriver.status, dataDriver.fullname)}>

                <Ionicons
                  name="sync-circle-sharp"
                  size={25}
                  color={dataDriver.status === "Sẵn sàng" ? "green" : "red"}
                />
              </TouchableOpacity>
            </View>

          </View>

          {/* Vị trí hiện tại */}
          <View style={{ display: "flex", flexDirection: "column", marginTop: 17, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, padding: 5 }}>
            <View>
              <Text style={{ color: "black", fontSize: 17, fontWeight: "bold", marginBottom: 5 }}>Vị trí hiện tại:     </Text>

            </View>
            <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Ionicons
                  name="radio-button-on-sharp"
                  size={25}
                  color="purple"
                />
                <Text style={{ marginRight: 10, marginLeft: 10, fontSize: 17, color: "purple" }}>{dataDriver.current_position}</Text>

              </View>

              <TouchableOpacity onPress={() => setCheckShowDropDown((e) => !e)}>

                <Text style={{ backgroundColor: "purple", width: 100, textAlign: "center", borderRadius: 5, padding: 5, color: "white", marginTop: 20 }}>{check_show_dropdown ? 'Ẩn' : 'Hiển thị'}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20, display: check_show_dropdown ? 'flex' : 'none' }}>
              <View style={styles.screen}>
                <Text style={styles.titleStyle}>THAY ĐỔI VỊ TRÍ</Text>
                <KeyboardAvoidingView behavior="padding" style={styles.container}>
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <DatalistInput
                      containerStyle={styles.containerStyle}
                      value={valueList}
                      onChangeText={text => setValueList(text)}
                      data={dataList}
                      style={styles.inputStyle}
                      placeholder="Nhập vào vị trí muốn chuyển đổi..."
                      placeholderTextColor="#cdcdcd"
                    />
                    <TouchableOpacity onPressIn={() => { update_current_position(dataDriver.fullname) }} style={{ marginTop: -25, marginLeft: 10 }}>

                      <Ionicons
                        name="cloud-upload-outline"
                        size={35}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>

                </KeyboardAvoidingView>
              </View>
            </View>

          </View>

        </View>


        <TouchableOpacity style={styles.vanchuyen} onPress={navigate_to_deliveryHistory}>
          <Text style={styles.buttonText}>Lịch sử vận chuyển
          </Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.button1} onPress={navigate_to_ratingHistory}>
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
    marginBottom: 30,
    zIndex: -1
  },
  button1: {
    backgroundColor: '#eb4d4b',
    borderRadius: 10,
    padding: 10,
    height: "fit-content",
    width: 350,
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1
  },
  vanchuyen: {
    backgroundColor: '#22a6b3',
    borderRadius: 10,
    padding: 10,
    height: "fit-content",
    width: 350,
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1
  },
  button2: {
    backgroundColor: 'orange',
    borderRadius: 10,
    padding: 10,
    width: 325,
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
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'grey',
    justifyContent: 'center',
  },
  containerStyle: {
    width: '80%',
    color: "white",
    minHeight: 100,
  },
  inputStyle: {
    color: 'white',
    marginTop: 10,
    padding: 5,
  },
  titleStyle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 15,
    marginTop: 10
  },
});


export default InfoDriver