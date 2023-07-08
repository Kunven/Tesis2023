import { Card, Dialog } from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect } from "react";
import auth from '@react-native-firebase/auth';
import {  
  StyleSheet,
  Text,  
  View,  
  Button,ScrollView
} from "react-native";

export const DriverApp = (props) => {
  const [viajes,setViajes] = useState([])

  useEffect(() => {
    (async () => {
      await firestore().collection('viajes').where('estado','==','Pendiente').onSnapshot(async (querySnapshot) =>{
        let array = []
        querySnapshot.forEach(async (doc) => {
          setViajes([])
          let data = doc.data()          
          const origin = data.origin.address
          const destination = data.destination.address
          array.push(
            <Card containerStyle={styles.card}>
              <Text style={styles.headerCard}>Cliente - {data.user.client}</Text>
              <Text style={styles.text}>Punto A <Text style={styles.bold}>{origin}</Text></Text>
              <Text style={styles.text}>Punto B <Text style={styles.bold}>{destination}</Text></Text>
              <Text style={styles.text}>Costo - <Text style={styles.bold}>${data.costo}</Text></Text>
              <Text style={styles.text}>Telefono <Text style={styles.bold}>{data.user.phone}</Text></Text>
            </Card>
          )
        });
        setViajes(array)
      })      
    })();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.headerTitle}>Viajes Disponibles</Text>
      {viajes}
      <Button
          onPress={() => auth().signOut()}
          title="Cerrar Sesion"
          color="#841584"
        />
      </ScrollView>      
    </View>
  );
};

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#ccffff',    
  },
  bold:{
    fontWeight: 'bold'
  },
  card:{
    backgroundColor: '#ffffcc'
  },
  headerTitle:{
    marginTop: 10,
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize:25,
  },
  headerCard:{    
    fontWeight: 'bold',
    fontSize:20,
  },
  text:{    
    fontSize:14,
  }
});