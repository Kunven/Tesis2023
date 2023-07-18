import auth from '@react-native-firebase/auth';
//import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {  
  StyleSheet,
  Text,  
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Keyboard,
  Alert,
} from "react-native";

//import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const Login = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [navState, setNav] = useState();

  const onPressLogin = () => {
    // Do something about login operation
    auth().signInWithEmailAndPassword(email,password)    
    .catch(error =>{
      if (error.code == 'auth/invalid-email' || error.code == 'auth/wrong-password') {
        Alert.alert('Credenciales Incorrectas')
      }else{
        Alert.alert(error.code)
      }
    })
  };

  const onPressForgotPassword = () => {
    props.nav(2)
    // Do something about forgot password operation
  };

  const onPressSignUp = () => {
    props.nav(3)
    // Do something about signup operation
  };

  return (    
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      <Text style={styles.title}> LOGO</Text>      
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={setEmail}/>
      </View>
      <View style={styles.inputView}>
        <TextInput
        style={styles.inputText}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#003f5c"
        onChangeText={setPassword}/>
      </View>
      <TouchableOpacity
        onPress = {onPressForgotPassword}>
        <Text style={styles.forgotAndSignUpText}>Olvidaste tu Contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress = {onPressLogin}
        style={styles.loginBtn}>
        <Text style={styles.loginText}>Inicio de Sesión </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress = {onPressSignUp}>
        <Text style={styles.forgotAndSignUpText}>Registro</Text>
      </TouchableOpacity>
      </View>    
    </Pressable>    
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: '#ccffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    //fontWeight: "bold",
    fontSize:50,
    color:"black",
    marginBottom: 0,
  },  
  inputView:{
    width:"80%",
    backgroundColor:"#ffffcc",
    borderRadius:0,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"black"
  },
  forgotAndSignUpText:{
    color:"black",
    fontSize:11
  },
  loginBtn:{
    width:"60%",
    backgroundColor:"#ffcc66",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
});