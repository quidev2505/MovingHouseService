import React, { useState, useEffect } from 'react'
import { View, Text, Button } from "react-native"
import { SafeAreaView } from "react-native";
import { WebView } from 'react-native-webview';
import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local


function MapLocation() {
  const [locationObject, setLocationObject] = useState({})
  //Lấy vị trí của tài xế
  const get_location_driver = async () => {
    try {
      const value_local = await AsyncStorage.getItem('already_login_driver');
      const dataLocal = JSON.parse(value_local)
      if (dataLocal) {
        const username = dataLocal.username
        if (username) {
          await axios.get(`${api_url}/v1/driver/view_detail_driver_with_username/${username}`).then(async (data) => {
            const data_driver = data.data;

            let addres_driver_current = data_driver.address;

            await axios
              .get(`https://geocode.maps.co/search?q=${addres_driver_current}&format=json`)
              .then((data) => {
                let result = data.data[0];
                if (result) {
                  const ob = {
                    display_name: result.display_name,
                    lat: result.lat,
                    lon: result.lon
                  };

                  console.log(ob)
                  setLocationObject(ob)
                }
              })
          }).catch((e) => {
            console.log(e)
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }



  useEffect(() => {
    get_location_driver()
  }, [])

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: `http://10.0.2.2:3000/showmap/${locationObject.lat-locationObject.lon-locationObject.display_name}` }}
        />
      </SafeAreaView>

    </>

  )
}

export default MapLocation