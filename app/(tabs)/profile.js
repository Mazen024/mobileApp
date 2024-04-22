import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        const userId = authenticatedUser.uid;
        try {
          const usersRef = collection(db, "users");
          const userQuery = query(usersRef, where("userId", "==", userId));
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            // Get the user data from the first document
            const userData = querySnapshot.docs[0].data();
            setUser(userData);
          } else {
            console.log("User not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // User is not authenticated
        setUser(null);
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <View>
          <Text style={styles.text}>Username: {user.name}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
        </View>
      ) : (
        <View>
          <Text>You need to sign in</Text>
          <Pressable style={styles.signOutButton} onPress={() => router.push('login')}>
            <Text style={styles.signOutButtonText}>Sign in</Text>
          </Pressable>
        </View>
        
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  signOutButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
    width: '60%', // Adjust width as needed
    alignItems: "center",
    justifyContent: "center", // Center text vertically
  },
  signOutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
