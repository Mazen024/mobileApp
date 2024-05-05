import React from 'react';
import { StyleSheet, View, Text } from 'react-native';


const CheckOut = ({ route }) => {
    const { cartItems } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checkout</Text>
            <View style={styles.cartItemsContainer}>
                {cartItems.map(item => (
                    <View key={item.productId} style={styles.cartItem}>
                        <Text>{item.productId}</Text>
                        <Text>Quantity: {item.quantity}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    cartItemsContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default CheckOut;
