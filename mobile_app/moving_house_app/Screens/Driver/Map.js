import React, { useState } from 'react'
import { View, Text , Button} from "react-native"
import { SafeAreaView } from "react-native";
import { WebView } from 'react-native-webview';

import { LocationManager } from "react-native";

function Map() {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const onLocationChanged = (location) => {
    setLocation(location);
  };

  const setLocationToFake = () => {
    const fakeLocation = {
      latitude: 9.960260,
      longitude: 106.082382,
    };

    LocationManager.setLocation(fakeLocation);
  };
  return (
    <>
      <View>
        <Text>Vị trí hiện tại: {location.latitude}, {location.longitude}</Text>
        <Button title="Đặt vị trí giả" onPress={setLocationToFake} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: 'http://10.0.2.2:3000/showmap' }}
        />
      </SafeAreaView>
    </>

  )
}

export default Map