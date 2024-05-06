import React, { useEffect, useState } from 'react';
import {Text,View,StyleSheet,SafeAreaView,FlatList,Pressable,TextInput,Animated,Dimensions , ScrollView , SectionList } from 'react-native';
import { addDoc, getDocs,where , query,collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Item from '../../Item';
import { useRouter , Link } from 'expo-router';
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
  const [filteredLaptops, setFilteredLaptops] = useState([]);
  const [filteredPopular, setFilteredPopular] = useState([]);
  const [filteredLatest, setFilteredLatest] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [filteredAccessories , setFilteredAccessories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const latest = products.filter((item) => item.category === 'latest');
    const popular = products.filter((item) => item.category === 'popular');
    const laptops = products.filter((item) => item.category === 'laptop');
    const phones = products.filter((item) => item.category === 'phone');
    const accessories = products.filter((item) => item.category === 'accessories');

    setFilteredPopular(
      popular.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredLatest(
      latest.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredLaptops(
      laptops.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredPhones(
      phones.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredAccessories(
      accessories.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [products, searchTerm]);

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
    const unsubscribe = onSnapshot(collection(db, 'Products'), (snapshot) => {
      const fetchedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(fetchedProducts);
    });
    return () => unsubscribe();
  }, []);

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

  const toggleCart = async (productId) => {
    try {
      if (!userId) {
        alert('Please sign in to add items to your cart');
        return;
      }
  
      const cartQuery = query(collection(db, 'Cart'), where('userId', '==', userId), where('productId', '==', productId));
      const cartSnapshot = await getDocs(cartQuery);
  
      if (!cartSnapshot.empty) {
        // Remove from cart
        const cartDoc = cartSnapshot.docs[0];
        await deleteDoc(cartDoc.ref);
        setAddedToCart((prev) => ({ ...prev, [productId]: false }));
      } else {
        // Add to cart
        const data = {
          userId,
          productId,
          quantity: 1,
        }
        await addDoc(collection(db, 'Cart'), data);
        setAddedToCart((prev) => ({ ...prev, [productId]: true }));
      }
  
      console.log('Toggled ${productId} in the cart');
  
    } catch (error) {
      console.error('Error toggling cart:', error);
    }
  };
  
  const renderProduct = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemActions}>
        <Pressable onPress={() => toggleFavorite(item.id)}>
          <Ionicons
            name="heart-outline"
            size={30}
            color={favorites[item.id] ? "#0a4a7c" : 'lightgray'}
          />
        </Pressable>
      </View>
      <Item
        name={item.name}
        price={item.price}
        image={item.imageUrl}
        productId={item.id}
      />
        <Pressable style={styles.itemActions} onPress={() => toggleCart(item.id)}>
          <Ionicons
            name="cart-outline"
            size={30}
            color={addedToCart[item.id] ? "#0a4a7c" : 'lightgray'}
          />
        </Pressable>
      </View>
  );
  
  return (
    <ScrollView style={styles.scrollContainer}>
      <SafeAreaView style={styles.safeContainer}>
        {/* Header Section */}
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
        <Ionicons name="cart-outline" size={40} color="#0a4a7c" />
        </Pressable>
        </View>

        {/* Slider Section */}
        <View style={styles.slider}>
          <Slider />
        </View>

         {/* Latest products Section */}
         <View style={styles.section}>  
          <Text style={styles.sectionTitle}>Latest Products
          <Pressable  onPress={() => router.push('login')}>
          <Text style={styles.see}>see more {'>>'}</Text>
          </Pressable>        
          </Text> 
          <FlatList
            data={filteredLatest}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal={true}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Products found</Text>
            }
          />
        </View>

         {/* Most popular products Section */}
         <View style={styles.section}>  
          <Text style={styles.sectionTitle}>Most Popular
          <Pressable  onPress={() => router.push('login')}>
          <Text style={styles.see}>see more {'>>'}</Text>
          </Pressable>        
          </Text> 
          <FlatList
            data={filteredPopular}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal={true}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Products found</Text>
            }
          />
        </View>

        {/* Laptops Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Laptops 
          <Pressable  onPress={() => router.push('login')}>
          <Text style={styles.see}>see more {'>>'} </Text>
          </Pressable>        
          </Text>  
          <FlatList
            data={filteredLaptops}
            horizontal={true}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
            <Text style={styles.emptyText}>No Products found</Text>
            }
          />
        </View>

        {/* Phones Section */}
        <View style={styles.section}>  
          <Text style={styles.sectionTitle}>Phones
          <Pressable  onPress={() => router.push('login')}>
          <Text style={styles.see}>see more {'>>'}</Text>
          </Pressable>        
          </Text> 
          <FlatList
            data={filteredPhones}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal={true}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Products found</Text>
            }
          />
        </View>


         {/* Accessories Section */}
         <View style={styles.section}>  
          <Text style={styles.sectionTitle}>Accessories
          <Pressable  onPress={() => router.push('login')}>
          <Text style={styles.see}>see more {'>>'}</Text>
          </Pressable>        
          </Text> 
          <FlatList
            data={filteredAccessories}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal={true}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Products found</Text>
            }
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'left',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    borderRadius: 10,
    borderColor: "#0a4a7c",
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  safeContainer: {
    padding: 20,
  },
  slider: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items on the left
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    alignSelf: 'center',
  },
  cardButton: {
    marginLeft: 10,
  },
  itemContainer: {
    width: (width - 60) / 2,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor : 'white',
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
  see : {
    color: "#0a4a7c", 
    textDecorationLine: 'underline', 
    fontSize: 12,

    },
});