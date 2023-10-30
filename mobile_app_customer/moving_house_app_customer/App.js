import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';

import DriverLogin from './Screens/Driver/DriverLogin';
import HomeScreenDriver from './Screens/Driver/HomeScreenDriver';

import CustomerLogin from './Screens/Customer/CustomerLogin'
import HomeScreenCustomer from './Screens/Customer/HomeScreenCustomer';
import OrderDetailCustomer from './Screens/Customer/OrderDetail/OrderDetailCustomer';
import OrderTracking from './Screens/Customer/OrderTracking'
const Stack = createNativeStackNavigator();

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

//Tài xế
import OrderDetailDriver from './Screens/Driver/OrderDetail/OrderDetailDriver';
import OrderDetail from './Screens/Driver/OrderDetail/OrderDetail';
import ContactCustomer from './Screens/Driver/StepDelivery/ContactCustomer';
import StepByStep from './Screens/Driver/StepDelivery/StepByStep';
import DeliveryHistory from './Screens/Driver/DeliveryHistory';
import RatingHistory from './Screens/Driver/RatingHistory';
import RatingOrder from './Screens/Customer/RatingOrder/RatingOrder';
import ChatWithDriver from './Screens/Customer/ChatWithDriver';



function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />

          {/* Driver */}
          <Stack.Screen name="DriverLogin" component={DriverLogin} />
          <Stack.Screen name="HomeScreenDriver" component={HomeScreenDriver} />

          {/* Chi tiết đơn hàng tài xế */}
          <Stack.Screen name="OrderDetailDriver" component={OrderDetailDriver} />
          {/* Các bước trong quy trình giao hàng */}
          {/* Liên hệ khách hàng */}
          <Stack.Screen name="ContactCustomer" component={ContactCustomer} />
          {/* Hoàn thành giao hàng */}
          <Stack.Screen name="StepByStep" component={StepByStep} />

          {/* Chi tiết đơn hàng đã hoàn thành*/}
          <Stack.Screen name="OrderDetail" component={OrderDetail} />

          {/* Lịch sử vận chuyển*/}
          <Stack.Screen name="DeliveryHistory" component={DeliveryHistory} />

          {/* Lịch sử đánh giá*/}
          <Stack.Screen name="RatingHistory" component={RatingHistory} />
          {/* End Driver */}

          {/* Customer */}
          <Stack.Screen name="CustomerLogin" component={CustomerLogin} />
          <Stack.Screen name="HomeScreenCustomer" component={HomeScreenCustomer} />

          {/* Theo dõi đơn hàng */}
          <Stack.Screen name="OrderTracking" component={OrderTracking} />


          {/* Chat với tài xế */}
          <Stack.Screen name="ChatWithDriver" component={ChatWithDriver} />

          {/* Chi tiết đơn hàng khách hàng */}
          <Stack.Screen name="OrderDetailCustomer" component={OrderDetailCustomer} />


          {/* Đánh giá đơn hàng đã hoàn thành*/}
          <Stack.Screen name="RatingOrder" component={RatingOrder} />
          {/* End Customer */}

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}




export default App;
