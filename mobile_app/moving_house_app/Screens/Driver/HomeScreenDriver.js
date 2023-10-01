import React from 'react'
import { View, Text } from "react-native"
import { Icon } from "@rneui/base";

function HomeScreenDriver({ navigation }) {

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View style={{ marginTop: 50, display:"flex", flexDirection:"row", backgroundColor:"orange",padding:5, borderRadius:5}}>
        <Text>Tài xế</Text>
        <Icon
          style={{marginLeft:300}}
          color="black"
          containerStyle={{}}
          disabledStyle={{}}
          iconProps={{}}
          iconStyle={{}}
          name="logout"
          onLongPress={() => console.log("onLongPress()")}
          onPress={() => navigation.navigate('DriverLogin')}
          size={25}
          type="material"
        />
      </View>
    </View>
  )
}

export default HomeScreenDriver