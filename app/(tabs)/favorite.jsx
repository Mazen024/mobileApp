import { StyleSheet, Text, View, Pressable  , TextInput} from "react-native";
import React from "react";
import { router } from "expo-router";

export default function search() {
  return (
    <View style={styles.container}>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
  },
  text: {
    fontSize: 32,
  },

  link: {
    fontSize: 22,
    color: "white",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "midnightblue",
    marginVertical: 10,
  },
});
