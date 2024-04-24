// // import React from 'react';
// // import { StyleSheet, Text, View, Image, Dimensions, Pressable} from 'react-native';
// // import { router } from "expo-router";

// // export default function Item({ name, price, image }) {
// //   return (
// //     <View style={styles.product}>
// //       <View >
// //         <Text style={styles.productImage}>{name}</Text>
// //         <Text style={styles.productPrice}>${price}</Text>
// //       </View>
// //       <Pressable onPress={() => router.push(`/pressedItem?name=${name}&price=${price}&image=${image}`)}>
// //         <Image source={{ uri: image }} style={styles.productImage} />
// //       </Pressable>
// //     </View>
// //   );
// // }

// // const screenWidth = Dimensions.get('window').width;

// // const styles = StyleSheet.create({
// //   product: {
// //     flex: 1,
// //     paddingTop: 40,
// //     paddingHorizontal: 20,
// //     backgroundColor: '#F0F0F0',
// //     width: '45%',
// //     backgroundColor: '#fff',
// //     marginBottom: 20,
// //     borderRadius: 4,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   productImage: {
// //     width: '100%',
// //     height: 200,
// //   },
// //   productInfo: {
// //     padding: 10,
// //   },
// //   productTitle: {
// //     fontSize: 18,
// //   },
// //   productDescription: {
// //     marginTop: 5,
// //     color: '#666',
// //   },
// //   productPrice: {
// //     marginTop: 10,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// //   priceText: {
// //     fontWeight: 'bold',
// //   },
// //   discountPrice: {
// //     textDecorationLine: 'line-through',
// //   },
// //   productRating: {
// //     marginTop: 10,
// //     flexDirection: 'row',
// //   },
// //   ratingText: {
// //     marginRight: 5,
// //   },
// //   ratingPlus: {
// //     color: '#ccc',
// //   },
// //   item: {
// //     backgroundColor: '#fff',
// //     borderRadius: 10,
// //     padding: 20,
// //     marginVertical: 5,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     width: screenWidth - 20,
// //     elevation: 3,
// //   },
// //   image: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 10,
// //   },
// //   name: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 5,
// //   },
// //   price: {
// //     fontSize: 16,
// //     color: '#888',
// //   },
// // });
// import React from 'react';
// import { StyleSheet, Text, View, Image, Dimensions, Pressable } from 'react-native';
// import { router } from "expo-router";

// const screenWidth = Dimensions.get('window').width;
// const itemWidth = (screenWidth - 40) / 2; // Calculate item width for two items per row

// export default function Item({ name, price, image }) {
//   return (
//     <Pressable
//       style={styles.item}
//       onPress={() => router.push(`/pressedItem?name=${name}&price=${price}&image=${image}`)}
//     >
//       <View style={styles.product}>
//         <Image source={{ uri: image }} style={styles.productImage} />
//         <View style={styles.productInfo}>
//           <Text style={styles.productTitle}>{name}</Text>
//           <Text style={styles.productPrice}>${price}</Text>
//         </View>
//       </View>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   item: {
//     // width: itemWidth,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 5,
//     marginHorizontal: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     width : '45%',
//     justifyContent: 'space-between',
//     elevation: 3,
//   },
//   product: {
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   productImage: {
//     width: '100%',
//     height: 150,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   productInfo: {
//     paddingHorizontal: 10,
//     flex: 1,
//   },
//   productTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   productPrice: {
//     fontSize: 14,
//     color: '#888',
//   },
// });
import React , {useState}from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 

export default function Item({ name, price, image }) {

  const rating = 4.5;
  
  const addToFavorites = (product) => {
    const [favorite, setFavorite] = useState([]);
      const addProductToFavorites = (product) => {
      setFavorite([...favorite, product]);
    };
    const handleClick = () => {
      addProductToFavorites(product);
    };
    return (
      <TouchableOpacity onPress={handleClick}>
      </TouchableOpacity>
    );
  };
  
  const addToCart = () => {
  };

  return (
  <Pressable
    style={styles.item1}
    onPress={() => router.push(`/pressedItem?name=${name}&price=${price}&image=${image}`)}
  >
    <View style={styles.item}>
      <Image source={{ uri: image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{name}</Text>
        <Text style={styles.productPrice}>${price}</Text>
        <View style={styles.productActions}>
        </View>
        <View style={styles.productRating}>
          <Text style={styles.ratingText}>{rating}</Text>
          <AntDesign name="star" size={14} color="#FFD700" />
        </View>
      </View>
    </View>
  </Pressable>
  );
}

const styles = StyleSheet.create({
  item1 : { 
    marginVertical: 14,
    // width: itemWidth,
    width : '100%' ,
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
});


