import {Card} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect } from "react";
import auth from '@react-native-firebase/auth';
import * as Linking from 'expo-linking';
import {  
  StyleSheet,
  Text,  
  View,  
  Button,ScrollView
} from "react-native";
import { RidePreview } from './RidePreview';

export const DriverApp = (props) => {
  const [viajes,setViajes] = useState([])
  const [currentRide,setCurrentRide] = useState({})
  const [viajeProp,setViajeProp] = useState()
  const [watchRide,setRideView] = useState(0)
  useEffect(() => {
    (async () => {
      let userData = (await firestore().collection('users').doc(props.uid).get()).data()
      if (userData.viajeEnProceso == 0) {
        await firestore().collection('viajes').where('estado','==','Pendiente').onSnapshot(async (querySnapshot) =>{
          let array = []
          querySnapshot.forEach(async (doc) => {
            setViajes([])
            let data = {id: doc.id, ...doc.data()}
            const origin = data.origin.address
            const destination = data.destination.address
            array.push(
              <Card containerStyle={styles.card} key={data.user.client}>
                <Text style={styles.headerCard}>Cliente - {data.user.client}</Text>
                <Text style={styles.text}>Punto A <Text style={styles.bold}>{origin}</Text></Text>
                <Text style={styles.text}>Punto B <Text style={styles.bold}>{destination}</Text></Text>
                <Text style={styles.text}>Costo - <Text style={styles.bold}>${data.costo}</Text></Text>
                <Text style={styles.text}>Telefono <Text style={styles.bold}>{data.user.phone}</Text></Text>
                <Button
                  onPress={()=>{seeRide(data)}}
                  title="Ver Viaje"
                  color="#ffcc66"                
                />
              </Card>
            )
          });
          setViajes(array)
        })
      }
      if (userData.viajeEnProceso == 1) {
        await firestore().collection('viajes').where('estado','==','En Proceso').where('conductor','==',props.uid).limit(1).get().then((querySnapshot) =>{
          querySnapshot.forEach(doc => {
            setCurrentRide({id: doc.id,...doc.data()})
          });
        })
        setRideView(2)
      }
    })();
  }, []);
  const seeRide = (viaje) =>{    
    //let url = 'https://www.google.com/maps/dir/?api=1&origin='+ viaje.origin.address+'&destination='+ viaje.destination.address+'&travelmode=driving'    
    //Linking.openURL(url);
    setViajeProp(viaje)
    setRideView(1)
  }
  const navigateRide = (viaje) =>{
    let url = 'https://www.google.com/maps/dir/?api=1&origin='+ viaje.origin.address+'&destination='+ viaje.destination.address+'&travelmode=driving'    
    Linking.openURL(url);
  }  
  const changeRideState = async (estado) =>{
    await firestore().collection('viajes').doc(currentRide.id).update({estado:estado}).then(async () =>{
      await firestore().collection('users').doc(props.uid).update({viajeEnProceso: 0}).then(async () =>{
        await firestore().collection('users').doc(currentRide.user.uid).update({viajeEnProceso: 0}).then(() =>{
          setRideView(0)
        })
      })
    })    
  }
  if (watchRide == 0) {//List of rides, default view
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
  }
  if (watchRide == 1) {//Ride Visualization
    return(
      <RidePreview ride={viajeProp} nav={setRideView} uid={props.uid} currentRide={setCurrentRide}/>
    )    
  }
  if (watchRide == 2) {//Ride Accepted, and in process
    return(
      <View style={styles.container}>
        <ScrollView>
        <Card containerStyle={styles.card}>
          <Text style={styles.headerCard}>Cancelar Viaje</Text>
          <Text style={styles.text}>Sucedio algo y tienes que cancelar el viaje? Presiona este boton</Text>
          <Button 
            onPress={() =>{changeRideState('Cancelado')}}
            title='Cancelar'
            color="#FF0000"
          />
        </Card>
        <Card containerStyle={styles.card}>
          <Text style={styles.headerCard}>Terminar Viaje</Text>
          <Text style={styles.text}>Terminaste el viaje y el cliente ya te pago? Presiona este boton</Text>       
          <Button 
            onPress={() =>{changeRideState('Finalizado')}}
            title='Terminar Viaje'
            color="#008000"                
          />
        </Card>
        <Card containerStyle={styles.card}>
          <Text style={styles.headerCard}>Viaje En Proceso</Text>
          <Text style={styles.text}>El estado actual de tu viaje es : <Text style={styles.bold}>{currentRide.estado}</Text></Text>
          <Text style={styles.text}>Contactate con el cliente para coordinar el  viaje</Text>
          <Text style={styles.text}>Telefono:<Text style={styles.bold}>{currentRide.user.phone}</Text></Text>
          <Button 
            onPress={()=>{navigateRide(currentRide)}}
            title='Ver  Viaje'
            color="#ffcc66"                
          />
        </Card>
        </ScrollView>      
      </View>
    )
  }
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