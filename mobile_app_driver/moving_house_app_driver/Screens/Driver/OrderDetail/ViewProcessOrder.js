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

        setInterval(() => {
            getDataTimeLine(data_order)
        }, 2500)

    }, [])

    const getDataTimeLine = async (data_order) => {
        const order_id = data_order.order_id;

        let call_api_order = await axios.get(`${api_url}/v1/order/viewOrderWithOrderId/${order_id}`)

        console.log(call_api_order)
        const statusOrder = call_api_order.data.status;

        //7 trạng thái
        switch (statusOrder) {
            case 'Đã đến điểm lấy hàng':
                setDataTimeLine([
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: statusOrder,
                        description: 'Bước 1'
                    }
                ])
                break;
            case 'Hoàn thành bốc hàng hóa':
                setDataTimeLine([
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đã đến điểm lấy hàng',
                        description: 'Bước 1'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: statusOrder,
                        description: 'Bước 2'
                    }
                ])
                break;
            case 'Vận chuyển hàng hóa':
                setDataTimeLine([
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đã đến điểm lấy hàng',
                        description: 'Bước 1'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Hoàn thành bốc hàng hóa',
                        description: 'Bước 2'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: statusOrder,
                        description: 'Bước 3'
                    }
                ])
                break;
            case 'Đã đến điểm nhận hàng':
                setDataTimeLine([
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đã đến điểm lấy hàng',
                        description: 'Bước 1'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Hoàn thành bốc hàng hóa',
                        description: 'Bước 2'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Vận chuyển hàng hóa',
                        description: 'Bước 3'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: statusOrder,
                        description: 'Bước 4'
                    }
                ])
                break;
            case 'Xác nhận trạng thái giao hàng':
                setDataTimeLine([
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đã đến điểm lấy hàng',
                        description: 'Bước 1'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Hoàn thành bốc hàng hóa',
                        description: 'Bước 2'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Vận chuyển hàng hóa',
                        description: 'Bước 3'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đã đến điểm nhận hàng',
                        description: 'Bước 4'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: statusOrder,
                        description: 'Bước 5'
                    }
                ])
                break;
            case 'Thanh toán hóa đơn':
                setDataTimeLine([
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đã đến điểm lấy hàng',
                        description: 'Bước 1'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Hoàn thành bốc hàng hóa',
                        description: 'Bước 2'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Vận chuyển hàng hóa',
                        description: 'Bước 3'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đã đến điểm nhận hàng',
                        description: 'Bước 4'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Xác nhận trạng thái giao hàng',
                        description: 'Bước 5'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: statusOrder,
                        description: 'Bước 6'
                    }
                ])
                break;
            case 'Đã hoàn thành':
                setDataTimeLine([
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đã đến điểm lấy hàng',
                        description: 'Bước 1'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Hoàn thành bốc hàng hóa',
                        description: 'Bước 2'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Vận chuyển hàng hóa',
                        description: 'Bước 3'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đã đến điểm nhận hàng',
                        description: 'Bước 4'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Xác nhận trạng thái giao hàng',
                        description: 'Bước 5'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Thanh toán hóa đơn',
                        description: 'Bước 6'
                    },
                    {
                        time: call_api_order.data.date_end,
                        title: statusOrder,
                        description: 'Bước 7'
                    }
                ])
                break;
            case 'Đã hủy':
                setDataTimeLine([
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đã đến điểm lấy hàng',
                        description: 'Bước 1'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Hoàn thành bốc hàng hóa',
                        description: 'Bước 2'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Vận chuyển hàng hóa',
                        description: 'Bước 3'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đã đến điểm nhận hàng',
                        description: 'Bước 4'
                    },
                    {
                        time: data_order.date_start + '-' + data_order.time_start,
                        title: 'Đơn hàng đã bị hủy !',
                        description: 'Bước 5'
                    }
                ])
                break;
            default:
                break;
        }

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
            <View style={{ marginLeft: 20, marginTop: 80 }}>
                <Timeline
                    data={dataTimeLine}
                    circleSize={25}
                    circleColor='rgb(75, 192, 192)'
                    lineColor='rgb(75, 192, 192)'
                    timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
                    timeStyle={{ textAlign: 'center', backgroundColor: 'rgb(241, 102, 34)', color: 'white', padding: 5, borderRadius: 13 }}
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