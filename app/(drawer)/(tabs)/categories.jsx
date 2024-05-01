// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../../../firebase';
// import { useRouter } from 'expo-router';

// export default function Categories() {
//   const router = useRouter();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productCollection = collection(db, 'Products');
//         const productSnapshot = await getDocs(productCollection);
//         const products = productSnapshot.docs.map((doc) => doc.data());
        
//         setProducts(products);
        
//         // Create a unique set of categories from the products
//         const uniqueCategories = [
//           ...new Set(products.map((product) => product.name)), // Example categorization by 'brand'
//         ];
        
//         setCategories(uniqueCategories);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerText}>Select a Category</Text>
//       {categories.map((category, index) => (
//         <Pressable
//           key={index}
//           style={styles.categoryButton}
//           onPress={() => router.push(`/products/category/${category}`)}
//         >
//           <Text style={styles.categoryText}>{category}</Text>
//         </Pressable>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'lightgray',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'lightgray',
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   categoryButton: {
//     backgroundColor: 'midnightblue',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginVertical: 10,
//   },
//   categoryText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });
