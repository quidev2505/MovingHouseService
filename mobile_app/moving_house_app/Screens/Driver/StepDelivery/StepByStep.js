import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from "react-native";
import Stepper from 'react-native-stepper-ui';
import axios from "axios"
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import api_url from '../../../api_url';
import { Input } from '@rneui/themed';
import RNTextArea from "@freakycoder/react-native-text-area";
import { Ionicons } from '@expo/vector-icons';


function StepByStep({ route, navigation }) {
    const [active, setActive] = useState(0);
    const [titleHome, setTitleHome] = useState("")

    const [fromLocation, setFromLocation] = useState({})
    const [toLocation, setToLocation] = useState({})


    const get_location = async (from_location, to_location, fromLocationDetail, toLocationDetail) => {
        // let fromLocationReceive = await axios.get(`https://nominatim.openstreetmap.org/search?q=${from_location}&format=json`)

        let fromLocationReceive = await axios.get(`https://geocode.maps.co/search?q=${from_location}&format=json`)

        const ob_from_location = {
            lat: fromLocationReceive.data[0].lat,
            lon: fromLocationReceive.data[0].lon,
            name: fromLocationDetail
        }



        setFromLocation(ob_from_location)


        // let toLocationReceive = await axios.get(`https://nominatim.openstreetmap.org/search?q=${to_location}&format=json`)



        let toLocationReceive = await axios.get(`https://geocode.maps.co/search?q=${to_location}&format=json`)


        // if (!toLocationReceive) {
        //     toLocationReceive = await axios.get(`https://geocode.maps.co/search?q=${to_location}&format=json`)
        // }

        const ob_to_location = {
            lat: toLocationReceive.data[0].lat,
            lon: toLocationReceive.data[0].lon,
            name: toLocationDetail
        }


        setToLocation(ob_to_location)



    }


    //Component đến điểm lấy hàng
    const ComeToGetOrder = (props) => {
        try {
            useEffect(() => {
                setTitleHome(props.title)
            }, [])

            return (
                <View>
                    <Text style={{ backgroundColor: "orange", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Điểm lấy hàng: {fromLocation.name} </Text>

                    <Text style={{ backgroundColor: "green", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Trạng thái: Đã đến điểm lấy hàng</Text>
                    <Image
                        source={{ uri: `https://rsapi.goong.io/staticmap/route?origin=${fromLocation?.lat},${fromLocation?.lon}&destination=${toLocation?.lat},${toLocation?.lon}&vehicle=car&color=blue&api_key=5aqYNFbo45HBk3GB5hqCRX2FlXEBioT41FsZopYy` }}
                        style={{ width: 400, height: 300, marginTop: 50, objectFit: "fill" }}
                        resizeMode="contain"
                    />


                    <View>
                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                            <TouchableOpacity style={styles.button} onPress={() => {
                                setActive((active) => active + 1)
                            }}>
                                <Text style={styles.buttonText}>Xác nhận đã đến điểm lấy hàng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            );
        } catch (e) {
            console.log(e)
        }

    };

    //Component bốc hàng hóa
    const BocHangHoa = (props) => {
        try {
            useEffect(() => {
                setTitleHome(props.title)
            }, [])
            return (
                <View>
                    <Text style={{ backgroundColor: "orange", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Điểm lấy hàng : {fromLocation.name}</Text>
                    <Text style={{ backgroundColor: "green", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Trạng thái: Hoàn thành bốc hàng hóa</Text>

                    <Image
                        source={{ uri: 'https://png.pngtree.com/png-vector/20220630/ourmid/pngtree-concept-moving-house-box-move-png-image_5633495.png' }}
                        style={{ width: 400, height: 300, marginTop: 50, objectFit: "fill" }}
                        resizeMode="contain"
                    />


                    <View>
                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                            <TouchableOpacity style={styles.button} onPress={() => {
                                setActive((active) => active + 1)
                            }}>
                                <Text style={styles.buttonText}>Xác nhận hoàn thành bốc hàng hóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            );
        } catch (e) {
            console.log(e)
        }

    };

    //Component đến điểm nhận hàng
    const ComeToReceiveOrder = (props) => {
        try {
            useEffect(() => {
                setTitleHome(props.title)
            }, [])
            return (
                <View>
                    <Text style={{ backgroundColor: "orange", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Điểm nhận hàng: {toLocation.name}</Text>
                    <Text style={{ backgroundColor: "green", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Trạng thái: Đã đến điểm nhận hàng</Text>
                    <Image
                        source={{ uri: `https://rsapi.goong.io/staticmap/route?origin=${fromLocation?.lat},${fromLocation?.lon}&destination=${toLocation?.lat},${toLocation?.lon}&vehicle=car&color=blue&api_key=5aqYNFbo45HBk3GB5hqCRX2FlXEBioT41FsZopYy` }}
                        style={{ width: 400, height: 300, marginTop: 50, objectFit: "fill" }}
                        resizeMode="contain"
                    />


                    <View>
                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                            <TouchableOpacity style={styles.button} onPress={() => {
                                setActive((active) => active + 1)
                            }}>
                                <Text style={styles.buttonText}>Xác nhận đã đến điểm nhận hàng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        } catch (e) {
            console.log(e)
        }

    };


    const [data_order, setDataOrder] = useState()



    //Component đến điểm nhận hàng
    const VerifyStatusDelivery = (props) => {
        try {
            useEffect(() => {
                setTitleHome(props.title)
            }, [])

            const [checkCancel, setCheckCancel] = useState(false)
            const [reasonCancel, setReasonCancel] = useState(null);


            const data = [
                { label: 'Điểm nhận hàng không đúng thực tế', value: 'Điểm nhận hàng không đúng thực tế' },
                { label: 'Quá trình giao hàng gặp sự cố', value: 'Quá trình giao hàng gặp sự cố' },
                { label: 'Không liên lạc được với người nhận ', value: 'Không liên lạc được với người nhận ' },

            ];


            //Hủy đơn hàng
            const cancel_order = async () => {
                await axios.patch(`${api_url}/v1/order/updateonefield_order/${data_order.order_id}`, {
                    status: "Đã hủy",
                    reason_cancel: reasonCancel
                }).then((data) => {
                    Alert.alert('Thông báo', 'Hủy đơn hàng thành công !', [
                        { text: 'Xác nhận', onPress: () => navigation.navigate("NHẬN ĐƠN") },
                    ]);
                }).catch((e) => {
                    console.log(e)
                })
            }

            return (
                <View>
                    <Image
                        source={{ uri: `https://cdn3d.iconscout.com/3d/premium/thumb/delivery-complete-8789643-7191724.png?f=webp` }}
                        style={{ width: 350, height: 300, marginTop: 50, objectFit: "contain" }}
                        resizeMode="contain"
                    />

                    <View>
                        <Text style={{ fontSize: 30, color: "#e3ba85", textAlign: "center" }}>Bạn giao hàng thành công không ?</Text>
                    </View>

                    <View>
                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                            <TouchableOpacity style={styles.button1} onPress={() => {
                                setActive((active) => active + 1)
                            }}>
                                <Text style={styles.buttonText}>Giao hàng thành công, đã dỡ hàng!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View>
                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                            <TouchableOpacity style={styles.button2} onPress={() => setCheckCancel(true)

                            }>
                                <Text style={styles.buttonText}>Giao hàng không thành công !</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {checkCancel ? (
                        <View>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={data}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Chọn lí do"
                                searchPlaceholder="Tìm kiếm..."
                                value={reasonCancel}
                                onChange={item => {
                                    setReasonCancel(item.value);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                                )}
                            />
                            <Text style={{ color: "purple", fontStyle: "italic", fontSize: 15, marginBottom: 10 }}>Chú ý: Đơn hàng khi bị hủy sẽ trả lại điểm lấy hàng !</Text>
                            <TouchableOpacity onPress={() => cancel_order()}>
                                <Text style={{ backgroundColor: "blue", color: "white", fontSize: 15, width: "fit-content", padding: 5, textAlign: "center" }}>Hủy đơn hàng</Text>
                            </TouchableOpacity>
                        </View>

                    ) : ''}

                </View>
            );
        } catch (e) {
            console.log(e)
        }

    };

    const [data_user, setDataUser] = useState()

    //Component thanh toán hóa đơn
    const PaymentOrder = (props) => {
        try {
            useEffect(() => {
                setTitleHome(props.title)
            }, [])
            const [contentFeeMore, setContentFeeMore] = useState("") //Nội dung phí phát sinh
            const [sumFeeMore, setSumFeeMore] = useState("0") //Tổng phí phát sinh


            //Xác nhận đã thanh toán hóa đơn
            const verify_order_payment = async () => {
                try {
                    //Cập nhật đơn hàng chi tiết
                    await axios.patch(`${api_url}/v1/order/updateonefield_order_detail/${data_order.order_detail_id}`, {
                        more_fee_name: contentFeeMore,
                        more_fee_price: sumFeeMore,
                        totalOrderNew: Number(data_order.totalOrder + Number(sumFeeMore)),
                        payment_status: "Đã thanh toán"
                    })

                    //Cập nhật đơn hàng
                    await axios.patch(`${api_url}/v1/order/updateonefield_order/${data_order.order_id}`, {
                        totalOrder: Number(data_order.totalOrder + Number(sumFeeMore)),
                        status: "Thanh toán hóa đơn"
                    });

                    setActive((active) => active + 1)


                } catch (e) {
                    console.log(e)
                }



            }


            return (
                <View>
                    <Text style={{ backgroundColor: "red", color: "white", padding: 5, marginTop: 20, fontSize: 20, borderRadius: 10 }}>Điểm lấy hàng: {fromLocation.name}</Text>
                    <Text style={{ backgroundColor: "#7bd6e5", color: "white", padding: 5, marginTop: 20, fontSize: 20, borderRadius: 10 }}>Điểm nhận hàng: {toLocation.name}</Text>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 20, color: "red" }}>Thông tin khách hàng:</Text>
                        <View style={{ borderWidth: 1, padding: 5, borderColor: "#ccc", borderRadius: 5 }}>
                            <Text>Tên khách hàng: {data_user.fullname}</Text>
                            <Text>Email: {data_user.email}</Text>
                            <Text>Số điện thoại: {data_user.phonenumber}</Text>
                        </View>
                    </View>


                    <View>
                        <Text style={{ fontSize: 18, color: "green", marginTop: 15 }}>Nhập vào nội dung phí phát sinh (nếu có):</Text>

                        <Text>
                            <RNTextArea
                                maxCharLimit={150}
                                placeholderTextColor="black"
                                exceedCharCountColor="#990606"
                                placeholder={"Viết vào các chi phí phát sinh cách nhau bởi dấu phẩy,..."}
                                style={{ height: 170, borderColor: "#ccc", borderWidth: 1, width: 350, borderRadius: 10 }}
                                onChangeText={(text) => setContentFeeMore(text)}
                            />
                        </Text>

                        <Input
                            value={sumFeeMore}
                            onChangeText={(value) => { setSumFeeMore(value) }}
                            placeholder="Tổng cộng phí phát sinh"
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 20, color: "blue" }}>Hóa đơn</Text>
                        <View>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text>Phương thức thanh toán</Text>
                                <Text>{data_order.payment_method}</Text>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text>Trạng thái thanh toán</Text>
                                <Text style={{ color: data_order.payment_status === "Chưa thanh toán" ? "red" : "green" }}>{data_order.payment_status}</Text>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text>Ghi chú đơn hàng</Text>
                                <Text>{data_order.note_driver}</Text>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 15 }}>Tổng đơn hàng tạm tính: </Text>
                                <Text style={{ fontSize: 20, color: "red" }}>{data_order.totalOrder.toLocaleString()} đ</Text>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 15 }}>Chi phí phát sinh: </Text>
                                <Text style={{ fontSize: 20, color: "orange" }}>{Number(sumFeeMore).toLocaleString()} đ</Text>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 20 }}>Tổng chi phí phải trả: </Text>
                                <Text style={{ fontSize: 25, color: "green" }}>{Number(data_order.totalOrder + Number(sumFeeMore)).toLocaleString()} đ</Text>
                            </View>
                        </View>
                    </View>




                    <View>
                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                            <TouchableOpacity style={styles.button} onPress={() => {
                                verify_order_payment()
                            }}>
                                <Text style={styles.buttonText}>
                                    <Ionicons
                                        name="cash-outline"
                                        size={25}
                                        color="orange"
                                    />
                                    &nbsp;
                                    Xác nhận đã thanh toán hóa đơn</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

            );
        } catch (e) {
            console.log(e)
        }
    }

    //Component đã hoàn thành
    const CompleteDelivery = (props) => {

        function timeToSeconds(time) {
            // Lấy số giờ từ thời gian
            const hours = parseInt(time.split(":")[0]);

            // Lấy số phút từ thời gian
            const minutes = parseInt(time.split(":")[1]);

            // Chuyển đổi thời gian thành số giây
            const timeInSeconds = hours * 60 * 60 + minutes * 60;

            return timeInSeconds;
        }

        function durationToSeconds(duration) {

            // Lấy số giờ từ thời gian
            const hours = parseInt(duration.split(" ")[0]);

            // Lấy số phút từ thời gian
            const minutes = parseInt(duration.split(" ")[2]);

            // Chuyển đổi thời gian thành số giây
            const durationInSeconds = hours * 60 * 60 + minutes * 60;


            return durationInSeconds;
        }

        function secondsToTime(seconds_input) {
            // Chuyển đổi số giây thành số giờ
            const hours = Math.floor(seconds_input / (60 * 60));

            // Chuyển đổi số giây còn lại thành số phút
            const minutes = Math.floor((seconds_input % (60 * 60)) / 60);

            // Chuyển đổi số giây còn lại thành số giây
            const seconds = seconds_input % 60;

            // Tạo chuỗi thời gian
            const result = `${hours}:${minutes}:${seconds}`;

            return result;
        }
        try {
            useEffect(() => {
                setTitleHome(props.title)
            }, [])

            const finish_order = async () => {
                try {
                    const duration = data_order.duration
                    const time = data_order.time_start
                    console.log(duration)
                    console.log(time)

                    // Chuyển đổi time thành số giây
                    const timeInSeconds = timeToSeconds(time);

                    // Chuyển đổi duration thành số giây
                    const durationInSeconds = durationToSeconds(duration);

                    // Cộng time và duration
                    const totalInSeconds = timeInSeconds + durationInSeconds;


                    // Chuyển đổi totalInSeconds thành chuỗi thời gian dạng hh:mm
                    const result = secondsToTime(totalInSeconds);

                    const date_end = data_order.date_start + ',' + result



                    //Cập nhật đơn hàng
                    await axios.patch(`${api_url}/v1/order/updateonefield_order/${data_order.order_id}`, {
                        date_end: date_end,
                        status: "Đã hoàn thành",
                    }).then((data) => {
                        Alert.alert('Thông báo', 'Hoàn tất giao nhận đơn hàng !', [
                            { text: 'Xác nhận', onPress: () => navigation.navigate('ĐƠN HÀNG') },
                        ]);

                    }).catch((e) => {
                        console.log(e)
                    })



                } catch (e) {
                    console.log(e)
                }

            }

            return (
                <View>
                    <View style={{ marginTop: 50, display: "flex", alignItems: "center" }}>
                        <Text style={{ fontSize: 20, color: "green", fontWeight: "bold" }}>HOÀN THÀNH GIAO HÀNG</Text>
                        <Ionicons
                            name="shield-checkmark-sharp"
                            size={250}
                            color="green"
                        />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            finish_order()
                        }}>
                            <Text style={styles.buttonText}>
                                <Ionicons
                                    name="car-sharp"
                                    size={25}
                                    color="orange"
                                />
                                &nbsp;
                                Xác nhận kết thúc giao hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } catch (e) {
            console.log(e)
        }

    };

    const content = [
        <ComeToGetOrder title="Đến điểm lấy hàng" />,
        <BocHangHoa title="Hoàn thành bốc hàng hóa" />,
        <ComeToReceiveOrder title="Đến điểm nhận hàng" />,
        <VerifyStatusDelivery title="Xác nhận trạng thái giao hàng" />,
        <PaymentOrder title="Thanh toán hóa đơn" />,
        <CompleteDelivery title="Đã hoàn thành" />,
    ];



    useEffect(() => {
        const { data_user, data_order } = route.params;

        get_location(data_order.from_location, data_order.to_location, data_order.fromLocation_detail, data_order.toLocation_detail)
        setDataOrder(data_order)
        setDataUser(data_user)
    }, [])

    return (
        <ScrollView>
            <View>
                <View>
                    <View style={{ display: "flex", flexDirection: "row", height: 90, backgroundColor: "white", justifyContent: "space-between", padding: 10, paddingTop: 50 }}>
                        {/* <Ionicons
                        onPress={() => back()}
                        name="arrow-back-sharp"
                        size={25}
                        color="orange"
                    /> */}
                        <Text style={{ fontSize: 20 }}>{titleHome}</Text>

                    </View>
                </View>

                <View style={{ marginVertical: 80, marginHorizontal: 20, marginTop: 20, backgroundColor: "white", padding: 10, borderRadius: 5 }}>
                    <Stepper
                        TextStyle={'red'}
                        active={active}
                        content={content}
                        onBack={() => setActive((p) => p - 1)}
                        onFinish={() => alert('Hoàn tất giao hàng')}
                        onNext={() => setActive((p) => p + 1)}
                        showButton={false}
                        stepTextStyle={{ color: "black" }}
                    />
                </View>
            </View>
        </ScrollView>

    )
}


const styles = StyleSheet.create({
    button1: {
        backgroundColor: "green",
        borderRadius: 5,
        padding: 10,
        width: 350,
        marginTop: 20
    },
    button2: {
        backgroundColor: "red",
        borderRadius: 5,
        padding: 10,
        width: 350,
        marginTop: 20
    },
    input: {
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: 350,
        borderWidth: 1.3,
        borderColor: "#ccc"
    },
    error: {
        color: "red",
        marginBottom: 10,
        marginTop: -5,
        fontStyle: "italic"
    },
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        objectFit: 'cover'
    },
    button: {
        backgroundColor: 'black',
        borderRadius: 5,
        padding: 10,
        width: 350,
        marginTop: 20
    },
    text: {
        color: 'white',
        fontSize: 42,
        lineHeight: 84,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#000000c0',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: "center"
    },
    sectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#000',
        height: 40,
        borderRadius: 5,
        margin: 10,
    },
    imageStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default StepByStep