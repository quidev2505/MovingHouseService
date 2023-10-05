import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import Stepper from 'react-native-stepper-ui';
import axios from "axios"
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import api_url from '../../../api_url';


function StepByStep({ route, navigation }) {
    const [active, setActive] = useState(3);
    const [titleHome, setTitleHome] = useState("Đến điểm nhận hàng")

    const [fromLocation, setFromLocation] = useState({})
    const [toLocation, setToLocation] = useState({})


    const get_location = async (fromLocationDetail, toLocationDetail) => {
        let from_location = await axios.get(`https://nominatim.openstreetmap.org/search?q=${fromLocationDetail}&format=json`
        )
        const ob_from_location = {
            lat: from_location.data[0].lat,
            lon: from_location.data[0].lon,
            name: fromLocationDetail
        }

        setFromLocation(ob_from_location)

        let to_location = await axios.get(`https://nominatim.openstreetmap.org/search?q=${toLocationDetail}&format=json`
        )
        const ob_to_location = {
            lat: to_location.data[0].lat,
            lon: to_location.data[0].lon,
            name: toLocationDetail
        }


        setToLocation(ob_to_location)

    }


    //Component đến điểm lấy hàng
    const ComeToGetOrder = (props) => {
        setTitleHome(props.title)

        return (
            <View>
                <Text style={{ backgroundColor: "orange", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Điểm lấy hàng: {fromLocation.name}</Text>
                <Text style={{ backgroundColor: "green", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Trạng thái: Đã đến điểm lấy hàng</Text>
                <Image
                    source={{ uri: `https://rsapi.goong.io/staticmap/route?origin=${fromLocation.lat},${fromLocation.lon}&destination=${toLocation.lat},${toLocation.lon}&vehicle=car&api_key=5aqYNFbo45HBk3GB5hqCRX2FlXEBioT41FsZopYy` }}
                    style={{ width: 400, height: 300, marginTop: 50, objectFit: "fit" }}
                    resizeMode="contain"
                />


                <View>
                    <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setActive(active + 1)
                        }}>
                            <Text style={styles.buttonText}>Xác nhận đã đến điểm lấy hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    };

    //Component bốc hàng hóa
    const BocHangHoa = (props) => {
        setTitleHome(props.title)
        return (
            <View>
                <Text style={{ backgroundColor: "orange", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Điểm lấy hàng : {fromLocation.name}</Text>
                <Text style={{ backgroundColor: "green", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Trạng thái: Hoàn thành bốc hàng hóa</Text>

                <Image
                    source={{ uri: `https://rsapi.goong.io/staticmap/route?origin=${fromLocation.lat},${fromLocation.lon}&destination=${toLocation.lat},${toLocation.lon}&vehicle=car&api_key=5aqYNFbo45HBk3GB5hqCRX2FlXEBioT41FsZopYy` }}
                    style={{ width: 400, height: 300, marginTop: 50, objectFit: "fit" }}
                    resizeMode="contain"
                />

                <View>
                    <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setActive(active + 1)
                        }}>
                            <Text style={styles.buttonText}>Xác nhận hoàn thành bốc hàng hóa</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    };

    //Component đến điểm nhận hàng
    const ComeToReceiveOrder = (props) => {
        setTitleHome(props.title)

        return (
            <View>
                <Text style={{ backgroundColor: "orange", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Điểm nhận hàng: {toLocation.name}</Text>
                <Text style={{ backgroundColor: "green", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Trạng thái: Đã đến điểm nhận hàng</Text>
                <Image
                    source={{ uri: `https://rsapi.goong.io/staticmap/route?origin=${fromLocation.lat},${fromLocation.lon}&destination=${toLocation.lat},${toLocation.lon}&vehicle=car&api_key=5aqYNFbo45HBk3GB5hqCRX2FlXEBioT41FsZopYy` }}
                    style={{ width: 400, height: 300, marginTop: 50, objectFit: "fit" }}
                    resizeMode="contain"
                />


                <View>
                    <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setActive(active + 1)
                        }}>
                            <Text style={styles.buttonText}>Xác nhận đã đến điểm nhận hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };


    const [data_order, setDataOrder] = useState()



    //Component đến điểm nhận hàng
    const VerifyStatusDelivery = (props) => {
        setTitleHome(props.title)

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
                    source={{ uri: `https://rsapi.goong.io/staticmap/route?origin=${fromLocation.lat},${fromLocation.lon}&destination=${toLocation.lat},${toLocation.lon}&vehicle=car&api_key=5aqYNFbo45HBk3GB5hqCRX2FlXEBioT41FsZopYy` }}
                    style={{ width: 400, height: 300, marginTop: 50, objectFit: "fit" }}
                    resizeMode="contain"
                />

                <View>
                    <Text style={{ fontSize: 20, color: "blue", textAlign: "center" }}>Bạn giao hàng thành công không ?</Text>
                </View>

                <View>
                    <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                        <TouchableOpacity style={styles.button1} onPress={() => {
                            setActive(active + 1)
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
                        <Text style={{ color: "purple", fontWeight: "italic", fontSize: 15 }}>Chú ý: Đơn hàng khi bị hủy sẽ trả lại điểm lấy hàng !</Text>
                        <TouchableOpacity onPress={() => cancel_order()}>
                            <Text style={{ backgroundColor: "blue", color: "white", fontSize: 15, width: "fit-content", padding: 5, textAlign: "center" }}>Hủy đơn hàng</Text>
                        </TouchableOpacity>
                    </View>

                ) : ''}

            </View>
        );
    };

    const [data_user, setDataUser] = useState()
    //Component thanh toán hóa đơn
    const PaymentOrder = (props) => {
        setTitleHome(props.title)

        return (
            <View>
                <Text style={{ backgroundColor: "orange", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Điểm lấy hàng: {fromLocation.name}</Text>
                <Text style={{ backgroundColor: "orange", color: "white", padding: 5, marginTop: 20, fontSize: 20 }}>Điểm nhận hàng: {toLocation.name}</Text>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 20, color: "red" }}>Thông tin khách hàng:</Text>
                    <Text>Tên khách hàng: {data_user.fullname}</Text>
                    <Text>Email: {data_user.email}</Text>
                    <Text>Số điện thoại: {data_user.phonenumber}</Text>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text>Hóa đơn</Text>
                    <View>
                        <View>
                            <Text>Phương thức thanh toán</Text>
                            <Text>{data_order.payment_method}</Text>
                        </View>
                        <View>
                            <Text>Trạng thái thanh toán</Text>
                            <Text>{data_order.payment_status}</Text>
                        </View>
                        <View>
                            <Text>Ghi chú đơn hàng</Text>
                            <Text>{data_order.note_driver}</Text>
                        </View>
                        <View>
                            <Text>Tổng đơn hàng tạm tính: </Text>
                            <Text>{data_order.totalOrder.toLocaleString()} đ</Text>
                        </View>
                    </View>
                </View>


                {/* <View>
                    <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setActive(active + 1)
                        }}>
                            <Text style={styles.buttonText}>Xác nhận đã đến điểm lấy hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}

            </View>
        );

    }

    const content = [
        <ComeToGetOrder title="Đến điểm lấy hàng" />,
        <BocHangHoa title="Hoàn thành bốc hàng hóa" />,
        <ComeToReceiveOrder title="Đến điểm nhận hàng" />,
        <VerifyStatusDelivery title="Xác nhận trạng thái giao hàng" />,
        <PaymentOrder title="Thanh toán hóa đơn" />,
    ];



    useEffect(() => {
        const { data_user, data_order } = route.params;
        get_location(data_order.fromLocation_detail, data_order.toLocation_detail)
        setDataOrder(data_order)
        setDataUser(data_user)
    }, [])

    return (
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
                    <TouchableOpacity >
                        <Text style={{ backgroundColor: "orange", color: "white", borderRadius: 5, padding: 5, fontWeight: "bold" }}>Tiếp theo</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ marginVertical: 80, marginHorizontal: 20, marginTop: 20, backgroundColor: "white", padding: 10, borderRadius: 5 }}>
                <Stepper
                    active={active}
                    content={content}
                    onBack={() => setActive((p) => p - 1)}
                    onFinish={() => alert('Hoàn tất giao hàng')}
                    onNext={() => setActive((p) => p + 1)}
                    showButton={false}
                />
            </View>
        </View>
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