import React, { useState, useEffect } from 'react'
import { Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import api_url from '../../../api_url';
import axios from 'axios';

function OrderDetail({ route, navigation }) {
  const [navigate_ori, setNavigateOri] = useState("");

  const get_detail_order = async (id_input) => {
    // const data = await axios.get
    //   `${api_url}/v1/order/viewOrderDetail/${id_input}`

    // console.log(data);


  }

  useEffect(() => {
    /* 2. Get the param */
    const { status, data } = route.params;
    setNavigateOri(status)
    // get_detail_order(data)
  })

  const back = () => {
    navigation.navigate(navigate_ori)
  }


  return (
    <View>
      <View style={{ display: "flex", flexDirection: "row", height: 90, backgroundColor: "white", justifyContent: "space-between", padding: 10, paddingTop: 50 }}>
        <Ionicons
          onPress={() => back()}
          name="arrow-back-sharp"
          size={25}
          color="green"
        />
        <Text style={{ fontSize: 20 }}>Chi tiết đơn hàng</Text>
        <Text></Text>
      </View>
    </View>


  )
}

export default OrderDetail