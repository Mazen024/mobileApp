import React, { useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import COLORS from '../constants/Colors';

const Welcome = () => {
  const router = useRouter();

  useEffect(() => {
    // Timer to navigate to Home screen after 2 seconds
    const timer = setTimeout(() => {
      router.push('/Home');
    }, 2000);

    // Clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/7515317.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* <View style={styles.container}>
        <Text style={styles.title}>Welcome to Your App</Text>
      </View> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  bodyText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Welcome;
