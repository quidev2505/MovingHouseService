import React, { useState, useEffect } from 'react'
import { View, Text, Button, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native";
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local


function OrderTracking({ route, navigation }) {
    const [orderId, setOrderId] = useState()
    const [navigate_ori, setNavigateOri] = useState("");


    useEffect(() => {
        /* 2. Get the param */
        const { status, order_id } = route.params;
        setNavigateOri(status)
        setOrderId(order_id)
    }, [])

    const back = () => {
        navigation.navigate(navigate_ori)
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
                        <Text style={{ fontSize: 20 }}>Theo dõi đơn hàng</Text>
                        <Text></Text>
                    </View>
                </View>
                <WebView
                    source={{ uri: `http://10.0.2.2:3000/map_navigation_customer/${orderId}` }}
                />
            </SafeAreaView>

        </>

    )
}

export default OrderTracking