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


    const [dom_RatingDriver, setDOMRatingDriver] = useState();


    const check = useRef('')
    //Lấy dữ liệu đánh giá show ra
    const get_data_order = async (dataOrder) => {
        try {
            await axios.get(
                `${api_url}/v1/order/viewOrderWithOrderId/${dataOrder}`
            ).then((data) => {
                let arr_driver = data.data.driver_name;
                setDriverName(arr_driver);
                let service_name = data.data.service_name;
                setServiceName(service_name);

                // Khởi tạo biến arr_check có kích thước 0
                var arr_check = new Array(0);

                // Lập qua mang tên tài xế và thực hiện truy vấn API
                arr_driver.forEach(async(item, index) => {
                    // Thực hiện truy vấn API
                    let result = await axios.get(
                        `${api_url}/v1/driver/getdriver_with_fullname/${item}`
                    );

                    // Tạo đối tượng ob chứa thông tin về tài xế
                    let ob = {
                        fullname: result.data.fullname,
                        avatar: result.data.avatar,
                    };

                    // Thêm đối tượng ob vào mảng arr_check
                    arr_check.push(ob);
                });

                console.log(arr_check);






                // setTimeout(() => {
                //     // Tạo DOM gắn vào tài xế
                //     //Tạo DOM gắn vào tài xế
                //     if (arrDriver.length > 0) {
                //         let DOM_DRIVER = arrDriver.map((item, index) => {
                //             return (
                //                 <>
                //                     <View
                //                         className="d-flex"
                //                         style={{
                //                             alignItems: "center",
                //                             borderTopWidth: 1,
                //                             borderTopColor: "#ccc",
                //                             paddingTop: 10
                //                         }}
                //                     >
                //                         <Avatar
                //                             size={64}
                //                             rounded
                //                             source={item.avatar}
                //                         />
                //                         <Text
                //                             style={{
                //                                 color: "orange",
                //                                 marginLeft: 15,
                //                                 marginTop: 5,
                //                             }}
                //                         >
                //                             {item.fullname}
                //                         </Text>
                //                     </View>
                //                     <View style={{ padding: "10px" }}>
                //                         <View
                //                             style={{
                //                                 display: "flex",
                //                                 flexDirection: "row",
                //                                 justifyContent: "space-between",
                //                                 alignItems: "center",
                //                                 paddingLeft: 15,
                //                                 width: 250,
                //                             }}
                //                         >
                //                             <Text style={{ marginBottom: "0px" }}>Đánh giá</Text>
                //                             <Text>
                //                                 <AirbnbRating reviews={[
                //                                     'Rất Tệ',
                //                                     'Tệ',
                //                                     'Bình thường',
                //                                     'Hoàn hảo',
                //                                     'Xuất sắc',
                //                                 ]}
                //                                     size={20}
                //                                     onFinishRating={ratingService}
                //                                 />

                //                             </Text>
                //                         </View>
                //                         <View

                //                             style={{
                //                                 display: "flex",
                //                                 flexDirection: "row",
                //                                 justifyContent: "space-between",
                //                                 alignItems: "center",
                //                                 paddingLeft: 15,
                //                                 marginTop: 40,
                //                             }}
                //                         >
                //                             <Text>Nhận xét</Text>
                //                             <Input
                //                                 containerStyle={{}}
                //                                 disabledInputStyle={{ background: "#ddd" }}
                //                                 inputContainerStyle={{}}

                //                                 value={commentService}
                //                                 onChangeText={(e) => setCommentService(e)}
                //                                 placeholder="Nhập vào nhận xét"
                //                             />
                //                         </View>
                //                     </View>
                //                 </>
                //             );
                //         });

                //         setDOMRatingDriver(DOM_DRIVER);
                //     }
                // }, [1500]);
            }).catch((e) => {
                console.log('loi r')
            })

        } catch (e) {
            console.log(e)
        }


    }


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        get_data_order()
        setRefreshing(false);
    }, []);



    useEffect(() => {
        /* 2. Get the param */
        const { status, data } = route.params;
        get_data_order(data)

        setNavigateOri(status)
    }, [])

    //Nút quay trở lại
    const back = () => {
        navigation.navigate(navigate_ori)
    }


    //Đánh giá dịch vụ
    const [commentService, setCommentService] = useState("") //Nhận xét dịch vụ
    //Số sao dịch vụ
    const ratingService = (e) => {
        console.log(e)
        console.log(commentService)
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
                {dom_RatingDriver ? dom_RatingDriver : ''}
            </View>
        </ScrollView>
    )
}

export default RatingOrder