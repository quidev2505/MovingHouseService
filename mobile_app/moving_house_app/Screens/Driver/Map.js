import React from 'react'
import { View, Text } from "react-native"
import { SafeAreaView } from "react-native";
import { WebView } from 'react-native-webview';

function Map() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'http://10.0.2.2:3000/' }}
      />
    </SafeAreaView>
  )
}

export default Map