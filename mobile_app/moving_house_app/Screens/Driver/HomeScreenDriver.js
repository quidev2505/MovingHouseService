import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import Order from './Order';
import GetOrder from './GetOrder';
import InfoDriver from './InfoDriver';

import MapLocation from './MapLocation';
import { LogBox } from 'react-native';

const Tab = createBottomTabNavigator();

function HomeScreenDriver() {
  console.disableYellowBox = true;
  //Ignore all log notifications
  LogBox.ignoreAllLogs();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'NHẬN ĐƠN') {
            return (
              <Ionicons
                name="download-outline"
                size={size}
                color={color}
              />
            )
          } else if (route.name === 'ĐƠN HÀNG') {
            return (
              <Ionicons
                name="cart-outline"
                size={size}
                color={color}
              />
            );
          }
          else if (route.name === 'BẢN ĐỒ') {
            return (
              <Ionicons
                name="map-outline"
                size={size}
                color={color}
              />
            )
          }
          else if (route.name === 'THÔNG TIN CÁ NHÂN') {
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
        tabBarActiveTintColor: 'orange',

      })}
    >
      <Tab.Screen name="NHẬN ĐƠN" component={GetOrder} />
      <Tab.Screen name="ĐƠN HÀNG" component={Order} />
      <Tab.Screen name="BẢN ĐỒ" component={MapLocation} />
      <Tab.Screen name="THÔNG TIN CÁ NHÂN" component={InfoDriver} />
    </Tab.Navigator>

  );
}


export default HomeScreenDriver;