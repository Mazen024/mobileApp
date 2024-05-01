import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { db } from '../firebase'; 
import { collection, query, where, onSnapshot, deleteDoc, getDocs, getDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      const cartQuery = query(collection(db, 'Cart'), where('userId', '==', userId));
      const unsubscribe = onSnapshot(cartQuery, (snapshot) => {
        const cartData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            productId: data.productId,
            quantity: data.quantity,
          };
        });
        setCartItems(cartData);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const deleteCartItem = async (cartItemId) => {
    try {
      const cartDocRef = collection(db, 'Cart');
      const itemQuery = query(cartDocRef, where('productId', '==', cartItemId), where('userId', '==', userId));
      const snapshot = await getDocs(itemQuery);

      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
      }
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItem
            key={item.id} 
            productId={item.productId}
            quantity={item.quantity}
            onDelete={() => deleteCartItem(item.productId)} 
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Your cart is empty</Text>}
      />
    </View>
  );
}

function CartItem({ productId, quantity, onDelete }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'Products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          console.log(`Product not found for productId: ${productId}`);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
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
  title: {
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
    borderRadius: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
