import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@rneui/themed';

import call from 'react-native-phone-call'



import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local


function ContactCustomer({ route, navigation }) {
    const [dataUser, setDataUser] = useState({})
    const [dataOrderDetail, setDataOrderDetail] = useState({});

    const [nextStep, setNextStep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataDriver, setDataDriver] = useState("")

    const handleCall = () => {
        const args = {
            number: dataUser.phonenumber, // String value with the number to call
            prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call 
            skipCanOpen: true // Skip the canOpenURL check
        }

        call(args).catch(console.error)
    };



    const call_driver = async () => {
        const value_local = await AsyncStorage.getItem('already_login_driver');
        const dataLocal = JSON.parse(value_local)
        if (dataLocal) {
            const username = dataLocal.username
            setDataDriver(username)
        }
    }

    //Lấy trạng thái ra
    const getStep = async () => {
        try {
            const step_get = JSON.parse(await AsyncStorage.getItem('stepCurrent'))
            console.log(step_get)
            if (step_get != null) {

                setNextStep(true)
            }
        } catch (e) {
            // saving error
            console.log(e)
        }
    };


    useEffect(() => {
        /* 2. Get the param */
        const { data_user, data_order } = route.params;

        getStep();

        setDataUser(data_user)
        setDataOrderDetail(data_order)

    }, [])

    //Bước kế tiếp
    const next_step = () => {
        navigation.navigate('StepByStep', { data_user: dataUser, data_order: dataOrderDetail, data_driver: dataDriver })
    }



    return (
        <ScrollView>
            <View>
                <View style={{ display: "flex", flexDirection: "row", height: 90, backgroundColor: "white", justifyContent: "space-between", padding: 10, paddingTop: 50 }}>
                    {/* <Ionicons
                        onPress={() => back()}
                        name="arrow-back-sharp"
                        size={25}
                        color="orange"
                    /> */}
                    <Text style={{ fontSize: 20 }}>Liên hệ khách hàng</Text>
                    <TouchableOpacity onPress={() => next_step()}>
                        <Text style={{ backgroundColor: "orange", color: "white", borderRadius: 5, padding: 5, fontWeight: "bold", display: nextStep ? 'flex' : 'none' }}>Tiếp theo</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <View style={{ backgroundColor: "white", borderRadius: 5, padding: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 20, color: "red" }}>Thông tin khách hàng</Text>
                    <Text style={{ fontSize: 15 }}>Tên khách hàng: {dataUser.fullname}</Text>
                    <Text style={{ fontSize: 15 }}>Email: {dataUser.email}</Text>
                </View>

                <View style={{ backgroundColor: "white", borderRadius: 5, padding: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 23 }}>Liên hệ khách hàng với số điện thoại: {"\n"} {"\n"}
                        <Ionicons
                            name="call-sharp"
                            size={35}
                            color="orange"
                        />
                        <Text style={{ fontSize: 30, color: "orange" }}>
                            {dataUser.phonenumber}
                        </Text>
                    </Text>
                    <Text style={{ fontSize: 20, marginTop: 10, padding: 10, borderWidth: 2, borderColor: "orange", borderRadius: 5 }}>
                        Lưu ý:
                        {"\n"}
                        + Cần xác nhận với khách hàng về các loại chi phí phát sinh.
                        {"\n"}
                        + Xác nhận thông tin địa chỉ, email, số điện thoại...
                    </Text>
                </View>

                <View style={{ marginTop: 290 }}>
                    <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 90, backgroundColor: "white" }}>
                        <TouchableOpacity style={styles.button} onPress={() => {

                            setLoading(true)
                            setTimeout(() => {
                                setNextStep(true)
                                setLoading(false)
                                handleCall()
                            }, 1000)
                        }}>
                            <Text style={styles.buttonText}>Liên hệ với khách hàng</Text>

                            {loading ? (<Button title="Solid" type="solid" loading color="warning" />) : ''}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
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
        backgroundColor: 'orange',
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
});


export default ContactCustomer