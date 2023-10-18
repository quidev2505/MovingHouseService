import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import api_url from '../../../api_url';
import axios from 'axios';


import { Card } from '@rneui/themed';

function OrderDetail({ route, navigation }) {

    const [nextStep, setNextStep] = useState(false)
    const [dataOrderDetail, setDataOrderDetail] = useState({});

    //ID khách hàng
    const [customerID, setCustomerID] = useState("")

    //Dữ liệu khách hàng
    const [dataUser, setDataUser] = useState({})

    const get_detail_order = async (id_input, driver_name, order_id, fullname_driver, quantity_driver, customer_id, from_location, to_location, date_start, time_start) => {


        await axios.get(`${api_url}/v1/order/viewOrderDetail/${id_input}`).then(async(data) => {
            const data_customer = data.data[0];
            const ob_detail_order = {
                order_detail_id: id_input,
                order_id: order_id,
                driver_name: driver_name,
                fullname_driver: fullname_driver,
                quantity_driver: quantity_driver,
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
                customer_id: customer_id,
                from_location: from_location,
                to_location: to_location,
                date_start: date_start,
                time_start: time_start,
                more_fee_name: data_customer.more_fee_name,
                more_fee_price: data_customer.more_fee_price,
            }

            //Kiểm tra xem đủ tài xế chưa
            if (quantity_driver == ob_detail_order.driver_name.length) {
                setNextStep(true)
            }


            //Lấy thông tin khách hàng ra
            let data_customer_new = await axios.get(`${api_url}/v1/customer/get_customer_with_id/${customer_id}`)

            //Lấy thông tin số điện thoại, email khách hàng, tên ra
            let data_user_new = await axios.get(`${api_url}/v1/customer/get_info_user_with_customer_name/${data_customer_new.data.fullname}`)

            const data_user_object = {
                fullname: data_user_new.data.fullname,
                phonenumber: data_user_new.data.phonenumber,
                email: data_user_new.data.email
            }

            //Lấy thông tin khách hàng show ra bên dưới
            setDataUser(data_user_object)

            // setCustomerID(ob_detail_order.customer_id)
            setDataOrderDetail(ob_detail_order)

        }).catch((e) => {
            console.log(e)
        })
    }

    useEffect(() => {
        /* 2. Get the param */
        const { data_order, driver_name, order_id, fullname_driver, quantity_driver, customer_id, from_location, to_location, date_start, time_start } = route.params;

        get_detail_order(data_order, driver_name, order_id, fullname_driver, quantity_driver, customer_id, from_location, to_location, date_start, time_start)

    }, [])

    const back = () => {
        navigation.navigate("ĐƠN HÀNG")
    }



    //Khi nhấn nút tiếp theo
    const check_info_customer = async () => {
        //Lấy thông tin khách hàng ra
        let data_customer = await axios.get(`${api_url}/v1/customer/get_customer_with_id/${customerID}`)

        //Lấy thông tin số điện thoại, email khách hàng, tên ra
        let data_user = await axios.get(`${api_url}/v1/customer/get_info_user_with_customer_name/${data_customer.data.fullname}`)

        const data_user_object = {
            fullname: data_user.data.fullname,
            phonenumber: data_user.data.phonenumber,
            email: data_user.data.email
        }

        //Cập nhật lại trạng thái đơn hàng
        await axios.patch(`${api_url}/v1/order/updateonefield_order/${dataOrderDetail.order_id}`, {
            status: "Đang thực hiện"
        }).then((data) => {
            navigation.navigate('ContactCustomer', { data_user: data_user_object, data_order: dataOrderDetail })
        }).catch((e) => {
            console.log(e)
        })
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
                                    {dataOrderDetail.toLocation_detail}
                                </Text>
                            </View>
                        </View>

                        <View style={{ borderTopColor: "#ccc", borderTopWidth: 1, paddingTop: 10 }}>
                            <Text style={{fontWeight:"bold", textAlign:"center", color:"white", backgroundColor:"red", padding:5, borderRadius:5}}>Thông tin khách hàng</Text>
                            <View style={{ display: "flex", flexDirection: "row", marginTop: 5, justifyContent:"space-between" }}>
                                <Text style={{ fontWeight: "bold" }}>Tên đầy đủ: </Text>
                                <Text>{dataUser.fullname}</Text>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", marginTop: 10, marginBottom: 5, justifyContent:"space-between" }}>
                                <Text style={{ fontWeight: "bold" }}>Số điện thoại: </Text>
                                <Text>{dataUser.phonenumber}</Text>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", marginTop: 5, marginBottom: 10 , justifyContent:"space-between"}}>
                                <Text style={{ fontWeight: "bold" }}>Email: </Text>
                                <Text>{dataUser.email}</Text>
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

                                    {dataOrderDetail.more_fee_name !== "" ? (
                                        <>
                                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                                                <Text>Chi phí phát sinh </Text>
                                                <Text style={{ color: "green", fontWeight: "bold" }}></Text>
                                            </View>

                                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                                                <Text>{dataOrderDetail.more_fee_name} </Text>
                                                <Text style={{ color: "green", fontWeight: "bold" }}>{dataOrderDetail.more_fee_price?.toLocaleString()} đ</Text>
                                            </View>

                                        </>
                                    ) : ''}

                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                                        <Text>Tổng đơn hàng mới: </Text>
                                        <Text style={{ color: "red", fontWeight: "bold", fontSize: 20 }}>{dataOrderDetail.totalOrderNew?.toLocaleString()} đ</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'orange',
        borderRadius: 10,
        padding: 10,
        height: "fit-content",
        width: 350,
        marginTop: 30,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    button1: {
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 10,
        height: "fit-content",
        width: 350,
        marginTop: 30,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    button2: {
        backgroundColor: 'orange',
        borderRadius: 10,
        padding: 10,
        width: 325
    },
    buttonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        textAlign: "center"
    },
    rating: {
        paddingVertical: 10,
    },
});



export default OrderDetail