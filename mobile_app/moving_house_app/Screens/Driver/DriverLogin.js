import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import AwesomeAlert from 'react-native-awesome-alerts';
import { useState } from "react";
import axios from "axios";
import api_url from "../../api_url";


export default function DriverLogin({ navigation }) {
    const [alertState, setAlertState] = useState(false)
    const [mess, setMess] = useState("Đăng nhập thành công !")

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    //Khi xác nhận Form
    const onSubmit = async (data) => {
        if (data) {
            await axios.post(`${api_url}/v1/driverAccount/login`, data).then((data_login) => {
                setAlertState(true)
                setMess("Đăng nhập thành công !")
                navigation.navigate('HomeScreenDriver')
            }).catch((e) => {
                setAlertState(true)
                setMess("Đăng nhập thất bại ! Sai tên tài khoản hoặc mật khẩu !")
            })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ backgroundColor: "red", position: "absolute", zIndex: 999, top: 50, left: 10, borderRadius: 5, padding: 5, backgroundColor: "white", width: 100 }}>

            </View>

            <View style={{ padding: 20, alignItems: "center", flex: 1, justifyContent: "center" }}>

                <Image
                    source={{ uri: 'https://img.freepik.com/free-vector/flat-design-house-moving-illustration-with-charaters_23-2148655568.jpg?size=626&ext=jpg&ga=GA1.1.1312927055.1692028866&semt=ais' }}
                    style={{ width: 500, height: 500, marginTop: -200, objectFit: "contain" }}
                    resizeMode="contain"
                />


                <View style={{ backgroundColor: "white", borderRadius: 5, padding: 10, marginBottom: 25, marginTop: -30 }}>
                    <Text style={{ fontSize: 50, color: "black", textAlign: "center" }}>Đăng nhập</Text>
                    <Text style={{ fontSize: 30, color: "black", textAlign: "center", color: "orange" }}>( Tài xế ) </Text>
                </View>


                <View style={{ backgroundColor: "black", padding: 15, borderRadius: 5 }}>
                    <Controller
                        control={control}
                        rules={{
                            maxLength: 20,
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Tên đăng nhập"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="username"
                    />
                    {errors?.username?.type === "required" && <Text style={styles.error}>Không được để trống !</Text>}
                    {errors?.username?.type === "maxLength" && <Text style={styles.error}>Tài khoản không quá 20 kí tự !</Text>}

                    <Controller
                        control={control}
                        rules={{
                            maxLength: 6,
                            required: true,

                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                secureTextEntry={true}
                                type="password"
                                style={styles.input}
                                placeholder="Mật khẩu"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="password"
                    />
                    {errors?.password?.type === "required" && <Text style={styles.error}>Không được để trống !</Text>}
                    {errors?.password?.type === "maxLength" && <Text style={styles.error}>Mật khẩu không quá 6 kí tự !</Text>}



                    <AwesomeAlert
                        show={alertState}
                        showProgress={false}
                        title="Thông báo"
                        message={mess}
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showConfirmButton={true}
                        confirmText="Xác nhận"
                        confirmButtonColor="#DD6B55"

                        onConfirmPressed={() => {
                            setAlertState(false)
                        }}
                    />
                </View>



                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Xác nhận</Text>
                </TouchableOpacity>

            </View>


        </View>
    );
}


const styles = StyleSheet.create({
    input: {
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: 350
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
        width: 380,
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
