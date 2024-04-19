import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useLocalSearchParams } from "expo-router";

import Item from "./Item";

const About = () => {
  const { email } = useLocalSearchParams();
  const { username } = useLocalSearchParams();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('productData');
        const storedProductCount = storedData ? JSON.parse(storedData).length : 0;
  
        const querySnapshot = await getDocs(collection(db, "Products"));
        const firestoreProductCount = querySnapshot.size;
  
        if (storedProductCount !== firestoreProductCount) {
          const fetchedData = querySnapshot.docs.map(doc => doc.data());
          setData(fetchedData);
          await AsyncStorage.setItem('productData', JSON.stringify(fetchedData));
        } else {
          setData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchData(); 
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.userText}>{email ? `Welcome, ${email}` : "Welcome, Guest"}</Text>
        <Text style={styles.userText}>{username ? `Welcome, ${username}` : "Welcome, Guest"}</Text>
        <FlatList
          style={styles.backYellow}
          data={data}
          renderItem={({ item }) => (
            <Item
              name={item.name}
              price={item.price}
              image={item.image}
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No Product</Text>}
        />
      </SafeAreaView>
    </View>
  );
};

export default About;

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
  emptyText: {
    fontSize: 40,
    textAlign: "center",
  },
});
