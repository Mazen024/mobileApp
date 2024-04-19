import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useLocalSearchParams, router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";

const TodoListScreen = () => {
  const { userId , username} = useLocalSearchParams();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, "Todos"), where("userId", "==", userId)));
        const fetchedTodos = [];

        querySnapshot.forEach((doc) => {
          fetchedTodos.push({ id: doc.id, ...doc.data() });
        });

        setTodos(fetchedTodos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, [userId]);

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // Redirect to login screen after sign out
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleCompleted = (todoId) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your To-Do List</Text>
      <Text>Hello {username}</Text>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, item.completed ? styles.completedButton : styles.incompleteButton]}
                onPress={() => toggleCompleted(item.id)}
              >
                <Text style={styles.buttonText}>
                  {item.completed ? "Completed" : "Incomplete"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No Todos</Text>}
      />
      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </Pressable>
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
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  completedButton: {
    backgroundColor: "green",
  },
  incompleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 20,
  },
  signOutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TodoListScreen;
