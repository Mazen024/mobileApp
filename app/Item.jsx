import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet , Image , Dimensions , ScrollView , SafeAreaView , TextInput} from 'react-native';
import {addDoc,getDocs,where,query,collection,onSnapshot,deleteDoc,} from 'firebase/firestore';
import { db } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


export default function Item({ name, price, image, productId }) {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [addedToCart, setAddedToCart] = useState(true);
  const [products, setProducts] = useState([]);

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
      setLoading(false);
      setProducts(fetchedData);
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
      const favoriteSnapshot = await getDocs(collection(db, 'Favorites'));
      const favoriteDoc = favoriteSnapshot.docs.find(
        (doc) =>
          doc.data().productId === productId && doc.data().userId === userId
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

  const toggleCart = async (productId) => {
    try {
      if (!userId) {
        alert('Please sign in to add items to your cart');
        return;
      }

      const cartQuery = query(
        collection(db, 'Cart'),
        where('userId', '==', userId),
        where('productId', '==', productId)
      );
      const cartSnapshot = await getDocs(cartQuery);

      if (!cartSnapshot.empty) {
        const cartDoc = cartSnapshot.docs[0];
        await deleteDoc(cartDoc.ref);
        setAddedToCart((prev) => ({ ...prev, [productId]: false }));
      } else {
        const data = {
          userId,
          productId,
          quantity: 1,
        };
        await addDoc(collection(db, 'Cart'), data);
        setAddedToCart((prev) => ({ ...prev, [productId]: true }));
      }

    } catch (error) {
      console.error('Error toggling cart:', error);
    }
  };

  return (
    <View style={styles.item}>
      <View style={styles.itemActions}>
      <Pressable onPress={() => toggleFavorite(productId)}>
        <Ionicons
          name="heart-outline"
          size={30}
          color={favorites[productId] ? '#0a4a7c' : 'lightgray'}
        />
      </Pressable>
      </View>
      <Pressable onPress={() => router.push(`/pressedItem?productId=${productId}`)}>
        <Image source={{ uri: image }} style={styles.image} />
      </Pressable>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
      <Pressable
      style={styles.itemActions}
      onPress={() => toggleCart(productId)}
    >
      <Ionicons
        name="cart-outline"
        size={30}
        color={addedToCart[productId] ? '#0a4a7c' : 'lightgray'}
      />
    </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
  },
  image: {
    resizeMode: "contain",
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  infoContainer: {
    // flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    height: 45,
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
});
