import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local
import api_url from '../../api_url';

import axios from "axios";


function DeliveryHistory({ navigation }) {
    console.disableYellowBox = true;
    //Xử lý nút trở lại
    const back = () => {
        navigation.navigate("THÔNG TIN CÁ NHÂN")
    }


    const [dataDeliveryHistory, setDataDeliveryHistory] = useState([])

    const get_data_delivery = async () => {
        const value_local = await AsyncStorage.getItem('already_login_driver');
        const dataLocal = JSON.parse(value_local)

        let data_driver = await axios.get(`${api_url}/v1/driver/view_detail_driver_with_username/${dataLocal.username}`)

        let fullname_driver = data_driver.data.fullname

        let data_delivery_driver = await axios.get(`${api_url}/v1/order/viewAllOrder`);

        let arr_delivery_driver = data_delivery_driver.data.map((item, index) => {
            if (
                item.status === "Đã hoàn thành" &&
                item.driver_name.includes(fullname_driver)
            ) {
                const ob = {
                    fromLocation: item.fromLocation,
                    toLocation: item.toLocation,
                    service_name: item.service_name,
                    date_start: item.date_start,
                    date_end: item.date_end,
                };

                return ob;
            }
        });


        setDataDeliveryHistory(arr_delivery_driver)

    }

    useEffect(() => {
        get_data_delivery()
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
                        <Text style={{ fontSize: 20 }}>Lịch sử vận chuyển</Text>
                        <View></View>
                    </View>
                </View>
                <View>
                    <View>
                        {dataDeliveryHistory && dataDeliveryHistory.map((item, index) => {
                            if (item !== undefined) {
                                return (
                                    <>
                                        <View
                                            key={item.date_start}
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
                                            <Ionicons
                                                onPress={() => back()}
                                                name="car-sharp"
                                                size={25}
                                                color="orange"
                                            />
                                            <View>
                                                <Text style={{ color: "red", fontWeight: "bold" }}>
                                                    1. {item?.fromLocation}
                                                </Text>
                                                <Ionicons
                                                    onPress={() => back()}
                                                    name="arrow-down-sharp"
                                                    size={25}
                                                    color="orange"
                                                    style={{ textAlign: "center" }}
                                                />
                                                <Text style={{ color: "green", fontWeight: "bold" }}>
                                                    2. {item?.toLocation}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text>
                                                    <Ionicons
                                                        onPress={() => back()}
                                                        name="timer-sharp"
                                                        size={25}
                                                        color="orange"
                                                        style={{ textAlign: "center" }}
                                                    /> {item?.date_start} - {item?.date_end}
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

export default DeliveryHistory