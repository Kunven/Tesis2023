//import auth from '@react-native-firebase/auth';
//import { useNavigation } from "@react-navigation/native";
import { PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';
import React, { useState } from "react";
import {  
  StyleSheet,
  Text,  
  View,  
} from "react-native";
//import database from '@react-native-firebase/database';

export const UserApp = (props) => {
  const [AppState, setApp] = useState(1);  
  const getNavData = (data) => {    
    setNav(data)
  }
  return (
    <View style={styles.container}>
        <MapView style={styles.map} provider={PROVIDER_GOOGLE}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});