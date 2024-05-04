import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc  } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({}); 
  const [currentlyEditing, setCurrentlyEditing] = useState(null);

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
  
            // Initialize formData with expected keys to avoid undefined values
            setFormData({
              name: userData.name || '',
              email: userData.email || '',
              age: userData.age || '',
              gender: userData.gender || '',
              city: userData.city || '',
            });
  
            if (userData.image) {
              setProfileImage(userData.image);
            }
          } else {
            console.warn('User not found');
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
          query(collection(db, 'users'), where('userId', '==', user.uid))
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
      console.log('Image selection canceled or URI not present');
    }
  };

  // // const handleSaveChanges = async () => {
  // //   if (!user) return;
  
  // //   try {
  // //     const querySnapshot = await getDocs(
  // //       query(collection(db, 'users'), where('userId', '==', user.uid))
  // //     );
  // //     if (querySnapshot.empty) {
  // //       alert('User not found.');
  // //       return;
  // //     }
  
  // //     const docRef = querySnapshot.docs[0].ref;
  
  // //     const updateData = {};
  // //     ['name', 'email', 'age', 'gender', 'city'].forEach((field) => {
  // //       if (user[field] !== formData[field]) {
  // //         updateData[field] = formData[field];
  // //       }
  // //     });
  
  // //     if (Object.keys(updateData).length > 0) {
  // //       await updateDoc(docRef, updateData);
  // //       setUser({ ...user, ...updateData }); // Update user data locally
  // //       Alert.alert('Success', 'Profile updated successfully');
  // //     }
  
  // //     setCurrentlyEditing(null); // Exit edit mode
  // //   } catch (error) {
  // //     console.error('Error updating user document:', error);
  // //   }
  // // };
  // const handleSaveChanges = async () => {
  //   if (!user || !formData) return;
  
  //   try {
  //     const querySnapshot = await getDocs(
  //       query(collection(db, 'users'), where('userId', '==', user.uid))
  //     );
  //     if (querySnapshot.empty) {
  //       console.warn('User not found');
  //       return;
  //     }
  
  //     const docRef = querySnapshot.docs[0].ref;
  
  //     const updateData = {};
  //     ['name', 'email', 'age', 'gender', 'city'].forEach((field) => {
  //       if (formData[field] !== undefined && user[field] !== formData[field]) {
  //         updateData[field] = formData[field];
  //       }
  //     });
  
  //     if (Object.keys(updateData).length > 0) {
  //       await updateDoc(docRef, updateData);
  //       setUser({ ...user, ...updateData }); // Update user data locally
  //       Alert.alert('Success', 'Profile updated successfully');
  //     }
  
  //     setCurrentlyEditing(null); // Exit edit mode
  //   } catch (error) {
  //     console.error('Error updating user document:', error);
  //   }
  // };
  
  const handleSaveChanges = async () => {
    if (!user) {
      console.error('User object is undefined');
      Alert.alert('Error', 'User data is missing');
      return;
    }

    if (!formData.name || !formData.email) {
      console.error('Required fields are undefined');
      Alert.alert('Error', 'Required fields are missing');
      return;
    }

    try {
      const userId = user.userId;
      if (!userId) {
        console.error('User ID is undefined');
        return;
      }

      const userQuery = query(collection(db, 'users'), where('userId', '==', userId)); // Check userId is not undefined
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.empty) {
        alert('User not found.');
        return;
      }

      const docRef = querySnapshot.docs[0].ref;

      await updateDoc(docRef, {
        name: formData.name,
        email: formData.email,
        age: formData.age || '', // Ensure field is not undefined
        gender: formData.gender || '', // Ensure field is not undefined
        city: formData.city || '', // Ensure field is not undefined
      });

      setUser(formData); // Update user data
      setCurrentlyEditing(false); // Disable editing mode
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating user document:', error);
    }
  };

  if (!user) {
    return (
      <View style={styles.signInPrompt}>
        <Text style={styles.promptText}>Please sign in</Text>
        <Pressable style={styles.signInButton} onPress={() => {'login'}}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
    {user ? (
      <View style={styles.profileBox}>
        <View style={styles.imageContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../../assets/images/th.jpg')}
            style={styles.profileImage}
          />
          <Pressable onPress={handleImageUpload} style={styles.cameraIcon}>
            <Ionicons name="camera" size={24} color="white" />
          </Pressable>
        </View>

        <View style={styles.userInfo}>
          {['name', 'email', 'age', 'gender', 'city'].map((field) => (
            <View key={field} style={styles.fieldContainer}>
              {currentlyEditing === field ? (
                <TextInput
                  style={styles.input}
                  value={formData[field]}
                  onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  onBlur={() => setCurrentlyEditing(null)} // Exit edit mode when focus is lost
                />
              ) : (
                <Text style={styles.userText}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}: {user[field]}
                </Text>
              )}
              <Pressable
                style={styles.editIcon}
                onPress={() => setCurrentlyEditing(field)} // Start editing this field
              >
                <Ionicons name="create-outline" size={24} color="gray" />
              </Pressable>
            </View>
          ))}
        </View>

        {currentlyEditing && (
          <Pressable style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        )}
      </View>
    ) : (
      <View style={styles.signInPrompt}>
        <Text style={styles.promptText}>Please sign in</Text>
        <Pressable style={styles.signInButton} onPress={() => {'login'}}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </Pressable>
      </View>
    )}
  </View>

  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  editIcon: {
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  profileBox: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
  userInfo: {
    alignItems: 'center',
    padding: 20,
  },
  userText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  input: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 18,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signInPrompt: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  promptText: {
    fontSize: 18,
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
    fontWeight: 'bold',
    fontSize: 18,
  },
    fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  editIcon: {
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Profile;
