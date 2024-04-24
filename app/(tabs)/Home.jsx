// // import EditScreenInfo from '@/components/EditScreenInfo';
// // import { Text, View } from '@/components/Themed';
// // import React, { useEffect, useState } from "react";
// // import { StyleSheet, SafeAreaView, FlatList, Pressable , TextInput } from "react-native";
// // import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
// // import { collection, getDocs } from "firebase/firestore";
// // import { db } from "../../firebase";
// // import { useLocalSearchParams , router} from "expo-router";
// // import { getAuth, signOut } from "firebase/auth";
// // import Item from "../Item";

// // export default function Home() {
// //   const { userId , username} = useLocalSearchParams();
// //   const [data, setData] = useState([]);
// //   const [text, setText] = useState("");
  
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const storedData = await AsyncStorage.getItem('productData');
// //         const storedProductCount = storedData ? JSON.parse(storedData).length : 0;
        
// //         const querySnapshot = await getDocs(collection(db, "Products"));
// //         const firestoreProductCount = querySnapshot.size;
        
// //         if (storedProductCount !== firestoreProductCount) {
// //           const fetchedData = querySnapshot.docs.map(doc => doc.data());
// //           setData(fetchedData);
// //           await AsyncStorage.setItem('productData', JSON.stringify(fetchedData));
// //         } else {
// //           setData(JSON.parse(storedData));
// //         }
// //       } catch (error) {
// //         console.error("Error fetching data: ", error);
// //       }
// //     };
    
// //     fetchData(); 
// //   }, []);
  
// //   const handleSignOut = async () => {
// //     try {
// //       const auth = getAuth();
// //       await signOut(auth);
// //       router.push("/login");
// //     } catch (error) {
// //       console.error("Error signing out:", error);
// //     }
// //   };
  
// //   const [items, setItems] = useState(storedData);
// //   };  
// //   return (
// //     <View style={styles.container}>
// //       <SafeAreaView style={styles.container}>
// //         {username?(  
// //           <Pressable style={styles.signOutButton} onPress={handleSignOut}>
// //             <Text style={styles.signOutButtonText}>Sign Out</Text>
// //           </Pressable>
// //         ):(
// //           <></>
// //         )
// //         }
// //         <Text style={styles.userText}>{username ? `Welcome, ${username}` : "Welcome, Guest"}</Text>
// //         <FlatList
// //           style={styles.backYellow}
// //           data={data}
// //           renderItem={({ item }) => (
// //             <Item
// //               name={item.name}
// //               price={item.price}
// //               image={item.image}
// //             />
// //           )}
// //           ListEmptyComponent={<Text style={styles.emptyText}>No Product</Text>}
// //         />
// //       </SafeAreaView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "lightgray",
// //   },
// //   text: {
// //     fontSize: 32,
// //   },
// //   link: {
// //     fontSize: 22,
// //     color: "white",
// //   },
// //   button: {
// //     paddingVertical: 7,
// //     paddingHorizontal: 15,
// //     borderRadius: 10,
// //     backgroundColor: "midnightblue",
// //     marginVertical: 10,
// //   },
// //   emptyText: {
// //     fontSize: 40,
// //     textAlign: "center",
// //   },
// //   signOutButton: {
// //     backgroundColor: "blue",
// //     paddingVertical: 5,
// //     paddingHorizontal: 5,
// //     borderRadius: 5,
// //     marginTop: 10,
// //     left: '35%'
// //   },
// //   signOutButtonText: {
// //     color: "white",
// //     fontSize: 18,
// //     fontWeight: "bold",
// //   },
// // });
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
<<<<<<< HEAD
  Dimensions,
=======
>>>>>>> 3eccdd41ddfbb3ce1e524d722444f722e3d9ff01
} from 'react-native';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useLocalSearchParams, router } from 'expo-router';
import Item from '../Item';

<<<<<<< HEAD
const { width } = Dimensions.get('window');

=======
>>>>>>> 3eccdd41ddfbb3ce1e524d722444f722e3d9ff01
export default function Home() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Products'), (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => doc.data());
      setData(fetchedData);
      setFilteredData(fetchedData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filterResults = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filterResults);
  }, [searchTerm, data]);

  const addToCart = async (itemId) => {
    try {
      await addDoc(collection(db, 'Cart'), {
        userId: userId,
        itemId: itemId,
        quantity: 1,
      });
      console.log('Item added to cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
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
      <FlatList
        data={filteredData}
<<<<<<< HEAD
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
=======
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View>
>>>>>>> 3eccdd41ddfbb3ce1e524d722444f722e3d9ff01
            <Item
              name={item.name}
              price={item.price}
              image={item.image}
            />
<<<<<<< HEAD
            <Pressable onPress={() => addToCart(item.id)}>
              <Text>Add to Cart</Text>
            </Pressable>
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
=======
          </Animated.View>
        )}
>>>>>>> 3eccdd41ddfbb3ce1e524d722444f722e3d9ff01
        ListEmptyComponent={
          <Text>No products found</Text>
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
<<<<<<< HEAD
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
=======
>>>>>>> 3eccdd41ddfbb3ce1e524d722444f722e3d9ff01
});
