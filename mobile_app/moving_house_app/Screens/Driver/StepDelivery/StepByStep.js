import React, {useState} from 'react'
import { View, Text, TouchableOpacity } from "react-native";
import Stepper from 'react-native-stepper-ui';

function StepByStep({ route, navigation }) {
    const [active, setActive] = useState(0);

    const MyComponent = (props) => {
        return (
            <View>
                <Text>{props.title}</Text>
            </View>
        );
    };

    const content = [
        <MyComponent title="Component 1" />,
        <MyComponent title="Component 2" />,
        <MyComponent title="Component 3" />,
    ];
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
                    <Text style={{ fontSize: 20 }}>Liên hệ khách hàng</Text>
                    <TouchableOpacity >
                        <Text style={{ backgroundColor: "orange", color: "white", borderRadius: 5, padding: 5, fontWeight: "bold"}}>Tiếp theo</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={{ marginVertical: 80, marginHorizontal: 20 }}>
                <Stepper
                    active={active}
                    content={content}
                    onBack={() => setActive((p) => p - 1)}
                    onFinish={() => alert('Finish')}
                    onNext={() => setActive((p) => p + 1)}
                />
            </View>
        </View>
    )
}

export default StepByStep