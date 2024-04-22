import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Dashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.description}>Welcome to the admin dashboard!</Text>
      {/* Add more dashboard content here */}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  // Add more styles as needed
});
