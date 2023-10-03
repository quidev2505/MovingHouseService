import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LoadingOrder from './StatusOrder/LoadingOrder';
import CompletedOrder from './StatusOrder/CompletedOrder';
import CancelOrder from './StatusOrder/CancelOrder';

const Tab = createMaterialTopTabNavigator();

function Order() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: 'green',
            }}
        >
            <Tab.Screen name="Đang tải" component={LoadingOrder} />
            <Tab.Screen name="Đã hoàn thành" component={CompletedOrder} />
            <Tab.Screen name="Đã hủy" component={CancelOrder} />
        </Tab.Navigator>
    );
}

export default Order;