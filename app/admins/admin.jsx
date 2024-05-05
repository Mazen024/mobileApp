import React from 'react';
import { StyleSheet, View, Text, Pressable, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';

const Home = () => {
  const handleUsersPress = () => {
    router.push('./adminUsers');
  };

  const handleProductsPress = () => {
    router.push('./adminProduct');
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/back.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Admin Dashboard</Text>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleUsersPress}>
            <Text style={styles.buttonText}>Manage Users</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleProductsPress}>
            <Text style={styles.buttonText}>Manage Products</Text>
          </Pressable>
        </View>
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  button: {
    backgroundColor: 'rgba(71, 99, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: 'rgba(71, 99, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
