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
import { DriverApp } from "./DriverApp";

export const AppNav = (props) => {  
  const [user, setUser] = useState({rol: 4
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
    return(<DriverApp uid={props.uid}/>)
      break;
    case 3://Administrador
    return(<Text>Admin</Text>)
      break;
    case 4://Loading
    return(<Text>Cargando</Text>)
      break;
  }
};