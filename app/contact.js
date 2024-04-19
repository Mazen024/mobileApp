import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

const contact = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contact Page</Text>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.link}>Go Back</Text>
      </Pressable>
    </View>
  );
};

export default contact;

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
  button: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "midnightblue",
    marginVertical: 10,
  },
});
