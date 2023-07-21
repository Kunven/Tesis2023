import React, { useState, useEffect } from "react";
import {    
  Text,    
} from "react-native";
import firestore from '@react-native-firebase/firestore';
import { UserApp } from "./UserApp";
import { DriverApp } from "./DriverApp";
import { AdminApp } from "./AdminApp";

export const AppNav = (props) => {  
  const [user, setUser] = useState({rol: 4})
  useEffect(() => {
    (async () => {
      let data = (await firestore().collection('users').doc(props.uid).get()).data()
      if (data == null) {
        setUser({rol: 1})
      }else{
        setUser(data)
      }
    })();
  }, []);
  switch (user.rol) {
    case 1://Usuario
      return(<UserApp uid={props.uid} user={user}/>)
      break;
    case 2://Conductor
    return(<DriverApp uid={props.uid} user={user}/>)
      break;
    case 3://Administrador
    return(<AdminApp uid={props.uid} user={user}/>)
      break;
    case 4://Loading
    return(<Text>Cargando</Text>)
      break;
  }
};