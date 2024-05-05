import { View, Text, StyleSheet, Image , Pressable } from "react-native";
import React, { useEffect , useState } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {Feather,AntDesign,MaterialIcons,Ionicons,} from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, } from 'firebase/firestore';
import { db } from '../../firebase';

const CustomDrawerContent = (props) => {
  const pathname = usePathname();
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

  return (
<<<<<<< HEAD
    <DrawerContentScrollView style={styles.screenOptions} {...props}>
=======
    <DrawerContentScrollView {...props} 
<<<<<<< HEAD
    style = {{backgroundColor : '#fff' }}>
=======
    style = {{backgroundColor : '#fff' , borderRadius : 20}}>
>>>>>>> ea43630eb0a8c024e13568fc8996184622c23b7e
>>>>>>> d723de6c85890613f386087c42fd1bad7ffeb2eb
      <View >
        {user ? (
          <View style={styles.userInfoWrapper}>
            <Image
              source={{uri : profileImage}}
              width={90}
              height={90}
              style={styles.userImg}
            />
          <View style={styles.userName}>
            <Text style={styles.user}> Welcome </Text>
            <Text style={styles.user}> {user.name} </Text>
          </View>
        </View>
        ): (
        <View style={styles.signInPrompt}>
            <Text style={styles.promptText}>You need to sign in</Text>
            <Pressable style={styles.signInButton} onPress={() => router.push('login')}>
              <Ionicons name="log-in-outline" size={30}/>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </Pressable>
        </View>
        )
        }
      </View>
      <DrawerItem
        icon={({ color, size }) => (
          <AntDesign
            name="user"
            size={size}
            color={pathname == "/profile" ? "#fff" : "#000"}
          />
        )}
        label={"Profile"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/profile" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/profile" ? "#0a4a7c" : "#fff" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/profile");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <MaterialIcons
            name="favorite-outline"
            size={size}
            color={pathname == "/favorite" ? "#fff" : "#000"}
          />
        )}
        label={"Favourites"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/favorite" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/favorite" ? "#0a4a7c" : "#fff" }}
        onPress={() => {
          router.push("/favorite");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="settings-outline"
            size={size}
            color={pathname == "/settings" ? "#fff" : "#000"}
          />
        )}
        label={"Settings"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/settings" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/settings" ? "#0a4a7c" : "#fff" }}
        onPress={() => {
          router.push("/settings");
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />} 
    screenOptions={{headerShown: false}}
    >
      {/* <Drawer.Screen name="favorite" options={{headerShown: true}} /> */}
      {/* <Drawer.Screen name="settings" options={{headerShown: true}} /> */}
    </Drawer>
  );
}

const styles = StyleSheet.create({
  promptText: {
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 15,
    alignSelf: 'center',
    marginTop: 15,
  },
  signInButton: {
    width:"60%",
    backgroundColor: "#0a4a7c",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  screenOptions:{
    backgroundColor: 'white',
  },
  userInfoWrapper: {
    backgroundColor: 'white',
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
    resizeMode: 'contain'
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    flex:1,
    flexDirection: 'column',
    paddingHorizontal: "10%",
    paddingVertical: "5%",
  },
  user: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  promptText:{
    fontWeight: 'bold',
    fontSize: 20,
  },
  signInButton:{
    flexDirection: 'row',
    backgroundColor: 'rgba(22, 22, 22, 0.2)',
    width: '50%',
    paddingVertical: 12,
    borderRadius: 8,
    textAlign: 'center',
  },
  signInButtonText:{
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});