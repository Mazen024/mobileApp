import React, { useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import COLORS from '../constants/Colors'

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
        <View >
          <Pressable onPress={() => router.push('/login')}
            style={styles.btn} > 
            <Text style = {styles.bodyText}>Login</Text>
          </Pressable>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={{ marginTop: 72 }}></Text>
          <Text style={styles.bodyText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signUpText }>Signup</Text>
          </TouchableOpacity>
        </View> 
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => router.push('/Home')}>
            <Text style={styles.bodyText }>Login without registration</Text>
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
    padding: 20,
    backgroundColor: 'lightgray',
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300, 
    height: 300, 
  },
  title: {
    width: 350 ,
    fontSize: 20,
    color: 'black',
    backgroundColor: "#CBD5E1",
    textTransform: 'uppercase',
    borderColor : 'black',
  },
  subtitle: {
    fontSize: 18,
    color: 'black',

  },
  btn: {
    width: 350 ,
    backgroundColor: '#fff',
    borderColor : 'black',
    color : 'white',
    paddingBottom: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    borderColor: COLORS.primary,
    justifyContent: 'center'
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  bodyText: {
    fontSize: 25,
    color: 'black',
    fontWeight : 'bold',
    borderColor: COLORS.primary,
  },
  signUpText: {
    fontSize: 18,
    color: 'white',
    textDecorationLine: "underline", 
    marginLeft : 15,
  },
  image:{
    width: "80%",
    height: "40%",
    alignSelf: 'center',
  }
});

export default Welcome;
