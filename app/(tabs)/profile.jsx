// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';
// import { Pressable, StyleSheet } from "react-native";
// import React, { useEffect, useState } from "react";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../../firebase";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { router } from "expo-router";

// const Profile = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
//       if (authenticatedUser) {
//         const userId = authenticatedUser.uid;
//         try {
//           const usersRef = collection(db, "users");
//           const userQuery = query(usersRef, where("userId", "==", userId));
//           const querySnapshot = await getDocs(userQuery);
//           if (!querySnapshot.empty) {
//             // Get the user data from the first document
//             const userData = querySnapshot.docs[0].data();
//             setUser(userData);
//           } else {
//             console.log("User not found");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       } else {
//         // User is not authenticated
//         setUser(null);
//       }
//     });

//     // Clean up the subscription
//     return () => unsubscribe();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {user ? (
//         <View>
//           <Text style={styles.text}>Username: {user.name}</Text>
//           <Text style={styles.text}>Email: {user.email}</Text>
//           <Text style={styles.text}>Email: {user.password}</Text>
//           {/* <Text style={styles.text}>Email: {user.}</Text> */}
//         </View>
//       ) : (
//         <View>
//           <Text>You need to sign in</Text>
//           <Pressable style={styles.signOutButton} onPress={() => router.push('login')}>
//             <Text style={styles.signOutButtonText}>Sign in</Text>
//           </Pressable>
//         </View>
        
//       )}
//     </View>
//   );
// };

// export default Profile;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "lightgray",
//   },
//   text: {
//     fontSize: 20,
//     marginBottom: 10,
//   },
//   signOutButton: {
//     backgroundColor: "blue",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginTop: 15,
//     width: '60%', // Adjust width as needed
//     alignItems: "center",
//     justifyContent: "center", // Center text vertically
//   },
//   signOutButtonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Pressable, StyleSheet , Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { router } from 'expo-router';
import logo from '../../assets/images/pngwing.com.png';

const Profile = () => {
  const [user, setUser] = useState(null);

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
          } else {
            console.log('User not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.userInfo}>
          <Image source= {logo} resizeMode="contain" style={styles.logo} />
          <Text style={styles.text}>Username: {user.name}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Pressable style={styles.signOutButton} onPress={() => router.push('login')}>
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

export default Profile;

const styles = StyleSheet.create({
  logo: {
    marginTop : 30 ,
    marginBottom : 90,
    marginleft :9 ,
    width: '50%', 
    height: '30%',
    alignItems: 'left',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // Light gray with a slight blue tone
    padding: 20,
  },
  userInfo: {
    alignItems: 'center',
    borderRadius: 10, // Rounded corners for a softer look
    backgroundColor: '#FFFFFF', // White background for the info section
    padding: 20, // Extra padding for a more substantial feel
  },
  text: {
    fontSize: 22, // Slightly larger for better readability
    color: '#1F2937', // Dark gray for a modern look
    marginBottom: 15, // Increased spacing
  },
  signOutButton: {
    backgroundColor: '#EF4444', // Red for sign-out to indicate caution
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8, // Larger radius for smoother corners
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInPrompt: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Consistent with userInfo background
    borderRadius: 10,
    padding: 20,
  },
  promptText: {
    fontSize: 20,
    color: '#1F2937', // Consistent dark gray
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: '#3B82F6', // Bright blue for sign-in
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
