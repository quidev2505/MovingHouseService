import React from 'react'
import { View, Text } from "react-native"
import { Icon } from "@rneui/base";
import AsyncStorage from '@react-native-async-storage/async-storage'; //Lưu vào local


function HomeScreenDriver({ navigation }) {
  const log_out_local = async () => {
    try {
      await AsyncStorage.removeItem('already_login_driver')
      navigation.navigate("DriverLogin")
    } catch (e) {
      // remove error
      console.log(e)
    }

    console.log('Done.')
  }


  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View style={{ marginTop: 50, display: "flex", flexDirection: "row", backgroundColor: "orange", padding: 5, borderRadius: 5 }}>
        <Text>Tài xế</Text>
        <Icon
          style={{ marginLeft: 300 }}
          color="black"
          containerStyle={{}}
          disabledStyle={{}}
          iconProps={{}}
          iconStyle={{}}
          name="logout"
          onLongPress={() => console.log("onLongPress()")}
          onPress={() => log_out_local()}
          size={25}
          type="material"
        />
      </View>
    </View>
  )
}

export default HomeScreenDriver