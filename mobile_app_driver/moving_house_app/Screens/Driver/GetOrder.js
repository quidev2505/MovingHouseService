import React, { useState, useEffect, useRef } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity, RefreshControl } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local
import axios from 'axios';
import api_url from "../../api_url"
import { Ionicons } from '@expo/vector-icons';
import { Tab, TabView } from '@rneui/themed';

import { FAB } from 'react-native-elements';


import { Card, Divider } from '@rneui/themed';

function GetOrder({ navigation }) {
    console.disableYellowBox = true;
    const [dataOrder, setDataOrder] = useState([])
    const [statusDriver, setStatusDriver] = useState("");
    const [location_delivery, setLocationDelivery] = useState("")


    //Tên tài xế hiện tại
    const [driverName, setDriverName] = useState("")
    //Phương tiện tài xế sử dụng hiện tại
    const [vehicleType, setVehicleType] = useState("")

    const location_order = useRef("TPHCM và tỉnh lân cận")

    const inputStatus = useRef("Hiện có")

    //Lấy thông tin tất cả đơn hàng
    const get_info_all_order = async () => {
        try {
            const value_local = await AsyncStorage.getItem('already_login_driver');
            const dataLocal = JSON.parse(value_local)


            if (dataLocal) {
                const username = dataLocal.username

                if (username) {
                    await axios.get(`${api_url}/v1/driver/view_detail_driver_with_username/${username}`).then(async (data) => {
                        //Lấy trạng thái của tài xế
                        const data_driver = data.data;

                        const status_driver = data_driver.status;
                        const location_delivery = data_driver.location_delivery;
                        const vehicle_type = data_driver.vehicle_type;
                        const fullname_driver = data_driver.fullname

                        setDriverName(fullname_driver)
                        setVehicleType(vehicle_type)

                        setStatusDriver(status_driver)
                        setLocationDelivery(location_delivery)


                        //Lấy ra tất cả các đơn hàng
                        await axios.get(`${api_url}/v1/order/viewAllOrder`).then((data) => {
                            let dataOrder = data.data;
                            const data_order = []
                            console.log(inputStatus.current)
                            dataOrder &&
                                dataOrder.forEach((item, index) => {
                                    if (inputStatus.current === "Đã nhận") {
                                        if (status_driver === "Sẵn sàng" && item.status !== "Đã hủy" && item.status !== "Đã hoàn thành" && item.driver_name.includes(fullname_driver) === true) {
                                            check_location_order(item.fromLocation)
                                            console.log(item.vehicle_name)
                                            const quantity_driver = item.vehicle_name.split(" ")[item.vehicle_name.split(" ").length - 1].split("x")[1].split(")")[0]



                                            const ob_order = {
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
                                                order_detail_id: item.order_detail_id,
                                                status: item.status,
                                                locationOrder: location_order.current,
                                                fullname_driver: fullname_driver,
                                                quantity_driver: quantity_driver,
                                                customer_id: item.customer_id
                                            };

                                            data_order.push(ob_order);
                                        }
                                    } else {
                                        if (status_driver === "Sẵn sàng" && item.status !== "Đã hủy" && item.status !== "Đã hoàn thành" && item.driver_name.includes(fullname_driver) === false) {
                                            check_location_order(item.fromLocation)

                                            const quantity_driver = item.vehicle_name.split(" ")[item.vehicle_name.split(" ").length - 1].split("x")[1].split(")")[0]





                                            const ob_order = {
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
                                                order_detail_id: item.order_detail_id,
                                                status: item.status,
                                                locationOrder: location_order.current,
                                                fullname_driver: fullname_driver,
                                                quantity_driver: quantity_driver,
                                                customer_id: item.customer_id
                                            };

                                            data_order.push(ob_order);

                                        }
                                    }


                                });
                            setDataOrder(data_order)

                        })
                    })
                }
            }
        } catch (e) {
            console.log(e)
        }
    }


    //Hàm check xem đơn hàng này thuộc khu vực nào
    const check_location_order = async (fromLocation) => {

        await axios
            .get(
                `https://nominatim.openstreetmap.org/search?q=${fromLocation}&format=json`
            )
            .then((data) => {
                let result = data.data[0];
                if (result) {
                    const latitude = result.lat;
                    const lontitude = result.lon


                    const location = checkLocation(latitude, lontitude);
                    location_order.current = location

                }
            })
            .catch((e) => {
                console.log(e)
            })


    }

    const isInRange = (lat, lon, latCenter, lonCenter, radius) => {
        const distance = Math.sqrt(
            Math.pow(lat - latCenter, 2) + Math.pow(lon - lonCenter, 2)
        );
        return distance <= radius;
    };

    // Thay đổi bán kính kiểm tra
    const checkLocation = (lat, lon) => {
        const positionInHCM = isInRange(lat, lon, 10.777778, 106.694444, 50);
        const positionInHN = isInRange(lat, lon, 21.0278, 105.8333, 50);

        if (positionInHCM) {
            return "TPHCM và tỉnh lân cận";
        } else if (positionInHN) {
            return "Hà nội và tỉnh lân cận";
        } else {
            return null;
        }
    };


    useEffect(() => {

        // setInterval(() => {


        get_info_all_order();
        // },5000)

    }, [])


    //Chuyển trang
    const navigation_to_detailOrder = (order_detail_id, driver_name, order_id, fullname_driver, quantity_driver, customer_id, from_location, to_location, date_start, time_start) => {
        navigation.navigate('OrderDetailDriver', { data_order: order_detail_id, driver_name: driver_name, order_id: order_id, fullname_driver: fullname_driver, quantity_driver: quantity_driver, customer_id, from_location, to_location, date_start, time_start })
    }


    //Load page khi kéo xuống
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        get_info_all_order()
        setRefreshing(false);

    }, []);

    const [colorTab, setColorTab] = useState(true);
    //Lọc đơn hàng
    const filterOrder = (inputOrder) => {
        if (inputOrder === "Đã nhận") {
            //Hiển thị lên
            setColorTab(false)
            inputStatus.current = "Đã nhận"
            get_info_all_order();
        } else {
            //Hiển thị lên
            setColorTab(true)
            inputStatus.current = "Hiện có"
            get_info_all_order();
        }
    }


    return (
        <>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>

                {/* Hiển thị trạng thái tài xế */}
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", paddingLeft: 13 }}>
                    <Text style={{ marginLeft: 10, marginTop: 10, padding: 10, color: "white", backgroundColor: statusDriver === "Sẵn sàng" ? "green" : "red", width: "fit-content", borderRadius: 10, display: "flex", alignItems: "center", lineHeight: 40 }}>{statusDriver}</Text>


                    <Text style={{ marginRight: 10, marginTop: 10, padding: 10, width: "70%", color: "white", backgroundColor: location_delivery === "TPHCM và tỉnh lân cận" ? "red" : "purple", borderRadius: 10, textAlign: "center", marginLeft: 10 }}>
                        <Ionicons
                            name="location-sharp"
                            size={20}
                            color="white"
                        />&nbsp;{location_delivery}{"\n"}
                        <Ionicons
                            name="car"
                            size={20}
                        />&nbsp;{vehicleType}
                    </Text>
                </View>

                {/* Lọc ra đơn hiện đang có và đơn đã nhận hàng. */}
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: 10, height: 40 }}>
                    <TouchableOpacity style={{ backgroundColor: colorTab ? 'orange' : '#ccc', padding: 5, borderRadius: 5, height: "fit-content" }} onPress={() => filterOrder("Hiện có")}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>Danh sách đơn hiện có</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: colorTab ? '#ccc' : 'orange', color: "white", padding: 5, borderRadius: 5, height: "fit-content" }} onPress={() => filterOrder("Đã nhận")}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>Danh sách đơn đã nhận</Text>
                    </TouchableOpacity>
                </View>


                {/* Khu vực hiển thị danh sách đơn hàng hiện có */}
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
                                <Card key={item.date_start}
                                >
                                    <View>
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
                                            <Text style={{ marginLeft: 10, borderRadius: 5, width: 300, padding: 5, color: "white", backgroundColor: item.locationOrder === "TPHCM và tỉnh lân cận" ? "red" : "purple" }}>-{item.locationOrder === "TPHCM và tỉnh lân cận" ? "TPHCM" : "Hà Nội"}</Text>
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
                                                {item.toLocation}
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
                                                {item.driver_name.length === 0 ? <Text style={{ fontWeight: "bold" }}>&nbsp;(Chưa xác định) </Text> : item.driver_name.map((item1, index) => {
                                                    return <Text key={item1.fullname_driver} style={{ fontWeight: item1 === item.fullname_driver ? 'bold' : '400', color: item1 === item.fullname_driver ? 'purple' : 'black' }}> {index + 1}. {item1} |</Text>
                                                })}
                                                <Text style={{ fontWeight: "bold" }}>- Cần ({item.driver_name.length}/ {item.quantity_driver}) tài xế
                                                    {/* {item.vehicle_name.split(" ")[item.vehicle_name.split(" ").length - 1].split("x")[1].split(")")[0]}) tài xế */}
                                                </Text>
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
                                        <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", backgroundColor: "orange", padding: 5, borderRadius: 5 }}>
                                            <Text style={{ color: "white" }}>
                                                {item.vehicle_name}
                                            </Text>
                                            <Text style={{ color: "white", fontWeight: "bold" }}>
                                                {item.totalOrder.toLocaleString()} đ
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ borderTopColor: "#ccc", borderTopWidth: 1, paddingTop: 10 }}>
                                        <TouchableOpacity style={{ display: "flex", justifyContent: "center", flexDirection: "row", backgroundColor: "red", padding: 5, borderRadius: 5, height: 30, alignItems: "center" }} onPress={() => navigation_to_detailOrder(item.order_detail_id, item.driver_name, item.order_id, item.fullname_driver, item.quantity_driver, item.customer_id, item.fromLocation, item.toLocation, item.date_start, item.time_start)}>
                                            <Text style={{ color: "white" }}>XEM CHI TIẾT</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Card>


                            </>
                        )
                    })}




            </ScrollView>
            <View style={{
                position: "fixed",
                bottom: 20,
                left: 15,
                backgroundColor: "orange",
                width: 50,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10
            }}>
                <TouchableOpacity onPress={() => navigation.navigate('BẢN ĐỒ')}>
                    <Ionicons
                        name="locate-sharp"
                        size={25}
                        color="white"
                    />
                </TouchableOpacity>

            </View>
        </>
    )
}

export default GetOrder