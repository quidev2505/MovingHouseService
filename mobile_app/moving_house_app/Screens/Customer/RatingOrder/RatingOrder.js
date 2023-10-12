import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import api_url from '../../../api_url';

import { AirbnbRating, Input, Avatar } from '@rneui/themed';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


function RatingOrder({ route, navigation }) {
    //Load page khi kéo xuống
    const [refreshing, setRefreshing] = React.useState(false);
    const [navigate_ori, setNavigateOri] = useState("");


    const [arrDriver, setArrayDriver] = useState([]);
    const [serviceName, setServiceName] = useState("");
    const [driverName, setDriverName] = useState("");



    const [dataOrder, setDataOrder] = useState("")
    const [dom_RatingDriver, setDOMRatingDriver] = useState("");


    //Đánh giá dịch vụ
    const [commentService, setCommentService] = useState("") //Nhận xét dịch vụ
    //Số sao dịch vụ
    const ratingService = (e) => {
        console.log(e)
        console.log(commentService)
    }

    const [arrDriverRating, setArrDriverRating] = useState([])

    //Lấy dữ liệu đánh giá show ra
    const get_data_order = async (data_input) => {
        if (data_input === null) {
            return;
        }

        try {
            const dataOrder_get = await axios.get(`${api_url}/v1/order/viewOrderWithOrderId/${data_input}`);
            const arr_driver_name = dataOrder_get.data.driver_name;

            if (arr_driver_name.length > 0) {
                const data = await axios.post(`${api_url}/v1/driver/get_arr_driver_info`, arr_driver_name);
                setArrDriverRating(data.data)
            }
        } catch (e) {
            console.log(e);
        }

    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        get_data_order(dataOrder)
        setRefreshing(false);
    }, []);



    useEffect(() => {
        /* 2. Get the param */
        const { status, data } = route.params;
        setDataOrder(data)
        setNavigateOri(status)
        setTimeout(() => {

            get_data_order(data)
        }, 1000)
    }, [])

    //Nút quay trở lại
    const back = () => {
        navigation.navigate(navigate_ori)
    }


    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            <View>
                <View style={{ display: "flex", flexDirection: "row", height: 90, backgroundColor: "white", justifyContent: "space-between", padding: 10, paddingTop: 50 }}>
                    <Ionicons
                        onPress={() => back()}
                        name="arrow-back-sharp"
                        size={25}
                        color="green"
                    />
                    <Text style={{ fontSize: 20 }}>Đánh giá đơn hàng</Text>
                    <Text></Text>
                </View>
            </View>


            <View style={{ backgroundColor: "white", marginTop: 10 }}>
                {/* Đánh giá dịch vụ */}
                <View style={{ padding: 15 }}>
                    <Text style={{ fontSize: 20, backgroundColor: "orange", color: "white", padding: 5, borderRadius: 5 }}>Đánh giá dịch vụ</Text>
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ marginRight: 20, fontWeight: "bold", fontSize: 20 }}>Đánh giá</Text>
                            <AirbnbRating reviews={[
                                'Rất Tệ',
                                'Tệ',
                                'Bình thường',
                                'Hoàn hảo',
                                'Xuất sắc',
                            ]}
                                size={20}
                                onFinishRating={ratingService}
                            />
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, marginLeft: -6 }}>

                            <Input
                                containerStyle={{}}
                                disabledInputStyle={{ background: "#ddd" }}
                                inputContainerStyle={{}}

                                value={commentService}
                                onChangeText={(e) => setCommentService(e)}
                                placeholder="Nhập vào nhận xét"
                            />
                        </View>
                    </View>
                </View>
            </View>


            <View style={{ backgroundColor: "white", marginTop: 10 }}>
                {/* Đánh giá tài xế */}
                {arrDriverRating && arrDriverRating.map((item, index) => {
                    return (
                        <>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderTopWidth: 1,
                                    borderTopColor: "#ccc",
                                    paddingTop: 10,
                                }}
                            >
                                <Avatar
                                    size={65}
                                    rounded
                                    source={{ uri: `${item.avatar.split("\\")[0] !== "uploads"}` ? item.avatar : `${api_url}+'/'+${item.avatar}` }} />
                                <Text
                                    style={{
                                        color: "orange",
                                        marginLeft: 15,
                                        marginTop: 5,
                                    }}
                                >
                                    {item.fullname}
                                </Text>
                            </View>
                            <View style={{ padding: 10 }}>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingLeft: 15,
                                        width: 250,
                                    }}
                                >
                                    <Text style={{ marginBottom: 0 }}>Đánh giá</Text>
                                    <Text>
                                        <AirbnbRating reviews={[
                                            'Rất Tệ',
                                            'Tệ',
                                            'Bình thường',
                                            'Hoàn hảo',
                                            'Xuất sắc',
                                        ]}
                                            size={20}
                                            onFinishRating={ratingService}
                                        />
                                    </Text>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, marginLeft: -6 }}>

                                    <Input
                                        containerStyle={{}}
                                        disabledInputStyle={{ background: "#ddd" }}
                                        inputContainerStyle={{}}

                                        value={commentService}
                                        onChangeText={(e) => setCommentService(e)}
                                        placeholder="Nhập vào nhận xét"
                                    />
                                </View>
                            </View>
                        </>
                    )
                })}
            </View>
        </ScrollView>
    )
}

export default RatingOrder