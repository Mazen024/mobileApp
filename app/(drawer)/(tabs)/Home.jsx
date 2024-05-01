import React, { useEffect, useState } from 'react';
import {Text,View,StyleSheet,SafeAreaView,FlatList,Pressable,TextInput,Animated,Dimensions} from 'react-native';
import { addDoc, getDocs,where , query,collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Item from '../../Item';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '../../slider';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState({}); 
  const [addedToCart, setAddedToCart] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Products'), (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(fetchedData);
      setFilteredData(fetchedData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filteredResults = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredResults);
  }, [searchTerm, data]);

  useEffect(() => {
    if (userId) {
      const favoriteQuery = collection(db, 'Favorites');
      const unsubscribe = onSnapshot(favoriteQuery, (snapshot) => {
        const favoritesData = snapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          if (data.userId === userId) {
            acc[data.productId] = true; 
          }
          return acc;
        }, {});
        setFavorites(favoritesData);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const toggleFavorite = async (productId) => {
    if (!userId) {
      alert('Please sign in to manage your favorites');
      return;
    }

    if (favorites[productId]) {
      // Remove from favorites
      const favoriteSnapshot = await getDocs(collection(db, 'Favorites'));
      const favoriteDoc = favoriteSnapshot.docs.find(
        (doc) => doc.data().productId === productId && doc.data().userId === userId
      );
      if (favoriteDoc) {
        await deleteDoc(favoriteDoc.ref);
        setFavorites((prev) => ({ ...prev, [productId]: false }));
      }
    } else {
      await addDoc(collection(db, 'Favorites'), {
        userId,
        productId,
      });
      setFavorites((prev) => ({ ...prev, [productId]: true }));
    }
  };

  const addToCart = async (productName) => {
    try {
      if (!userId) {
        alert('Please sign in to add items to your cart');
        return;
      }
  
      // Get the product by its name
      const productQuery = query(collection(db, 'Products'), where('name', '==', productName));
      const productSnapshot = await getDocs(productQuery);
  
      if (productSnapshot.empty) {
        console.log('Product not found');
        return;
      }
  
      const productDoc = productSnapshot.docs[0]; 
      const productId = productDoc.id;
  
      const cartQuery = query(collection(db, 'Cart'), where('userId', '==', userId), where('productId', '==', productId));
      const cartSnapshot = await getDocs(cartQuery);
  
      if (!cartSnapshot.empty) {
        console.log('Product is already in the cart');
        return;
      }
        const data = {
          userId,
          productId,
          quantity: 1,
        }
      // Add the product to the cart with a quantity of 1
      await addDoc(collection(db, 'Cart'),data);
      setAddedToCart(data);
  
      console.log(`Added ${productName} to the cart`);
  
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
        <Pressable
          style={styles.cardButton}
          onPress={() => router.push('/card')}
        >
          <Ionicons name="card" size={30} color="black" />
        </Pressable>
      </View >
      <View style={styles.slider}>
      <Slider/>
      </View>
      <FlatList
        data={filteredData}
        renderItem={({ item, index }) => (
          <Animated.View
            style={[
              styles.itemContainer,
              {
                marginRight: index % 2 === 0 ? 10 : 0,
                marginLeft: index % 2 === 0 ? 0 : 10,
              },
            ]}
          >
            <Item
              name={item.name}
              price={item.price}
              image={item.imageUrl}
            />
            <View style={styles.itemActions}>
              <Pressable
                onPress={() => toggleFavorite(item.id)}
              >
                <Ionicons
                  name="heart"
                  size={30}
                  color={favorites[item.id] ? 'red' : 'gray'}
                />
              </Pressable>
              
              <Pressable
                style={styles.itemActions}
                onPress={() => addToCart(item.name)}
              >
                <Ionicons
                  name="add-circle"
                  size={30}
                  color={addedToCart ? 'gray' : 'red'}
                />
                {/* <Text style={styles.addCart}>
                  {addedToCart[item.name] ? 'Added to Cart' : 'Add to Cart'}
                </Text> */}
              </Pressable>
            </View>
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  slider:{
    flex: 1,
    marginBottom: 50,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: 'lightgray',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addCartButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '70%',
  },
  addCart: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  addedToCartButton: {
    backgroundColor: 'green',
  },
  cardButton: {
    marginLeft: 10,
  },
  itemContainer: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
});
