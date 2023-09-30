import { Text, View, TextInput, Alert, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";

export default function DriverLogin() {

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstName: '',
            lastName: ''
        }
    });
    const onSubmit = data => console.log(data);

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>

            <View style={{ padding: 20, alignItems: "center", flex: 1, justifyContent: "center" }}>

                <View style={{ backgroundColor: "white", borderRadius: 5, padding: 10, marginBottom: 30 }}>
                    <Text style={{ fontSize: 50, color: "black" }}>Đăng nhập</Text>
                    <Text style={{ fontSize: 20, color: "black" }}>(Tài xế)</Text>
                </View>



                <Controller
                    control={control}
                    rules={{
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
                {errors.username && <Text>Không được để trống !</Text>}

                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="password"
                />
                {errors.username && <Text>Không được để trống !</Text>}


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
});
