import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Pressable, Text , ImageBackground , Image } from "react-native";
import { Link, router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import back from '../assets/images/back.jpeg';
import logo from '../assets/images/pngwing.com.png';

const CustomAlert = ({ message }) => (
  <View style={styles.alertContainer}>
    <Text style={styles.alertText}>{message}</Text>
  </View>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (username) {
      handleLoginAndNavigate();
    }
  }, [username]);

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return userData.name;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrors("Error logging in:", error.message);
      return null;
    }
  };

  const handleLoginAndNavigate = async () => {
    const username = await handleLogin();
    if (username !== null) {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user.uid;
      if (userId === "68OeibuKs1P1iUcu4Vm5eFwbm7I3") {
        router.replace(`./admins/admin?userId=${userId}&username=${username}`);
      } else {
        router.replace(`/Home?userId=${userId}&username=${username}`);
      }
    }
  };

  const handleLoginButtonPress = async () => {
    setUsername(await handleLogin());
  };

  return (
    <ImageBackground source={back}  style={styles.background1} >
    <Image source= {logo} resizeMode="contain" style={styles.logo}/>
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Pressable style={styles.button} onPress={handleLoginButtonPress}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Text style={styles.link}>
        Don't have an account ? <Link href={"./signup"} style={styles.SignUp}>Sign Up</Link>
      </Text>
      <Text style={styles.link}>
        <Link href={"./forgotPassword"} style={styles.SignUp}>Forgot Password?</Link>
      </Text>
      {errors && <CustomAlert message={errors} />}
    </View>
    </ImageBackground>
  );
};

export default Login;

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
