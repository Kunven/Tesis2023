import { Card, Dialog } from '@rneui/themed';
import Modal from 'modal-react-native-web';
import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect } from "react";
import {  
  StyleSheet,
  Text,  
  View,  
  Button
} from "react-native";

export const ViajeUser = (props) => { 
  const [ride, setRide] = useState(0);  
  const [driver,setDriver] = useState(null)
  const [modalCancelacion,setCancelModal] = useState(false)
  useEffect(() => {
    (async () => {
      let data = (await firestore().collection('viajes').where('user','==',props.uid)
      .where('estado','in',["Pendiente","En Proceso"]).limit(1).get().then(async (querySnapshot) =>{
        querySnapshot.forEach(async (doc) => {          
          setRide(doc.data())
          if (doc.data().conductor != null) {            
            let data = await firestore().collection('users').doc(doc.data().conductor).get()            
            setDriver(data.data())
          }
        });
      }))      
    })();
  }, []);
  const cancelRide = () =>{

  }
  return (
    <View style={styles.container}>      
      <Card containerStyle={styles.card}>
        <Text style={styles.header}>Viaje en Proceso</Text>
        <Text style={styles.text}>El estado actual de tu viaje es : <Text style={styles.bold}>{ride.estado}</Text></Text>
        {ride.estado == 'Pendiente' ? 
          <Text>Cuando un conductor apruebe tu viaje, seras contactado</Text> :
          <Text>{driver.nombres} {driver.lastNames} esta en camino! Su telefono es: <Text style={styles.bold}>{driver.phone}</Text></Text>
        }
        <Button size="sm" type="clear" title='Learn More' onPress={cancelRide}>
          Learn More
        </Button>
      </Card>      
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
  header:{
    fontWeight: 'bold',
    fontSize:25,
  },
  text:{    
    fontSize:14,
  }
});