import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local
import api_url from '../../api_url';
import { AirbnbRating } from '@rneui/themed';

import axios from "axios";


function RatingHistory({ navigation }) {
  //Xử lý nút trở lại
  const back = () => {
    navigation.navigate("THÔNG TIN CÁ NHÂN")
  }


  const [dataRatingHistory, setDataRatingHistory] = useState([])

  const get_data_rating = async () => {
    const value_local = await AsyncStorage.getItem('already_login_driver');
    const dataLocal = JSON.parse(value_local)

    let data_driver = await axios.get(`${api_url}/v1/driver/view_detail_driver_with_username/${dataLocal.username}`)

    let fullname_driver = data_driver.data.fullname

    let data_rating_driver = await axios.get(
      `${api_url}/v1/ratingDriver/get_rating_driver/${fullname_driver}`
    );

    let arr_rating_driver = data_rating_driver.data.map((item, index) => {
      const ob = {
        star: item.star,
        comment: item.comment,
        customer_name: item.customer_name,
        rating_date: item.rating_date,
      };
      return ob;
    });


    setDataRatingHistory(arr_rating_driver)

  }

  useEffect(() => {
    get_data_rating()
  }, [])
  return (
    <ScrollView>
      <View>
        <View>
          <View style={{ display: "flex", flexDirection: "row", height: 90, backgroundColor: "white", justifyContent: "space-between", padding: 10, paddingTop: 50 }}>
            <Ionicons
              onPress={() => back()}
              name="arrow-back-sharp"
              size={25}
              color="orange"
            />
            <Text style={{ fontSize: 20 }}>Lịch sử đánh giá</Text>
            <View></View>
          </View>
        </View>
        <View>
          <View>
            {dataRatingHistory && dataRatingHistory.map((item, index) => {
              if (item !== undefined) {
                return (
                  <>
                    <View
                      key={item.customer_name}
                      style={{
                        justifyContent: "space-between",
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 7,
                        borderRadius: 5,
                        margin: 5,
                        backgroundColor: "white",
                        display: "flex",
                        alignItems: "center"
                      }}>
                      <AirbnbRating style={{ marginTop: -10 }} isDisabled={true} count={5} defaultRating={item.star} size={30} reviews={[
                        'Rất Tệ',
                        'Tệ',
                        'Bình thường',
                        'Hoàn hảo',
                        'Xuất sắc',
                      ]} />

                      <View style={{marginTop:20}}>
                        <Text style={{ fontWeight: "bold" }}>
                          {item.comment} -
                          <Text style={{ color: "black" }}>
                            (Khách hàng đánh giá :
                            {item.customer_name}
                            )
                          </Text>

                        </Text>

                        <Text style={{ color: "#ccc", fontWeight: "bold", textAlign:"center" }}>
                          {item.rating_date}
                        </Text>
                      </View>
                    </View>
                  </>
                )
              }
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default RatingHistory