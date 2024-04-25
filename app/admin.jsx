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
  Modal, // Import Modal component
} from 'react-native';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useLocalSearchParams, router } from 'expo-router';
import Item from './Item';
import AddProduct from './AddProduct';

export default function admin() {
  const { username } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false); // State for showing/hiding Add Product modal

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
      {username && (
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
      </View>
      <Pressable style={styles.addButton} onPress={() => setShowAddProductModal(true)}>
        <Text style={styles.buttonText}>Add Product</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddProductModal}
        onRequestClose={() => setShowAddProductModal(false)}
      >
        <View style={styles.modalContainer}>
          <AddProduct />
        </View>
      </Modal>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <Animated.View style={styles.itemContainer}>
            <Item
              name={item.name}
              price={item.price}
              image={item.image}
            />
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found</Text>
        }
      />
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
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    borderRadius: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width:'70%'
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
});
