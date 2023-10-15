import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import api_url from '../../../api_url';

import { AirbnbRating, Input, Avatar } from '@rneui/themed';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local

function RatingOrder({ route, navigation }) {
    //Load page khi kéo xuống
    const [refreshing, setRefreshing] = React.useState(false);
    const [navigate_ori, setNavigateOri] = useState("");


    const [arrDriver, setArrayDriver] = useState([]);
    const [serviceName, setServiceName] = useState("");
    const [driverName, setDriverName] = useState("");


    const [customername, setCustomerName] = useState("")


    const [dataOrder, setDataOrder] = useState("")
    const [dom_RatingDriver, setDOMRatingDriver] = useState("");


    //Đánh giá dịch vụ
    const [ratingStarService, setRatingStarService] = useState(0)
    const [commentService, setCommentService] = useState("") //Nhận xét dịch vụ
    //Số sao dịch vụ
    const ratingService = (e) => {
        setRatingStarService(e)
    }

    //Đánh giá tài xế
    const [ratingStarDriver, setRatingStarDriver] = useState([])
    const [commentDriver, setCommentDriver] = useState("") //Nhận xét tài xế
    //Số sao tài xế
    const ratingDriver = (e) => {
        setRatingStarDriver((prev) => [...prev, e])
    }


    //Khi nhấn vào nút đánh giá đơn hàng
    const ratingOrder = async () => {
        const ob_sending_rating_order = {
            customer_name: customername,
            star_service: ratingStarService,
            comment_service: commentService,
            service_name: serviceName,
            driver_name: driverName,
            star_driver: ratingStarDriver,
            comment_driver: commentDriver,
        };


        await axios
            .post(
                `${api_url}/v1/order/rating_order/${dataOrder}`,
                ob_sending_rating_order
            )
            .then((data) => {
                Alert.alert('Thông báo', 'Đánh giá đơn hàng thành công !', [
                    { text: 'Xác nhận', onPress: () => navigation.navigate(navigate_ori) },
                ]);

            })
            .catch((e) => {
                console.log(e);
                Alert.alert('Thông báo', 'Đánh giá đơn hàng thất bại !', [
                    { text: 'Xác nhận' },
                ]);
            });
    }






    const [arrDriverRating, setArrDriverRating] = useState([])

    //Lấy dữ liệu đánh giá show ra
    const get_data_order = async (data_input) => {
        const value_local = await AsyncStorage.getItem('already_login_customer');
        const dataLocal = JSON.parse(value_local)

        if (dataLocal) {
            const fullname = dataLocal.fullname
            setCustomerName(fullname)
        }



        if (data_input === null) {
            return;
        }

        try {
            const dataOrder_get = await axios.get(`${api_url}/v1/order/viewOrderWithOrderId/${data_input}`);
            const arr_driver_name = dataOrder_get.data.driver_name;

            setDriverName(arr_driver_name)
            setServiceName(dataOrder_get.data.service_name)

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



    //Lấy lịch sử đơn hàng
    const [domHistory, setDomHistory] = useState([]);

    const get_history_rating_order = async (data_input) => {
        const data_rating_order = await axios.get(
            `${api_url}/v1/order/getRating_Order/${data_input}`
        );

        let DOM_HISTORY = data_rating_order.data.map((item, index) => {
            return (
                <>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            borderColor: "#ccc",
                            justifyContent: "space-between",
                            borderWidth: 1,
                            padding: 7,
                            borderRadius: 5,
                            margin: 5,
                        }}
                    >
                        <View>
                            <AirbnbRating style={{ marginTop: -10 }} isDisabled={true} count={5} defaultRating={item.star} size={30} reviews={[
                                'Rất Tệ',
                                'Tệ',
                                'Bình thường',
                                'Hoàn hảo',
                                'Xuất sắc',
                            ]} />

                        </View>
                        <View>
                            <Text>{item.rating_date}</Text>
                            <Text style={{ color: "red", fontWeight: "bold" }}>{item.service_name}</Text>
                            <Text style={{ fontSize: 15, fontWeight: "bold", color: "green", marginTop: 15 }}>{item.comment}</Text>
                        </View>

                    </View>
                </>
            );
        });

        console.log(domHistory)
        setDomHistory(DOM_HISTORY);
    };

    useEffect(() => {
        /* 2. Get the param */
        const { status, data } = route.params;
        setDataOrder(data)
        setNavigateOri(status)
        get_history_rating_order(data);
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
                                style={{ borderWidth: 1, borderRadius: 5, padding: 10 }}
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
                                    paddingTop: 10,
                                    marginLeft: 10,
                                    marginTop: 10,
                                }}
                            >
                                <Avatar
                                    size={65}
                                    rounded
                                    source={{ uri: item.avatar.length < 50 ? `${api_url}/${item.avatar}` : item.avatar }} />
                                <Text
                                    style={{
                                        color: "green",
                                        fontWeight: "bold",
                                        marginLeft: 15,
                                        marginTop: 5,
                                        fontSize: 17
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
                                    <Text style={{ marginBottom: 0, fontSize: 15, fontWeight: "bold" }}>Đánh giá</Text>
                                    <Text>
                                        <AirbnbRating reviews={[
                                            'Rất Tệ',
                                            'Tệ',
                                            'Bình thường',
                                            'Hoàn hảo',
                                            'Xuất sắc',
                                        ]}
                                            size={20}
                                            onFinishRating={ratingDriver}
                                        />
                                    </Text>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 15, marginLeft: -6 }}>
                                    <Input
                                        containerStyle={{}}
                                        disabledInputStyle={{ background: "#ddd" }}
                                        inputContainerStyle={{}}
                                        style={{ borderWidth: 1, borderRadius: 5, padding: 10 }}
                                        value={commentDriver}
                                        onChangeText={(e) => setCommentDriver((comments) => [
                                            ...comments.slice(0, index),
                                            e,
                                            ...comments.slice(index + 1),
                                        ])}
                                        placeholder="Nhập vào nhận xét"
                                    />
                                </View>
                            </View>
                        </>
                    )
                })}
            </View>
            <View style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                <TouchableOpacity style={styles.button} onPress={() => ratingOrder()}>
                    <Text style={styles.buttonText}>ĐÁNH GIÁ</Text>
                </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: "white" }}>
                <View
                    className="lichsudanhgia"
                    style={{ width: "100%", borderWidth: 1, borderColor: "#ccc", backgroundColor: "white" }}
                >
                    <Text
                        style={{
                            backgroundColor: "grey",
                            width: 400,
                            color: "white",
                            fontWeight: "bold",
                            padding: 5,
                            height: 40,
                            fontSize: 20,
                            marginLeft: 5,
                            marginTop: 10,
                            textAlign: "center",
                        }}
                    >
                        Lịch sử đánh giá đơn hàng
                    </Text>
                    {domHistory.length > 0 ? (
                        domHistory
                    ) : (
                        <View style={{ backgroundColor: "white" }}>
                            <Text
                                style={{
                                    fontStyle: "italic",
                                    color: "#ccc",
                                    fontWeight: 700,
                                    fontSize: 25,
                                    textAlign: "center"
                                }}
                            >
                                Hiện tại chưa có đánh giá nào !
                            </Text>
                        </View>

                    )}
                </View>
            </View>
        </ScrollView>
    )
}

export default RatingOrder

const styles = StyleSheet.create({

    button: {
        backgroundColor: 'orange',
        borderRadius: 5,
        padding: 10,
        width: 380,
        marginTop: 20,
    },

    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: "center"
    }
})
