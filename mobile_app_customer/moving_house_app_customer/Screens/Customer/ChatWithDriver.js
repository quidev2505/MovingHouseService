import React, { useState, useEffect } from 'react'
import { View, Text, Button, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native";
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local

import { db } from './config';
import { ref, set, get, child, getDatabase, update,push } from 'firebase/database'

function ChatWithDriver({ route, navigation }) {
    const [orderId, setOrderId] = useState()
    const [navigate_ori, setNavigateOri] = useState("");
    const [driverName, setDriverName] = useState("");
    const [customerName, setCustomerName] = useState("");




    useEffect(() => {
        /* 2. Get the param */
        const { status, order_id, customer_name, driver_name } = route.params;
        setNavigateOri(status)
        setOrderId(order_id)
        setDriverName(driver_name)
        setCustomerName(customer_name)
    }, [])

    const back = () => {
        navigation.navigate(navigate_ori)
    }


    const testThu = () => {
        set(ref(db, 'posts/' + orderId),
            [{
                'qui': 'ok nha'
            }]
        )
    }

    const them = () => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `posts/${orderId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data_get = snapshot.val()

                const ob_data = {
                    'tinh3': 'du lieu moi'
                }

                const arr = [data_get, ob_data]

                // Get a key for a new Post.
                const newPostKey = push(child(ref(db), 'posts')).key;

                // Write the new post's data simultaneously in the posts list and the user's post list.
                const updates = {};
                updates['/posts/' + newPostKey] = arr;

                update(ref(db), updates);
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

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
                        <Text style={{ fontSize: 20 }}>{driverName}</Text>
                        <Text></Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={() => testThu()}>
                        <Text>Xác nhận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => them()} style={{ marginTop: 50 }}>
                        <Text>Thêm</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

        </>

    )
}

export default ChatWithDriver