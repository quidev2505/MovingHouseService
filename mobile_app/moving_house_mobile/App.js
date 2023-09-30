import React, { useState } from "react";
import { StyleSheet, Text, TextInput, Button, View } from "react-native";
import io from "socket.io-client";
import api_url from "./api_url";

const App = () => {
  const [message, setMessage] = useState("");

  const socket = io(`${api_url}`);
  socket.on("message", onMessage);

  const onMessage = (data) => {
    setMessage(data.message);
  };

  const onSubmit = () => {
    console.log(message)
    // Gửi thông báo đến server
    socket.emit("message", {
      message: message,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập thông báo"
        onChangeText={(text) => setMessage(text)}
      />
      <Button
        style={styles.button}
        title="Gửi"
        onPress={onSubmit}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: 5,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
  },
});


export default App;