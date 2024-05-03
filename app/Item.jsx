import React from 'react';
import { StyleSheet, Text, View, Image, Pressable , Dimensions} from 'react-native';
import { router } from "expo-router";

const { width } = Dimensions.get('window');


export default function Item({ name, price, image, productId }) {
  return (
    <View style={styles.item}>
      <Pressable onPress={() => router.push(`/pressedItem?name=${name}&price=${price}&image=${image}&productId=${productId}`)}>
        <Image source={{ uri: image }} style={styles.image} />
      </Pressable>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'lightgray',
    borderRadius: 10,
    padding: 5,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  infoContainer: {
    // flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
});
