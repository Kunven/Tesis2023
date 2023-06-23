import {Text, View,Button} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Login } from './src/Login';
import auth from '@react-native-firebase/auth';
import { AccessNav } from './src/AccessNav';
import {    
  Alert,
} from "react-native";

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  function logout() {
    Alert.alert(user.uid)
    //auth().signOut()
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <AccessNav/>
    );
  }
  return (
    <View>
      <Text>Aqui va la app</Text>
      <Button
        onPress={logout}
        title="Cerrar Sesion"
        color="#841584"
      />
    </View>
  );  
}