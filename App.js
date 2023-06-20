import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Login } from './src/Login';
import auth from '@react-native-firebase/auth';

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <Login/>
    );
  }
  return (
    <View>
      <Text>Aqui va la app</Text>
      <Button
        onPress={() => auth().signOut()}
        title="Cerrar Sesion"
        color="#841584"        
      />
    </View>
  );  
}