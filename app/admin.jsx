// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const storedData = await AsyncStorage.getItem('productData');
//       const parsedData = storedData ? JSON.parse(storedData) : [];

//       const querySnapshot = await getDocs(collection(db, 'Products'));
//       const fetchedData = querySnapshot.docs.map((doc) => doc.data());

//       if (parsedData.length !== fetchedData.length) {
//         await AsyncStorage.setItem('productData', JSON.stringify(fetchedData));
//       }

//       setData(fetchedData);
//       setFilteredData(fetchedData);
//     } catch (error) {
//       console.error('Error fetching data: ', error);
//     }
//   };

//   fetchData();
// }, []);



import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  TextInput,
  Animated,
} from 'react-native';
import { getDocs, collection, onSnapshot} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useLocalSearchParams, router } from 'expo-router';
import Item from './Item';

export default function Home() {
  const { username } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const animatedValue = new Animated.Value(0); // For animations and transitions

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Products'));
        const fetchedData = querySnapshot.docs.map((doc) => doc.data());
        
        setData(fetchedData);
        setFilteredData(fetchedData);
  
        const unsubscribe = onSnapshot(collection(db, 'Products'), (snapshot) => {
          const updatedData = snapshot.docs.map((doc) => doc.data());
          setData(updatedData);
          setFilteredData(updatedData);
        });
  
        // Cleanup function to unsubscribe from snapshot listener
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
  
    fetchData();
  }, []);
  
  
  useEffect(() => {
    const filterResults = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filterResults);
  }, [searchTerm, data]);

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* {username && (
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </Pressable>
      )}
      <Text style={styles.userText}>{username ? `Welcome, ${username}` : 'Welcome, Guest'}</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View> */}
      <Pressable style={styles.signOutButton} onPress={()=> router.push('/productadmin')}>
          <Text style={styles.signOutButtonText}>Products</Text>
      </Pressable>
      <Pressable style={styles.signOutButton} onPress={()=> router.push('/users')}>
          <Text style={styles.signOutButtonText}>Users</Text>
      </Pressable>
      {/* <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View style={styles.itemContainer}>
            <Item
              name={item.name}
              price={item.price}
              image={item.image}
            />
          </Animated.View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found</Text>
        }
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F0F0F0',
  },
  signOutButton: {
    backgroundColor: '#FF6347', // A vibrant red for visibility
    padding: 12, // Added padding for a more substantial button
    borderRadius: 10, // Rounded corners for style
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Increased margin for spacing
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userText: {
    fontSize: 20,
    fontWeight: 'bold', // Added font weight for emphasis
    color: '#333', // Darker text for contrast
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background for clarity
    borderRadius: 10, // Rounded corners for a soft appearance
    padding: 15, // Generous padding for comfort
    shadowColor: '#000', // Adding shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Required for shadows on Android
    marginBottom: 20, // Spacing between the search bar and the list
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    borderRadius: 10, // Matching the outer container's corners
    borderColor: '#D1D5DB', // Light gray border
    borderWidth: 1,
    padding: 10, // Comfortable padding for text input
    backgroundColor: 'white',
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15, // Increased padding for better alignment
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Required for shadows on Android
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666', // A subtle gray for the empty text
  },
});