import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/Colors'
import logo from '../assets/images/logo.png'
const Welcome = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
        <View style={styles.closeIcon}>
          <TouchableOpacity onPress={() => router.push('/Home')}>
            <Ionicons name="close" size={20} color={'black'} />
          </TouchableOpacity>
        </View>
        <Image source={logo} style = {styles.image} />
        <View style={styles.welcomecontainer}>
        <Text style={styles.welcome}> Welcom to our store !</Text>
        <Text > </Text>
        </View>
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
