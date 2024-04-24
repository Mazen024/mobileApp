import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FavoritesItemCard = ({
  id,
  name,
}) => {
  return (
    <View style={styles.CardContainer}>
      <ImageBackgroundInfo
        id={id}
        name={name}
      />
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.ContainerLinearGradient}>
        <Text style={styles.DescriptionTitle}>Description</Text>
        <Text style={styles.DescriptionText}>{description}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  CardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  ContainerLinearGradient: {
    gap: 10,
    padding: 10,
  },
  DescriptionTitle: {
    fontFamily: 10,
    fontSize: 10,
    color:10,
  },
  DescriptionText: {
    fontFamily: 10,
    fontSize: 10,
    color:10,
  },
});

export default FavoritesItemCard;
