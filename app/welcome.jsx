import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';
import Button from '../components/Button';
import logo from '../assets/images/pngwing.com.png';
import back from '../assets/images/back.jpeg';
import COLORS from '../constants/Colors'



const Welcome = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={back} style={styles.background}>
        <Image source= {logo} resizeMode="contain" style={styles.logo} />
        <Text style={{ marginTop: 72 }}></Text>
        <View >
          <Pressable onPress={() => router.push('/login')}
            style={styles.btn} > 
            <Text style = {styles.bodyText}>Login</Text>
          </Pressable>
          {/* <Button
            title="Login"
            onPress={() => router.push('/login')}
            style={styles.btn}
          /> */}
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
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300, // Fixed width value
    height: 300, // Fixed height value
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
});

export default Welcome;
