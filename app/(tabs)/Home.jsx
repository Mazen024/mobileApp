// import React, { useEffect, useState } from 'react';
// import {Text,View,StyleSheet,SafeAreaView,FlatList,Pressable,TextInput,Animated,Dimensions,AntDesign} from 'react-native';
// import { addDoc, getDocs, collection, onSnapshot } from 'firebase/firestore';
// import { db } from '../../firebase';
// import Item from '../Item';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { Link , useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// export default function Home() {
//   const router = useRouter();

//   const [data, setData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const animatedValue = new Animated.Value(0);
//   const [userId, setUserId] = useState(null);
//   const [addedToCart, setAddedToCart] = useState({});


//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
//       if (user) {
//         setUserId(user.uid); 
//       } else {
//         setUserId(null); 
//       }
//     });

//     return () => unsubscribeAuth();
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, 'Products'), (snapshot) => {
//       const fetchedData = snapshot.docs.map((doc) => doc.data());
//       setData(fetchedData);
//       setFilteredData(fetchedData);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const filterResults = data.filter((item) =>
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
  
//     setFilteredData(filterResults);
//   }, [searchTerm, data]);

//   const addToCart = async (productName) => {
//     try {
//       if (addedToCart[productName]) {
//         return;
//       }
  
//       if (!userId) {
//         alert('Please sign in to add items to your cart');
//         return;
//       }
  
//       const productSnapshot = await getDocs(collection(db, 'Products'));
//       const matchingProduct = productSnapshot.docs.find((doc) => doc.data().name === productName);
  
//       if (matchingProduct) {
//         const productId = matchingProduct.id;
//         await addDoc(collection(db, 'Cart'), {
//           userId: userId,
//           productId: productId,
//           quantity: 1,
//         });
//         setAddedToCart(prevState => ({
//           ...prevState,
//           [productName]: true,
//         }));
//       } else {
//         console.log('Product not found');
//       }
//     } catch (error) {
//       console.error('Error adding item to cart:', error);
//     }
//   };
  
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search products..."
//           value={searchTerm}
//           onChangeText={(text) => setSearchTerm(text)}
//         />
//         <Pressable style = {styles.cardButton} onPress={() => router.replace('/card')}>
//           <Ionicons name="card" size={30} color="black" />
//         </Pressable>
//       </View>
      
//       <FlatList
//         data={filteredData}
//         renderItem={({ item, index }) => (
//           <Animated.View
//             style={[
//               styles.itemContainer,
//               {
//                 marginRight: index % 2 === 0 ? 10 : 0,
//                 marginLeft: index % 2 === 0 ? 0 : 10,
//               },
//             ]}
//           >
//             <Item
//               name={item.name}
//               price={item.price}
//               image={item.imageUrl}
//             />
//             <Pressable
//               style={[
//                 styles.AddCartButton,
//                 addedToCart[item.name] ? styles.AddedToCartButton : null,
//               ]}
//               onPress={() => addToCart(item.name)}
//               disabled={addedToCart[item.name]}
//             >
//               <Text style={styles.AddCart}>
//                 {addedToCart[item.name] ? 'Added to Cart' : 'Add to Cart'}
//               </Text>
//             </Pressable>
//           </Animated.View>
//         )}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No products found</Text>
//         }
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   cardButton: {
//     marginLeft: 10,
//   },
//   container: {
//     flex: 1,
//     paddingTop: 40,
//     paddingHorizontal: 20,
//     backgroundColor: '#F0F0F0',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   AddCartButton: {
//     backgroundColor: 'blue',
//     padding: 5,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//     width: '70%',
//   },
//   AddCart: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   AddedToCartButton: {
//     backgroundColor: 'green', 
//   },
//   AddCartButton: {
//     backgroundColor: 'blue',
//     padding: 5,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//     width: '70%',
//   },
//   AddCart: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     borderRadius: 10,
//     borderColor: '#D1D5DB',
//     borderWidth: 1,
//     padding: 10,
//     backgroundColor: 'white',
//   },
//   itemContainer: {
//     width: (width - 60) / 2,
//     backgroundColor: '#FFFFFF',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   emptyText: {
//     textAlign: 'center',
//     fontSize: 18,
//     color: '#666',
//   },
//   AddedToCartButton: {
//     backgroundColor: 'red',
//   },  
// });
import React, { useEffect, useState } from 'react';
import {Text,View,StyleSheet,SafeAreaView,FlatList,Pressable,TextInput,Animated,Dimensions,ActivityIndicator} from 'react-native';
import { addDoc, getDocs, collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Item from '../Item';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState({}); 
  const [addedToCart, setAddedToCart] = useState({});

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
      if (addedToCart[productName]) {
        return;
      }

      if (!userId) {
        alert('Please sign in to add items to your cart');
        return;
      }

      const productSnapshot = await getDocs(collection(db, 'Products'));
      const matchingProduct = productSnapshot.docs.find(
        (doc) => doc.data().name === productName
      );

      if (matchingProduct) {
        const productId = matchingProduct.id;
        await addDoc(collection(db, 'Cart'), {
          userId,
          productId,
          quantity: 1,
        });
        setAddedToCart((prev) => ({ ...prev, [productName]: true }));
      } else {
        console.log('Product not found');
      }
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
                style={[
                  styles.addCartButton,
                  addedToCart[item.name] ? styles.addedToCartButton : null,
                ]}
                onPress={() => addToCart(item.name)}
              >
                <Text style={styles.addCart}>
                  {addedToCart[item.name] ? 'Added to Cart' : 'Add to Cart'}
                </Text>
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
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F0F0F0',
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
