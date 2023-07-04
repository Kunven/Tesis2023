//import auth from '@react-native-firebase/auth';
//import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {  
  StyleSheet,
  Text,  
  View,  
} from "react-native";
import database from '@react-native-firebase/database';
import { UserApp } from "./UserApp";

export const AppNav = (props) => {  
  const [user, setUser] = useState({});  
  database()
  .ref('/users/' + props.uid)
  .once('value')
  .then(snapshot => {
    setUser(snapshot.val())
    //user =  snapshot.val()
  });    
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
    return(<UserApp uid={props.uid}/>)
      break;
  }
};

const styles = StyleSheet.create({
  
});