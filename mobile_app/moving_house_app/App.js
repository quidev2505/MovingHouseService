import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import DriverLogin from './Screens/Driver/DriverLogin';
import CustomerLogin from './Screens/Customer/CustomerLogin'
const Stack = createNativeStackNavigator();

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="DriverLogin" component={DriverLogin} />
          <Stack.Screen name="CustomerLogin" component={CustomerLogin} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}




export default App;
