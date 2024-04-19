import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";

const TodoListScreen = ({ route }) => {
  const { userTodos } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your To-Do List</Text>
      <FlatList
        data={userTodos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text>{item.task}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
});

export default TodoListScreen;
