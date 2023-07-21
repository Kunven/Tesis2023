import { Card, Dialog } from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import React, { useState, useEffect } from "react";
import {  
  StyleSheet,
  Text,  
  View,  
  Button
} from "react-native";

export const ViajeUser = (props) => { 
  const [ride, setRide] = useState(0);  
  const [driver,setDriver] = useState({nombres: "", lastNames: "", phone: ""})
  const [modalCancelacion,setCancelModal] = useState(false)
  useEffect(() => {
    (async () => {
      let data = (await firestore().collection('viajes').where('user.uid','==',props.uid)
      .where('estado','in',["Pendiente","En Proceso"]).limit(1).onSnapshot(async (querySnapshot) =>{
        querySnapshot.forEach(async (doc) => {
          setRide({id: doc.id,... doc.data()})
          if (doc.data().conductor != null) {            
            let data = await firestore().collection('users').doc(doc.data().conductor).get()            
            setDriver(data.data())
          }
        });
      }))
    })();
  }, []);
  const cancelRide = async () =>{
    await firestore().collection('viajes').doc(ride.id).update({estado: "Cancelado",}).then(async () =>{
      await firestore().collection('users').doc(props.uid).update({viaje: "", viajeEnProceso: 0}).then(async () =>{
        await firestore().collection('users').doc(ride.conductor).update({viaje: "", viajeEnProceso: 0}).then(() =>{
          setCancelModal(false)
          props.viajeEnProceso(0)
          props.DashToggle(1)

        })
      })
    })    
  }
  return (
    <View style={styles.container}>
      <Card containerStyle={styles.logoutButton}>
        <Button style={styles.logoutButton}
          onPress={() => auth().signOut()}
          title="Cerrar Sesion"
          color={"#ffcc66"}
        />
      </Card>
      <Card containerStyle={styles.card}>
        <Text style={styles.header}>Viaje en Proceso</Text>
        <Text style={styles.text}>El estado actual de tu viaje es : <Text style={styles.bold}>{ride.estado}</Text></Text>
        {ride.estado == 'Pendiente' ? 
          <Text>Cuando un conductor acepte tu viaje seras contactado</Text> :
          <Text>{driver.nombres} {driver.lastNames} esta en camino! Su telefono es: <Text style={styles.bold}>{driver.phone}</Text></Text>
        }        
      </Card>
      <Card containerStyle={styles.card}>
        <Text style={styles.header}>Cancelar Viaje</Text>
        <Text style={styles.text}>Si tu conductor no ha llegado, o no se ha comunicado contigo, puedes cancelar el viaje cuando quieras</Text>        
        <Button size="sm" title='Cancelar Viaje' onPress={() => {setCancelModal(true)}}color={'#ffcc66'}>
          Learn More
        </Button>
      </Card>
      <Dialog isVisible={modalCancelacion} onBackdropPress={() => {setCancelModal(false)}}>
        <Dialog.Title title='Cancelar Viaje'/>
        <Text style={styles.text}>Seguro que deseas cancelar el viaje?</Text>
        <Dialog.Actions>
          <Dialog.Button title="Si" onPress={cancelRide}/>
          <Dialog.Button title="No" onPress={() => {setCancelModal(false)}}/>
        </Dialog.Actions>
      </Dialog>       
    </View>
  );
};

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#ccffff',    
    justifyContent: 'center',
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
  },
  logoutButton:{
    backgroundColor: '#ffffcc',
    position: 'absolute',
    marginLeft: 20,
    top:0,
    left:0,
  },  
});