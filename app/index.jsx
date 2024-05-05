// import React, { useEffect } from 'react';
// import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
// import { useRouter } from 'expo-router';
// import COLORS from '../constants/Colors';

// const Welcome = () => {
//   const router = useRouter();

//   useEffect(() => {
//     // Timer to navigate to Home screen after 2 seconds
//     const timer = setTimeout(() => {
//       router.push('/Home');
//     }, 3000);

//     // Clear the timer when the component unmounts
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <ImageBackground
//       source={require('../assets/images/7515317.jpg')}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <View style={styles.container}>
//         <Text style={styles.title}>Welcome to Your App</Text>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   background: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   btn: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 10,
//   },
//   bodyText: {
//     fontSize: 18,
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default Welcome;

import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/Colors'
import logo from '../assets/images/logo.png'

const Welcome = () => {
  const router = useRouter();

<<<<<<< HEAD
  return (
    <View style={styles.container}>
        <View style={styles.closeIcon}>
          <TouchableOpacity onPress={() => router.push('/Home')}>
            <Ionicons name="close" size={20} color={'black'} />
          </TouchableOpacity>
        </View>
        <Image source={logo} style = {styles.image} />
        <View style={styles.welcomecontainer}>
        <Text style={styles.welcome}> Welcom to our store!</Text>
        <Text > </Text>
        </View>
=======
  useEffect(() => {
    // Timer to navigate to Home screen after 2 seconds
    const timer = setTimeout(() => {
      router.push('/Home');
    }, 2000);

    // Clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
<<<<<<< HEAD
    <ImageBackground
      source={require('../assets/images/7515317.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* <View style={styles.container}>
        <Text style={styles.title}>Welcome to Your App</Text>
      </View> */}
    </ImageBackground>
=======
    <View style={styles.Container}>
      {/* <ImageBackground source={back} style={styles.background}> */}
        {/* <Image source= {logo} resizeMode="contain" style={styles.logo} /> */}
        <Text style={{ marginTop: 72 }}></Text>
>>>>>>> d723de6c85890613f386087c42fd1bad7ffeb2eb
        <View >
          <Pressable onPress={() => router.push('/login')}
            style={styles.btn} > 
            <Text style = {styles.bodyText}>Login</Text>
          </Pressable>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={{ marginTop: 40 }}></Text>
          <Text style={styles.bodyText1}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signUpText }>Signup</Text>
          </TouchableOpacity>
        </View> 
      {/* </ImageBackground> */}
    </View>
>>>>>>> ea43630eb0a8c024e13568fc8996184622c23b7e
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "white",
  },
  btn: {
    width: "90%" ,
    backgroundColor: "white",
    borderColor : '#0a4a7c',
    paddingBottom: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  bodyText: {
    fontSize: 25,
    color: '#0a4a7c',
    fontWeight : 'bold',
    alignSelf: 'center',
    borderColor: COLORS.primary,
  },
  bodyText1: {
    fontSize: 25,
    color: '#3a3a3c',
    fontWeight : 'bold',
    alignSelf: 'center',
    borderColor: COLORS.primary,
  },
  signUpText: {
    fontSize: 18,
    color: '#0a4a7c',
    textDecorationLine: "underline", 
    marginLeft : 10,
  },
  closeIcon: {
    alignSelf: "flex-end",
    marginTop: 40,
    marginRight : 10,
  },
  welcome:{
    fontSize: 30,
    color: '#3a3a3c',
    fontWeight : 'bold',
    alignSelf: 'center',
    borderColor: COLORS.primary,
  },
  welcomecontainer:{
    alignSelf: 'center',
    width: "90%",
  },
  image:{
    width: "80%",
    height: "40%",
    alignSelf: 'center',
  }
});

export default Welcome;
