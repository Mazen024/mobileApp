import React from 'react';
import { StyleSheet, Text, View, Image, Pressable} from 'react-native';
import { router } from "expo-router";

export default function Item({ name, price, image }) {
  return (
    <View style={styles.item}>
      <Pressable onPress={() => router.push(`/pressedItem?name=${name}&price=${price}&image=${image}`)}>
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    // marginVertical: 5,
    // flexDirection: 'row',
    // alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 20,
  },
  infoContainer: {
    // flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
});
