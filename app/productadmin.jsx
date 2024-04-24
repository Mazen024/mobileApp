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
  Image,
} from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useLocalSearchParams, router } from 'expo-router';
import Item from './Itemadmin';

export default function Home() {
  const { username } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const animatedValue = new Animated.Value(0); // For animations and transitions

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('productData');
        const parsedData = storedData ? JSON.parse(storedData) : [];

        const querySnapshot = await getDocs(collection(db, 'Products'));
        const fetchedData = querySnapshot.docs.map((doc) => doc.data());

        if (parsedData.length !== fetchedData.length) {
          await AsyncStorage.setItem('productData', JSON.stringify(fetchedData));
        }

        setData(fetchedData);
        setFilteredData(fetchedData);
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

  const handleRemoveTask = async (id) => {
    try {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks)); setTasks (updatedTasks);
    } catch (error) {
    console.error("Error removing task: ", error);
    }
    };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      <Pressable style={styles.signOutButton} onPress={()=> router.push('/addProduct')}>
          <Text style={styles.signOutButtonText}>add Products</Text>
      </Pressable>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View>
            <Item
              name={item.name}
              price={item.price}
              image={item.image}
            />
          </Animated.View>
        )}
        ListEmptyComponent={
          <Text>No products found</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    paddingTop: 40, 
    paddingHorizontal: 20,
  },

  item1 : { 
    marginVertical: 14,
    // width: itemWidth,
    width : '48%' ,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
  },
  productImage: {
    width: '50%',
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  productActions: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginRight: 5,
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
});
