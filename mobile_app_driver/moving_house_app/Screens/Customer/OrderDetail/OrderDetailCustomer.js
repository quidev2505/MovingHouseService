import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import api_url from '../../../api_url';
import axios from 'axios';

import { Card } from '@rneui/themed';

function OrderDetail({ route, navigation }) {
  const [navigate_ori, setNavigateOri] = useState("");

  const [dataOrderDetail, setDataOrderDetail] = useState({});

  const get_detail_order = async (id_input) => {
    await axios.get(`${api_url}/v1/order/viewOrderDetail/${id_input}`).then((data) => {
      const data_customer = data.data[0];
      const ob_detail_order = {
        distance: data_customer.distance,//
        duration: data_customer.duration,//
        fromLocation_detail: data_customer.fromLocation_detail,//
        toLocation_detail: data_customer.toLocation_detail,//
        item_detail: data_customer.item_detail,//
        man_power_price: data_customer.man_power_price,//
        man_power_quantity: data_customer.man_power_quantity,//
        moving_fee: data_customer.moving_fee,//
        note_driver: data_customer.note_driver,//
        payment_method: data_customer.payment_method,//
        payment_status: data_customer.payment_status,//
        service_fee: data_customer.service_fee,//
        totalOrder: data_customer.totalOrder,//
        totalOrderNew: data_customer.totalOrderNew,
        vehicle_price: data_customer.vehicle_price,//
        more_fee_name: data_customer.more_fee_name,
        more_fee_price: data_customer.more_fee_price
      }

      setDataOrderDetail(ob_detail_order)
    }).catch((e) => {
      console.log(e)
    })



  }

  useEffect(() => {
    /* 2. Get the param */
    const { status, data } = route.params;
    get_detail_order(data)
    setNavigateOri(status)
  })

  const back = () => {
    navigation.navigate(navigate_ori)
  }


  return (
    <ScrollView>
      <View>
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

        <View>
          {/* Nội dung chi tiết đơn hàng */}
          <Card>
            <View>
              <Card.Title style={{ textAlign: "left" }}>
                <Text style={{ marginRight: 20 }}>
                  - Khoảng cách: {dataOrderDetail.distance}{"\n"}- Thời gian ước tính: {dataOrderDetail.duration}
                </Text>
              </Card.Title>
            </View>
            <View style={{ borderTopColor: "#ccc", borderTopWidth: 1, paddingTop: 10 }}>
              <View style={{ display: "flex", flexDirection: "row", marginTop: 5 }}>
                <Text>
                  <Ionicons
                    name="pin-sharp"
                    size={20}
                    color="green"
                  />
                </Text>
                <Text>
                  {dataOrderDetail.fromLocation_detail}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
                <Text>
                  <Ionicons
                    name="location-sharp"
                    size={20}
                    color="green"
                  />
                </Text>
                <Text>
                  {dataOrderDetail.fromLocation_detail}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View>
          {/* Nội dung chi tiết đơn hàng */}
          <Card>
            <View>
              <Card.Title style={{ textAlign: "left" }}>
                <Text style={{ marginRight: 20 }}>
                  Thông tin bổ sung
                </Text>
              </Card.Title>
            </View>


            <View style={{ borderTopColor: "#ccc", borderTopWidth: 1, paddingTop: 10, marginBottom: 5 }}>
              <View style={{ display: "flex", marginTop: 5 }}>
                <Text style={{ fontSize: 15, backgroundColor: "grey", color: "white", borderRadius: 5, padding: 3 }}>Chi tiết Hàng giao</Text>

                <Text style={{ fontSize: 17 }}>
                  {dataOrderDetail.item_detail?.map((item, index) => {
                    if (index === dataOrderDetail.item_detail.length - 1) {
                      return item
                    } else {
                      return item + ", "
                    }
                  })}
                </Text>
              </View>
            </View>

            <View style={{ borderTopColor: "#ccc", borderTopWidth: 1, paddingTop: 10, marginBottom: 5 }}>
              <View style={{ display: "flex", marginTop: 5 }}>
                <Text style={{ fontSize: 15, backgroundColor: "grey", color: "white", borderRadius: 5, padding: 3 }}>Ghi chú cho tài xế</Text>

                <Text style={{ fontSize: 17 }}>
                  {dataOrderDetail.note_driver}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Thông tin thanh toán */}
        <View>
          {/* Nội dung chi tiết đơn hàng */}
          <Card>
            <View>
              <Card.Title style={{ textAlign: "left" }}>
                <Text style={{ marginRight: 20 }}>
                  Thông tin thanh toán
                </Text>
              </Card.Title>
            </View>


            <View style={{ borderTopColor: "#ccc", borderTopWidth: 1, paddingTop: 10, marginBottom: 5 }}>
              <View style={{ display: "flex", marginTop: 5 }}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text>Phương thức thanh toán: </Text>
                  <Text style={{ color: "green" }}>{dataOrderDetail.payment_method}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text>Trạng thái thanh toán: </Text>
                  <Text style={{ color: "green" }}>{dataOrderDetail.payment_status}</Text>
                </View>
              </View>

              <View style={{ borderTopColor: "#ccc", borderTopWidth: 1, paddingTop: 10, marginBottom: 5 }}>
                <View style={{ display: "flex", marginTop: 5 }}>
                  <Text style={{ fontSize: 15, backgroundColor: "grey", color: "white", borderRadius: 5, padding: 3 }}>Hóa đơn chi tiết</Text>

                  <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                    <Text>Giá thuê xe vận chuyển ({dataOrderDetail.distance}): </Text>
                    <Text style={{ fontWeight: "bold" }}>{dataOrderDetail.vehicle_price?.toLocaleString()} đ</Text>
                  </View>

                  <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                    <Text>Nhân công bốc vác (x{dataOrderDetail.man_power_quantity}): </Text>
                    <Text style={{ fontWeight: "bold" }}>{dataOrderDetail.man_power_price?.toLocaleString()} đ</Text>
                  </View>

                  {dataOrderDetail.service_fee?.map((item, index) => {
                    return (
                      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }} key={index}>
                        <Text>{item.name}: </Text>
                        <Text style={{ fontWeight: "bold" }}>{item.price?.toLocaleString()} đ</Text>
                      </View>
                    )
                  })}

                  {dataOrderDetail.moving_fee?.map((item, index) => {
                    return (
                      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }} key={index}>
                        <Text>{item.name}: </Text>
                        <Text style={{ fontWeight: "bold" }}>{item.price?.toLocaleString()} đ</Text>
                      </View>
                    )
                  })}
                  <View style={{ borderTopColor: "#ccc", borderTopWidth: 2 }}></View>

                  <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                    <Text>Tổng đơn hàng tạm tính: </Text>
                    <Text style={{ color: "green", fontWeight: "bold" }}>{dataOrderDetail.totalOrder?.toLocaleString()} đ</Text>
                  </View>

                  {dataOrderDetail.more_fee_name !== null ? (
                    <>
                      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                        <Text>Chi phí phát sinh: </Text>
                        <Text style={{ color: "green", fontWeight: "bold" }}></Text>
                      </View>


                      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                        <Text>{dataOrderDetail.more_fee_name}</Text>
                        <Text style={{ color: "green", fontWeight: "bold" }}>{dataOrderDetail.more_fee_price?.toLocaleString()} đ</Text>
                      </View>
                    </>
                  ) : ''}
                 

                  <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                    <Text>Tổng đơn hàng mới: </Text>
                    <Text style={{ color: "red", fontWeight: "bold", fontSize: 25 }}>{dataOrderDetail.totalOrderNew?.toLocaleString()} đ</Text>
                  </View>


                  <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                    <Text style={{ textAlign: "justify", fontStyle: "italic", marginTop: 10 }}><Text style={{ fontWeight: "bold" }}>Lưu ý: </Text>{"\n"}
                      Phí dịch vụ được dựa trên nhiều yếu tố như tình hình giao thông, kích thước hàng hóa, phí cầu đường, phí gửi xe, các phụ phí khác...Vì vậy tổng giá dịch vụ sẽ có thể thay đổi. Giá hiển thị tại thời điểm đặt đơn có thể không giữ nguyên nếu có thay đổi về chi tiết đơn hàng.</Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </View>


    </ScrollView>




  )
}

export default OrderDetail