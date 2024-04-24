// import React, { useEffect, useState } from "react";
// import { StyleSheet, Text, View, SafeAreaView, FlatList, Pressable } from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import { useLocalSearchParams , router} from "expo-router";
// import { getAuth, signOut } from "firebase/auth";

// import Item from "../app/(tabs)/Item";

// const About = () => {
//   const { userId , username} = useLocalSearchParams();

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const storedData = await AsyncStorage.getItem('productData');
//         const storedProductCount = storedData ? JSON.parse(storedData).length : 0;
  
//         const querySnapshot = await getDocs(collection(db, "Products"));
//         const firestoreProductCount = querySnapshot.size;
  
//         if (storedProductCount !== firestoreProductCount) {
//           const fetchedData = querySnapshot.docs.map(doc => doc.data());
//           setData(fetchedData);
//           await AsyncStorage.setItem('productData', JSON.stringify(fetchedData));
//         } else {
//           setData(JSON.parse(storedData));
//         }
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };
  
//     fetchData(); 
//   }, []);

//   const handleSignOut = async () => {
//     try {
//       const auth = getAuth();
//       await signOut(auth);
//       router.push("/login");
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.container}>
//         {username?(  
//           <Pressable style={styles.signOutButton} onPress={handleSignOut}>
//             <Text style={styles.signOutButtonText}>Sign Out</Text>
//           </Pressable>
//         ):(
//           <></>
//         )
//         }
//         <Text style={styles.userText}>{username ? `Welcome, ${username}` : "Welcome, Guest"}</Text>
//         <FlatList
//           style={styles.backYellow}
//           data={data}
//           renderItem={({ item }) => (
//             <Item
//               name={item.name}
//               price={item.price}
//               image={item.image}
//             />
//           )}
//           ListEmptyComponent={<Text style={styles.emptyText}>No Product</Text>}
//         />
//       </SafeAreaView>
//     </View>
//   );
// };

// export default About;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "lightgray",
//   },
//   text: {
//     fontSize: 32,
//   },
//   link: {
//     fontSize: 22,
//     color: "white",
//   },
//   button: {
//     paddingVertical: 7,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     backgroundColor: "midnightblue",
//     marginVertical: 10,
//   },
//   emptyText: {
//     fontSize: 40,
//     textAlign: "center",
//   },
//   signOutButton: {
//     backgroundColor: "blue",
//     paddingVertical: 5,
//     paddingHorizontal: 5,
//     borderRadius: 5,
//     marginTop: 10,
//     left: '35%'
//   },
//   signOutButtonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });
