import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import Order from './Order';
import InfoCustomer from './InfoCustomer';
import { LogBox } from 'react-native';

const Tab = createBottomTabNavigator();

function HomeScreenCustomer() {
    console.disableYellowBox = true;
    //Ignore all log notifications
    LogBox.ignoreAllLogs();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'ĐƠN HÀNG') {
                        return (
                            <Ionicons
                                name="cart-outline"

                                size={size}
                                color={color}
                            />
                        );
                    } else if (route.name === 'THÔNG TIN CÁ NHÂN') {
                        return (
                            <Ionicons
                                name="person-circle-outline"
                                size={size}
                                color={color}
                            />
                        );
                    }
                },
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'green',

            })}
        >
            <Tab.Screen name="ĐƠN HÀNG" component={Order} />
            <Tab.Screen name="THÔNG TIN CÁ NHÂN" component={InfoCustomer} />
        </Tab.Navigator>

    );
}


export default HomeScreenCustomer