//import auth from '@react-native-firebase/auth';
//import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {  
  StyleSheet,
  Text,  
  View,  
} from "react-native";
import firestore from '@react-native-firebase/firestore';
import { UserApp } from "./UserApp";

export const AppNav = (props) => {  
  const [user, setUser] = useState({rol: 1
  });
  useEffect(() => {
    (async () => {
      let data = (await firestore().collection('users').doc(props.uid).get()).data()
      setUser(data)
    })();
  }, []);
  switch (user.rol) {
    case 1://Usuario
      return(<UserApp uid={props.uid}/>)
      break;
    case 2://Conductor
    return(<Text>Conductor</Text>)
      break;
    case 3://Administrador
    return(<Text>Admin</Text>)
      break;
    default://Usuario
    return(<Text>Error</Text>)
      break;
  }
};