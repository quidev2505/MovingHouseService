import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Divider } from '@rneui/themed';

function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "white" }}>
            <Image
                source={{ uri: 'https://img.freepik.com/free-vector/house-moving-concept-illustration_52683-45582.jpg?w=996&t=st=1696089880~exp=1696090480~hmac=03587a86c73bbc25f4027ba58bad857e0f1ff88866761cb0ce60c16589bcf592' }}
                style={{ width: 500, height:500, marginTop: -200, objectFit:"contain" }}
                resizeMode="contain"
            />

            <View style={{ marginTop: -70 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign:"center" }}>Chào mừng đến với dịch vụ dọn nhà</Text>
                <Text style={{ fontSize: 60, color: "orange" }}>FAST MOVE</Text>
            </View>
            <View style={{height:120}}>

            </View>
            <View>
                <Text style={{fontSize:23, marginBottom:25, color:"#ccc"}}>Chọn loại tài khoản của bạn</Text>
            </View>
            <View style={{marginBottom:-50}}>
                {/* Tài xế */}
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DriverLogin')}>
                    <Text style={styles.buttonText}>Tài xế</Text>
                </TouchableOpacity>
                <Divider width={1} style={{marginTop:20, marginBottom:20}}/>
                {/* Khách hàng */}
                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('CustomerLogin')}>
                    <Text style={styles.buttonText}>Khách hàng</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'orange',
        borderRadius: 10,
        padding: 10,
        width: 325
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
        textAlign:"center"
    },
});


export default HomeScreen