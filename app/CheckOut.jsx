import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth methods

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null); // State to hold userId

    useEffect(() => {
        const auth = getAuth(); // Get Firebase auth instance
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // If user is authenticated, set userId state
                setUserId(user.uid);
            } else {
                // If no user is authenticated, set userId state to null
                setUserId(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchCartData(userId); // Fetch cart data only if userId is available
            fetchUserData(userId); // Fetch user data only if userId is available
        }
    }, [userId]); // Run this effect whenever userId changes

    const fetchCartData = async (userId) => {
        const cartQuery = query(collection(db, 'Cart'), where('userId', '==', userId));
        const cartSnapshot = await getDocs(cartQuery);
        const items = [];
        for (const cartDoc of cartSnapshot.docs) {
            const cartData = cartDoc.data();
            const productDoc = await getDoc(doc(db, 'Products', cartData.productId));
            const productData = productDoc.data();
            if (productData) {
                items.push({
                    id: cartDoc.id,
                    name: productData.name,
                    price: productData.price,
                    image: productData.imageUrl,
                    userId: cartData.userId,
                });
            }
        }
        setCartItems(items);
    };

    const fetchUserData = async (userId) => {
        const usersQuery = query(collection(db, 'users'), where('userId', '==', userId));
        const userSnapshot = await getDocs(usersQuery);
        if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            setUserEmail(userData.email || '');
            setUserName(userData.name || '');
        }
    };

    return (
        console.log(cartItems),
        <View style={styles.container}>
            <Text style={styles.title}>Checkout</Text>
            <View style={styles.userInfoContainer}>
                <Text style={styles.userInfoLabel}>User Email:</Text>
                <Text style={styles.userInfoText}>{userEmail}</Text>
                <Text style={styles.userInfoLabel}>Name:</Text>
                <Text style={styles.userInfoText}>{userName}</Text>
            </View>
            <FlatList
                style={styles.productList}
                data={cartItems}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        <Text>{item.name}</Text>
                        <Text>{item.price} EGY</Text>
                        <Image source={{ uri: item.image }} style={styles.image} />
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 10,
        marginLeft: 'auto',
        marginBottom: 'auto',
        resizeMode: 'contain'
      },
    userInfoContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    userInfoLabel: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5,
    },
    userInfoText: {
        marginBottom: 10,
        fontSize: 16,
    },
    productList: {
        flexGrow: 1,
    },
    productItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default Checkout;
