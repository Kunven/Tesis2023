import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
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

export const Register = (props) => {      
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [names, setName] = useState('');
  const [lastNames, setLastNames] = useState('');
  const [phone, setPhone] = useState('');
  const returnLogin = () => {
    props.nav(1)    
  };  
  const registerUser = () => {
    if (password != passwordRepeat) {
      Alert.alert("Las contraseñas no coinciden")
    }else{
      auth().createUserWithEmailAndPassword(email,password).then((userCredential) =>{
        firestore().collection('users').doc(userCredential.user.uid).set({
          email: email,
          nombres: names,
          lastNames: lastNames,
          phone: phone,
          rol: 1,
          viajeEnProceso: 0,
          created: firestore.FieldValue.serverTimestamp()
          //uid: userCredential.user.uid
        }).then(() => {props.nav(1)}).catch( (error) =>{
          Alert.alert(error.code)
        })
      }).catch((error) => {
        Alert.alert(error.code)
      })      
    }    
  };
  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      <Text style={styles.title}> Registro de Usuario</Text>
      <TouchableOpacity
        onPress = {returnLogin}>
        <Text style={styles.return}>Regresar</Text>
      </TouchableOpacity>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Correo"
          placeholderTextColor="#003f5c"
          onChangeText={setEmail}/>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Nombres"
          placeholderTextColor="#003f5c"
          onChangeText={setName}/>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Apellidos"
          placeholderTextColor="#003f5c"
          onChangeText={setLastNames}/>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Telefono"
          placeholderTextColor="#003f5c"
          onChangeText={setPhone}/>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Contraseña"
          placeholderTextColor="#003f5c"
          onChangeText={setPassword}/>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Repita Contraseña"
          placeholderTextColor="#003f5c"
          onChangeText={setPasswordRepeat}/>
      </View>
      <TouchableOpacity
          onPress = {registerUser}
          style={styles.sendBtn}>
          <Text style={styles.loginText}>Crear Usuario</Text>
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
        marginBottom:10,
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