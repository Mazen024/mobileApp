import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image , Pressable , } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import {query, collection , where , onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from '../firebase'; 
import StarRating from "./StarRating";
import {addRate , deleteRate , getAverageRate , checkUserRating, getRateByUserIdAndProductId} from "./Rates";
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


export default function PressedItem( ) {
  
  const { productId } = useLocalSearchParams();
  const [itemData, setItemData] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState([]);
  const [userId, setUserId] = useState(null);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
      setUserId(authenticatedUser ? authenticatedUser.uid : null);
    });
    let unsubscribeFavorites = null; 
    if (userId) {
      const favoritesQuery = query(collection(db, 'Favorites'), where('userId', '==', userId));
      unsubscribeFavorites = onSnapshot(favoritesQuery, (snapshot) => {
        const favorites = snapshot.docs.map((doc) => ({
          productId: doc.data().productId,
        }));
      });
    }
    return () => {
      unsubscribeAuth(); 
      if (unsubscribeFavorites) {
        unsubscribeFavorites(); 
      }
    };
  }, [userId]);

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

  useEffect(() => {
    async function fetchData() {
      fetchRateByUserIdAndProductId();
      checkUserRatingStatus();
      setHasRated(hasRatedd);
      fetchProduct();
      fetchAverageRating();
    }
    fetchData();
  }, []);

  const fetchProduct = async () => {
    const fetchedProduct = await getProductById(id);
    setProduct(fetchedProduct);
  };

  const fetchRateByUserIdAndProductId = async () => {
    try {
      const fetchedRates = await getRateByUserIdAndProductId(userId, productId);
      const rateQuantities = fetchedRates.map((rate) => rate.RateQuantity);
      setRating(rateQuantities);
      console.log(rateQuantities);
    } catch (error) {
      console.error("Error fetching rates by user ID and product ID:", error);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      if (!userId) {
        alert('Please sign in to submit a rating.');
        return;
      }
      const newRate = {
        userId: userId,
        productId: productId,
        rate: rating, 
      };
      await addRate(newRate);
      await fetchAverageRating();
      await checkUserRatingStatus();
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };
  
  // const handleRatingDelete = async () => {
  //   try {
  //     if (!userId) {
  //       alert('Please sign in to delete your rating.');
  //       return;
  //     }
  
  //     await deleteRate(userId, productId);
  //     await fetchAverageRating();
  //     await checkUserRatingStatus();
  //     setRating(0);
  //   } catch (error) {
  //     console.error("Error deleting rating:", error);
  //   }
  // };
  
  // const handleRatingSubmit = async () => {
  //   try {
  //     const newRate = {
  //       userId: userId,
  //       ProductId: productId,
  //       RateQuantity: rating,
  //     };
  //     await addRate(newRate);
  //     checkUserRatingStatus();

  //     fetchAverageRating();
  //     setHasRated(true);
  //   } catch (error) {
  //     console.error("Error submitting rating:", error);
  //   }
  // };

  const handleRatingDelete = async () => {
    try {
      await deleteRate(userId, productId);
      fetchAverageRating();
      checkUserRatingStatus();
      setRating(0);
      setHasRated(false);
    } catch (error) {
      console.error("Error deleting rating:", error);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const avgRating = await getAverageRate(productId);
      setAverageRating(avgRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const checkUserRatingStatus = async () => {
    try {
      const hasUserRated = await checkUserRating(userId, productId);
      setHasRated(hasUserRated);
    } catch (error) {
      console.error("Error checking user rating status:", error);
    }
  };

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const docRef = doc(db, "Products", productId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          setItemData(data);
        } else {
          console.log('Item not found');
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };

    fetchItemData();
  }, [productId]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Pressable Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
         </Pressable>
        {itemData ? (
          <>
          {itemData && (
            <View style={styles.imageContainer}>
            <Image source={{ uri: itemData.imageUrl }} style={styles.image} />
            </View>
          )}
            <Text style={styles.name}>{itemData.name}</Text>
            <Text style={styles.price}>${itemData.price}</Text>

            <StarRating rating={rating} onRatingChange={setRating} />
              {hasRated ? (
                <Pressable style={styles.buttonAction} onPress={handleRatingDelete}>
                  <Text style={styles.buttonText}>Delete Rating</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.buttonAction} onPress={handleRatingSubmit}>
                  <Text style={styles.buttonText}>Submit Rating</Text>
                </Pressable>
              )}
            <Text style={{ fontWeight: "bold" }}>
              Average Rating: {averageRating}
            </Text>
            <Pressable style={styles.buttonAdd} onPress={toggleCart}>
              <Text style={styles.buttonText}>Add To Cart</Text>
            </Pressable>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
  );  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"lightgray",
      // alignItems: 'center',
      paddingTop: 30,
    },
    textContainer: {
      marginTop: 10,
      paddingHorizontal: 20 ,
    },
    name: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    price: {
      fontSize: 18,
      color: '#888',
      marginBottom: 20,
    },
    image: {
      width: '100%', 
      height: '100%', 
      borderRadius: 20,
      // marginLeft: 'auto',
      // marginBottom: 'auto',
    },
    imageContainer: {
      marginTop: 20,
      position: "relative",
      width: "100%",
      height: "40%",
    },  
    buttonAdd: {
      backgroundColor: "#636970",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 12,
      marginTop: 30,
      width: 300,
    },
    buttonAction: {
      backgroundColor: "red",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 12,
      marginTop: 30,
      marginBottom: 30,
      width: '100%',
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
    backButton: {
      position: "absolute",
      left: 10,
    },
  });
  


// import { AddProductTocart } from "../firebase/Cart";

// const ProductPage = ({ id, hasRatedd }) => {


 

  
  

//   return (
//     // <View style={styles.container}>
//     //   <View style={styles.imageContainer}>
//     //     <Pressable onPress={() => router.back()} style={styles.backButton}>
//     //       <Image
//     //         style={{ width: 25, height: 25, borderRadius: 100 }}
//     //         source={require("../assets/images/th_1.jpg")}
//     //       />
//     //     </Pressable>
//     //     <Image
//     //       style={{ width: "100%", height: "100%" }}
//     //       source={{ uri: product.photoURL }}
//     //     />
//     //   </View>
//     //   <View style={styles.productDetails}>
//     //     <Text style={styles.productName}>
//     //       {product ? product.name : "Loading..."}
//     //     </Text>
//     //     <Text style={styles.price}>Price per item: ${product.price}</Text>
//     //   </View>
      
//     </View>
//   );
// };

// const styles = StyleSheet.create({

 
  
//   productDetails: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     paddingHorizontal: 10,
//     paddingBottom: 10,
//     // marginTop:20,
//     backgroundColor: "#636970",
//     paddingTop: 7,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "white",
//   },
//   price: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "white",
//   },
  
// });

// export default ProductPage;