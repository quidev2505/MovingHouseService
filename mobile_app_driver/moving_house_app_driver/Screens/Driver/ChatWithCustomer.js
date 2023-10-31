import React, { useState, useEffect } from 'react'
import { View, Text, Button, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native";
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { Input, Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local

import { db } from "./config"
import { ref, set, get, child, getDatabase } from "firebase/database"

function ChatWithCustomer({ route, navigation }) {
    const [orderId, setOrderId] = useState()
    const [navigate_ori, setNavigateOri] = useState("");
    const [driverName, setDriverName] = useState("");
    const [customerName, setCustomerName] = useState("");


    //Tìm kiếm theo mã đơn hàng
    const [inputChat, setInputChat] = useState("")


    useEffect(() => {
        /* 2. Get the param */
        const { status, order_id, customer_name, driver_name } = route.params;
        setNavigateOri(status)
        setOrderId(order_id)
        setDriverName(driver_name)
        setCustomerName(customer_name)

        //Gọi tin nhắn
        setInterval(() => {
            call_mess(order_id)
        }, 1200)

    }, [])

    const [domMess, setDomMess] = useState()

    //Hàm gọi tin nhắn
    const call_mess = (order_id) => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `chatTogether/${order_id}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data_get = snapshot.val()
                const arrValueResult = []
                for (let key in data_get) {
                    const arrValue = data_get[key];
                    arrValueResult.push(arrValue)
                }

                const DOM = arrValueResult.map((item, index) => {
                    return (

                        <View style={{ marginBottom: 10, marginTop: 3 }}>
                            <View style={{ marginLeft: item.role == "driver" ? "60%" : "5%", backgroundColor: item.role == "driver" ? "rgb(137, 198, 244)" : "#fff", borderRadius: 10, padding: 5, width: 150 }}>
                                <Text style={{ borderRadius: 10, width: 100, padding: 10, fontSize: 17 }}>{item.content}</Text>
                                <Text style={{ fontSize: 12, paddingLeft: 10 }}>{item.time}</Text>
                            </View>
                        </View>


                    )
                })

                setDomMess(DOM)
            }
            else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }


    const back = () => {
        navigation.navigate('StepByStep')
    }

    const sendMess = () => {
        //Thiết lập thời gian
        const timeNow = Date.now()

        const timeSolve = new Date()
        set(ref(db, 'chatTogether/' + orderId + '/' + timeNow), {
            role: 'driver',
            content: inputChat,
            senderName: customerName,
            time: `${timeSolve.getHours()}:${timeSolve.getMinutes()} - ${timeSolve.getDate()}/${timeSolve.getMonth() + 1}/${timeSolve.getFullYear()}`
        });


        setInputChat("")
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <View style={{ display: "flex", flexDirection: "row", height: 90, backgroundColor: "white", justifyContent: "space-between", padding: 10, paddingTop: 50 }}>
                        <Ionicons
                            onPress={() => back()}
                            name="arrow-back-sharp"
                            size={25}
                            color="green"
                        />
                        <Text style={{ fontSize: 20 }}>Khách hàng: {customerName}</Text>
                        <Text></Text>
                    </View>
                </View>
                <ScrollView>
                    <View style={{ marginTop: 5, marginBottom:80}}>

                        {domMess}

                    </View>
                </ScrollView>
                <View style={{ position: "absolute", bottom: 0 }}>
                    {/* Ô nhập tìm kiếm theo mã đơn hàng */}
                    <View style={{ display: "flex", flexDirection: "row", padding: 10, alignItems: "center", justifyContent: "center", width: 320, height: 40, margin: 20, marginLeft: 25, marginTop: 30 }}>
                        <View style={{ backgroundColor: "white", display: "flex", flexDirection: "row", alignItems: "center", borderRadius: 20 }}>
                            <Input
                                value={inputChat}
                                onChangeText={(e) => setInputChat(e)}
                                placeholder='Nhập vào tin nhắn...'
                            />
                            <TouchableOpacity style={{ lineHeight: 60, borderColor: "#ccc", marginLeft: 15, marginBottom: -10, opacity: inputChat !== '' ? 1 : 0.2 }} onPress={() => sendMess()}>
                                <Ionicons
                                    style={{ color: "black" }}
                                    name="send-sharp"
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>

        </>

    )
}

export default ChatWithCustomer