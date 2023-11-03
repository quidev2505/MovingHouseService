import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import api_url from '../../../api_url';
import axios from 'axios';

import Timeline from 'react-native-timeline-flatlist'

function ViewProcessOrder({ route, navigation }) {

    const [dataTimeLine, setDataTimeLine] = useState([])
    const back = () => {
        navigation.navigate("OrderDetailDriver")
    }



    useEffect(() => {
        const { data_user, data_order } = route.params;
        setInterval(()=>{

            getDataTimeLine(data_order)
        }, 5000)
    }, [])

    const getDataTimeLine = async (data_order) => {
        console.log('Chay roi')
        const order_id = data_order.order_id;

        let call_api_order = await axios.get(`${api_url}/v1/order/viewOrderWithOrderId/${order_id}`)


        const statusOrder = call_api_order.data.status;


        const ob = {
            time: '',
            title: '',
            description: ''
        }

        switch (statusOrder) {
            case 'Đã tới điểm nhận hàng':
                {
                    ob.time = data_order.date_start
                    ob.title = statusOrder
                    ob.description = 'Bước 1'
                    break;
                }
            case 'Hoàn thành dở hàng':
                {
                    ob.time = data_order.date_start
                    ob.title = statusOrder
                    ob.description = 'Bước 2'
                    break;

                }
            default:
                break;
        }


        dataTimeLine.push(ob)
        setDataTimeLine(dataTimeLine)



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
                            color="orange"
                        />
                        <Text style={{ fontSize: 20 }}>Theo dõi trạng thái đơn hàng</Text>
                        <Text></Text>
                    </View>
                </View>
            </View>
            <View style={{ marginLeft: 80, marginTop: 90 }}>
                <Timeline
                    data={dataTimeLine}
                    circleSize={20}
                    circleColor='rgb(45,156,219)'
                    lineColor='rgb(45,156,219)'
                    timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
                    timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13 }}
                    descriptionStyle={{ color: 'gray' }}
                    options={{
                        style: { paddingTop: 5 }
                    }}
                    isUsingFlatlist={true}
                    innerCircle={'dot'}
                />
            </View>
        </ScrollView>
    )
}

export default ViewProcessOrder