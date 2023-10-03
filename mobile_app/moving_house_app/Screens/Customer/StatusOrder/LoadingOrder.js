import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local
import axios from 'axios';
import api_url from '../../../api_url';
import { Ionicons } from '@expo/vector-icons';

import { Card, Divider } from '@rneui/themed';

function LoadingOrder({ navigation }) {
    const [dataOrder, setDataOrder] = useState([])

    //Lấy thông tin khách hàng
    const get_info_order = async () => {
        try {
            const value_local = await AsyncStorage.getItem('already_login_customer');
            const dataLocal = JSON.parse(value_local)

            if (dataLocal) {
                const fullname = dataLocal.fullname;

                let id_customer = await axios.get(
                    `${api_url}/v1/customer/get_customer_with_fullname/${fullname}`
                );

                if (id_customer) {
                    await axios
                        .get(`${api_url}/v1/order/viewOrderWithCustomerId/${id_customer.data._id}`)
                        .then((data) => {
                            let dataOrder = data.data;
                            // Chỉ gồm 4 trạng thái:  
                            // 1.Đang tìm tài xế
                            // 2.Đang thực hiện
                            // 3. Xác nhận hóa đơn
                            // 4.Thanh toán hóa đơn
                            const data_order = [];
                            dataOrder &&
                                dataOrder.forEach((item, index) => {
                                    if (item.status !== "Đã hủy" && item.status !== "Đã hoàn thành") {
                                        const ob_order = {
                                            id_order_detail: item.order_detail_id,
                                            STT: index + 1,
                                            order_id: item.order_id,
                                            service_name: item.service_name,
                                            status: item.status,
                                            date_start: item.date_start,
                                            time_start: item.time_start,
                                            fromLocation: item.fromLocation,
                                            toLocation: item.toLocation,
                                            driver_name: item.driver_name,
                                            vehicle_name: item.vehicle_name,
                                            totalOrder: item.totalOrder,
                                            reason_cancel: item.reason_cancel,
                                            order_detail_id: item.order_detail_id
                                        };

                                        data_order.push(ob_order);
                                    }

                                });


                            setDataOrder(data_order)
                        })
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        get_info_order();
    }, [])


    const navigation_to_detailOrder = (order_detail_id) => {
        navigation.navigate('OrderDetailCustomer', { status: "Đang tải", data: order_detail_id })
    }


    return (
        <ScrollView>
            {dataOrder.length === 0 ? (
                <>
                    <Image
                        source={{ uri: 'https://media.istockphoto.com/id/861576608/vector/empty-shopping-bag-icon-online-business-vector-icon-template.jpg?s=612x612&w=0&k=20&c=I7MbHHcjhRH4Dy0NVpf4ZN4gn8FVDnwn99YdRW2x5k0=' }}
                        style={{ width: "100%", height: 200, objectFit: "contain", marginTop: 150, borderRadius: 999 }}
                        resizeMode="contain"
                    />
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 30, color: "green" }}>Hiện tại chưa có đơn hàng !</Text>
                </>


            ) :
                dataOrder && dataOrder.map((item, index) => {
                    return (
                        <>
                            <TouchableOpacity onPress={() => navigation_to_detailOrder(item.order_detail_id)} key={index}>
                                <Card key={index}>
                                    <View key={index}>
                                        <Card.Title style={{ textAlign: "left" }}>
                                            <Text style={{ marginRight: 20 }}>
                                                {item.date_start}, {item.time_start} -
                                            </Text>
                                            <Text style={{
                                                color: item.status === "Đang tìm tài xế" ? "blue" : item.status === "Đã hủy" ? "red" :
                                                    item.status === "Đang thực hiện" ? "brown" : item.status === "Xác nhận hóa đơn" ? "purple" : item.status === "Thanh toán hóa đơn" ?
                                                        "magenta" : "#87d068"
                                            }}>
                                                &nbsp;( {item.status})
                                            </Text>
                                        </Card.Title>
                                    </View>
                                    <View style={{ borderTopColor: "#ccc", borderTopWidth: 1, paddingTop: 10 }}>
                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                            <Text>
                                                <Ionicons
                                                    name="code-sharp"
                                                    size={20}
                                                    color="green"
                                                />
                                            </Text>
                                            <Text>
                                                &nbsp;{item.order_id}
                                            </Text>
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "row", marginTop: 5 }}>
                                            <Text>
                                                <Ionicons
                                                    name="pin-sharp"
                                                    size={20}
                                                    color="green"
                                                />
                                            </Text>
                                            <Text>
                                                {item.fromLocation}
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
                                                {item.fromLocation}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ borderTopColor: "#ccc", borderTopWidth: 1, paddingTop: 10 }}>
                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                            <Text>
                                                <Ionicons
                                                    name="car-sharp"
                                                    size={20}
                                                    color="green"
                                                />
                                            </Text>
                                            <Text>
                                                {item.driver_name.length === 0 ? <Text style={{ fontWeight: "bold" }}>&nbsp;(Chưa xác định)</Text> : item.driver_name.map((item, index) => {
                                                    return <Text key={item}> {index + 1}. {item} |</Text>
                                                })}
                                            </Text>
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
                                            <Text>
                                                <Ionicons
                                                    name="browsers-sharp"
                                                    size={20}
                                                    color="green"
                                                />
                                                &nbsp;
                                            </Text>
                                            <Text>
                                                {item.service_name}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ borderTopColor: "#ccc", borderTopWidth: 1, paddingTop: 10 }}>
                                        <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", backgroundColor: "green", padding: 5, borderRadius: 5 }}>
                                            <Text style={{ color: "white" }}>
                                                {item.vehicle_name}
                                            </Text>
                                            <Text style={{ color: "white", fontWeight: "bold" }}>
                                                {item.totalOrder.toLocaleString()} đ
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </TouchableOpacity>

                        </>
                    )
                })}
        </ScrollView>
    )
}

export default LoadingOrder