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

export const PasswordReset = (props) => {
  const [email, setEmail] = useState(' ');
  const returnLogin = () => {
    props.nav(1)    
  };
  const sendPasswordReset = () => {
    auth().sendPasswordResetEmail(email).then(() => {
      Alert.alert('Sigue los pasos del correo enviado para reiniciar tu contraseña')
      props.nav(1)
    }).catch((error) =>{
      Alert.alert('Sigue los pasos del correo enviado para reiniciar tu contraseña')
      props.nav(1)
    })
    
    // Do something about forgot password operation
  };

  return (    
  <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
    <View style={styles.container}>
    <Text style={styles.title}> Cual es tu Correo?</Text>
    <TouchableOpacity
      onPress = {returnLogin}>
      <Text style={styles.return}>Regresar</Text>
    </TouchableOpacity>    
    <View style={styles.inputView}>
      <TextInput
        style={styles.inputText}
        placeholder="Email"
        placeholderTextColor="#003f5c"
        onChangeText={setEmail}/>        
    </View>
    <TouchableOpacity
        onPress = {sendPasswordReset}
        style={styles.sendBtn}>
        <Text style={styles.loginText}>Enviar Correo</Text>
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
      fontSize:30,
      color:"black",
      marginBottom: 20,
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
    return:{
      textAlign:"left" ,
      marginRight: 275,
      marginBottom: 5,
      color:"black",
      fontSize:11
    },
    sendBtn:{
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