import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        const userId = authenticatedUser.uid;
        try {
          const usersRef = collection(db, 'users');
          const userQuery = query(usersRef, where('userId', '==', userId));
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUser(userData);
            // Set the profile image if it exists in the user data
            if (userData.image) {
              setProfileImage(userData.image);
            }
          } else {
            console.log('User not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setProfileImage(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const imageResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!imageResult.canceled && imageResult.assets[0].uri) {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, 'users'), where('name', '==', user.name))
        );
        if (querySnapshot.empty) {
          alert('User not found.');
          return;
        }

        const docRef = querySnapshot.docs[0].ref;

        await updateDoc(docRef, {
          image: imageResult.assets[0].uri,
        });

        setProfileImage(imageResult.assets[0].uri);
      } catch (error) {
        console.error('Error updating user document:', error);
      }
    } else {
      console.log('Image selection canceled or URI not present:', imageResult);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.userInfo}>
          <View style={styles.imageContainer}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../../assets/images/th.jpg')}
              style={styles.profileImage}
            />
            <Pressable onPress={handleImageUpload} style={styles.cameraIcon}>
              <Ionicons name="camera" size={24} color="white" />
            </Pressable>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.username}>Name:{user.name}</Text>
            <Text style={styles.email}>Email:{user.email}</Text>
          </View>
          <Pressable style={styles.signOutButton} onPress={() => router.replace('login')}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.signInPrompt}>
          <Text style={styles.promptText}>You need to sign in</Text>
          <Pressable style={styles.signInButton} onPress={() => router.push('login')}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 40,
  },
  userInfo: {
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 75,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -1,
    right: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 2,
  },
  infoContainer: {
    marginBottom: 20,
    height:"70%"
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInPrompt: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  promptText: {
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;