import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';

import DriverLogin from './Screens/Driver/DriverLogin';
import HomeScreenDriver from './Screens/Driver/HomeScreenDriver';

import CustomerLogin from './Screens/Customer/CustomerLogin'
import HomeScreenCustomer from './Screens/Customer/HomeScreenCustomer';
import OrderDetailCustomer from './Screens/Customer/OrderDetail/OrderDetailCustomer';
const Stack = createNativeStackNavigator();

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

//Tài xế
import OrderDetailDriver from './Screens/Driver/OrderDetail/OrderDetailDriver';
import OrderDetail from './Screens/Driver/OrderDetail/OrderDetail';
import ContactCustomer from './Screens/Driver/StepDelivery/ContactCustomer';
import StepByStep from './Screens/Driver/StepDelivery/StepByStep';


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
          {/* End Driver */}

          {/* Customer */}
          <Stack.Screen name="CustomerLogin" component={CustomerLogin} />
          <Stack.Screen name="HomeScreenCustomer" component={HomeScreenCustomer} />

          {/* Chi tiết đơn hàng khách hàng */}
          <Stack.Screen name="OrderDetailCustomer" component={OrderDetailCustomer} />

          {/* End Customer */}

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}




export default App;
