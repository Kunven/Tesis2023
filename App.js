import {StatusBar} from 'react-native';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { AccessNav } from './src/AccessNav';
import Geocoder from 'react-native-geocoding';
import { AppNav } from './src/AppNav';

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  StatusBar.setHidden(true)
  Geocoder.init("AIzaSyCqb0o2yg8V4fvUA6PXzoD-lTm10Itdefg");
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  function logout() {
    //Alert.alert(user.uid)
    auth().signOut()
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
  }else{
    return (
      <AppNav uid={user.uid}/>    
    );
  }  
}
{/* <Button
        onPress={logout}
        title="Cerrar Sesion"
        color="#841584"
      /> */}