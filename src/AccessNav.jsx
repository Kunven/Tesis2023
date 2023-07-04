//import auth from '@react-native-firebase/auth';
//import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {  
  StyleSheet,
  Text,  
  View,  
} from "react-native";
import { Login } from "./Login";
import { PasswordReset } from "./PasswordReset";
import {Register} from "./Register";

export const AccessNav = () => {    
  const [navState, setNav] = useState(1);

  const getNavData = (data) => {    
    setNav(data)
  }
  switch (navState) {
    case 1:
      return(<Login nav={getNavData}/>)
      break;
    case 2:
      return(<PasswordReset nav={getNavData}/>)
      break;
    case 3:
      return(<Register nav={getNavData}/>)
      break;
    default:
      return(<Login nav={getNavData}/>)
      break;
  }
};

const styles = StyleSheet.create({
  
});