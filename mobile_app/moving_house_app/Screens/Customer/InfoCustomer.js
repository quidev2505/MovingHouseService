import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { Icon } from "@rneui/base";
import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local
import api_url from "../../api_url";
import axios from "axios";

import { Avatar } from '@rneui/themed';

import { Ionicons } from '@expo/vector-icons';

function InfoCustomer({ navigation }) {
    const [dataCustomer, setDataCustomer] = useState({})

    //Lấy thông tin khách hàng
    const get_info_customer = async () => {
        try {
            const value_local = await AsyncStorage.getItem('already_login_customer');
            const dataLocal = JSON.parse(value_local)
            if (dataLocal) {
                const id = dataLocal._id;

                if (id) {
                    await axios.get(`${api_url}/v1/customer/get_customer_info/${id}`).then((data) => {
                        const data_customer = data.data;
                        const ob = {
                            avatar: `${api_url}/${data_customer.avatar}`,
                            fullname: data_customer.fullname,
                            address: data_customer.address,
                            gender: data_customer.gender,
                            phonenumber: dataLocal.phonenumber,
                            email: dataLocal.email
                        }

                        setDataCustomer(ob);
                    }).catch((e) => {
                        console.log(e)
                    })
                }
            }





        } catch (e) {
            // error reading value
            console.log(e)
        }
    }

    useEffect(() => {
        get_info_customer();
    }, [])


    const createTwoButtonAlert = () => {
        Alert.alert('Thông báo', 'Bạn muốn đăng xuất khỏi tài khoản ?', [
            {
                text: 'Hủy',
                style: 'cancel',
            },
            { text: 'Xác nhận', onPress: () => log_out_local() },
        ]);
    }



    const log_out_local = async () => {
        try {
            await AsyncStorage.removeItem('already_login_customer')
            navigation.navigate("CustomerLogin")
        } catch (e) {
            // remove error
            console.log(e)
        }

        console.log('Done.')
    }


    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "white" }}>
            <View style={{ marginTop: 20 }}>
                <Avatar
                    size={100}
                    rounded
                    source={{ uri: `${dataCustomer.avatar}` }}
                />
            </View>
            <Text style={{ color: "green", fontSize: 25, marginTop: 12, fontWeight: "bold" }}>{dataCustomer.fullname}</Text>


            <View style={{ marginTop: 40, width: "100%", padding: 10 }}>
                <Text style={{ backgroundColor: "green", padding: 5, borderRadius: 5, color: "white", fontSize: 19 }}>Thông tin liên hệ</Text>
                <View style={{ display: "flex", flexDirection: "row", marginTop: 15 }}>
                    <Ionicons
                        name="call-sharp"
                        size={20}
                    />
                    <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataCustomer.phonenumber}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", marginTop: 15 }}>
                    <Ionicons
                        name="transgender-sharp"
                        size={20}
                    />
                    <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataCustomer.gender}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", marginTop: 15 }}>
                    <Ionicons
                        name="mail-sharp"
                        size={20}
                    />
                    <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataCustomer.email}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", marginTop: 15 }}>
                    <Ionicons
                        name="home-sharp"
                        size={20}
                    />
                    <Text style={{ marginLeft: 10, fontSize: 17 }}>{dataCustomer.address}</Text>
                </View>
            </View>


            {/* Đăng xuất */}
            <TouchableOpacity style={styles.button} onPress={createTwoButtonAlert}>
                <Text style={styles.buttonText}>Đăng Xuất
                    &nbsp;
                    <Ionicons
                        name="log-out-outline"
                        size={35}
                        style={{ marginLeft: 10 }}
                    />
                </Text>

            </TouchableOpacity>
        </View>




    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'green',
        borderRadius: 10,
        padding: 10,
        width: 350,
        marginTop: 50,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    button2: {
        backgroundColor: 'green',
        borderRadius: 10,
        padding: 10,
        width: 325
    },
    buttonText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        textAlign: "center"
    },
});

export default InfoCustomer