import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { db } from '../firebase';
import { doc, getDoc, getDocs, collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        const userId = authenticatedUser.uid;
        setUserId(userId);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      const q = query(collection(db, 'Cart'), where('userId', '==', userId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            productId: data.productId,
            quantity: data.quantity,
          });
        });
        setCartItems(items);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const deleteCartItem = async (productId) => {
    try {
      const cartQuery = query(collection(db, 'Cart'), where('productId', '==', productId));
      const cartSnapshot = await getDocs(cartQuery);  
      cartSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItem
            key={item.productId}
            productId={item.productId}
            quantity={item.quantity}
            onDelete={() => deleteCartItem(item.productId)}
          />
        )}
        keyExtractor={(item) => item.productId}
        ListEmptyComponent={<Text>Your cart is empty</Text>}
      />
    </View>
  );
}

function CartItem({ productId, quantity, onDelete }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const productRef = doc(db, 'Products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          console.log("Product not found for productId:", productId);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    getProduct();
  }, [productId]);

  if (!product) {
    return null;
  }

  return (
    <View style={styles.cartItem}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.price}>Price: ${product.price}</Text>
      <Text style={styles.quantity}>Quantity: {quantity}</Text>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#dedede',
  },
  text: {
    fontSize: 32,
    marginBottom: 10,
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  image: {
    width: '50%',
    height: 200,
    left:10,
    borderRadius: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
