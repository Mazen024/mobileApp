import React, { useState } from "react";
import { Link, router } from "expo-router";
import { StyleSheet, View, TextInput, TouchableOpacity, Text , ImageBackground , Image} from "react-native";
import { firebase } from "../firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import back from '../assets/images/back.jpeg';
import logo from '../assets/images/pngwing.com.png';

const CustomAlert = ({ message }) => (
  <View style={styles.alertContainer}>
    <Text style={styles.alertText}>{message}</Text>
  </View>
);

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      const userData = {
        name: username,
        email: email,
        password: password,
        userId: userId,
      };
      await addDoc(collection(db, "users"), userData);

      router.replace(`/Home?userId=${userId}&username=${username}`);
    } catch (error) {
      console.error("Error signing up:", error.message);
      setError(error.message);
    }
  };

  return (
    <ImageBackground source = {back} style= {styles.background1}>
      <Image source= {logo} resizeMode="contain" style={styles.logo}/>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.link}>
        Already have an account? <Link href={"./login"} style={styles.Login}>Log in</Link>
      </Text>
      {error && <CustomAlert message={error} />}
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop : 30 ,
    marginBottom : 50,
    width: '50%', 
    height: '20%',
  },
  background1 : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background1 : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 70, 
    marginBottom: 40, 
    fontWeight: 'bold',
    color: 'white', 
  },
  input: {
    width: 350,
    height: 55, 
    backgroundColor: 'white', 
    borderColor: '#CBD5E1', 
    borderWidth: 1,
    borderRadius: 10, 
    marginBottom: 25,  
    paddingHorizontal: 15, 
  },
  signUpText: {
    color: '#10B981', 
    textDecorationLine: 'underline', 
    fontSize: 20, 
  },
  button: {
    backgroundColor: '#3B82F6',  
    paddingVertical: 14, 
    paddingHorizontal: 60, 
    borderRadius: 10, 
  },
  buttonText: {
    color: 'white', 
    fontSize: 20,
    fontWeight: 'bold', 
  },
  link: {
    marginTop: 15, 
    fontSize: 18, 
    color: '#FBBF24',  
  },
  alertContainer: {
    backgroundColor: '#FEE2E2',
    padding: 15,
    borderRadius: 10, 
    marginBottom: 15, 
  },
  alertText: {
    color: '#EF4444', 
    fontSize: 16, 
    textAlign: 'center', 
  },
});

export default SignUp;
