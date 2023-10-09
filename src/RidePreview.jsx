//import auth from '@react-native-firebase/auth';
//import { useNavigation } from "@react-navigation/native";
import { PROVIDER_GOOGLE } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import React, { useState, useEffect } from "react";
import {StyleSheet,Text,View,Button} from "react-native";

import { Card} from '@rneui/themed';
export const RidePreview = (props) => {
  const [ride, setRide] = useState(props.ride);  
  const GOOGLE_MAPS_APIKEY = 'YOURMAPSAPIKEY';  
    
  // useEffect(() => {
  //   (async () => {
  //     let data = (await firestore().collection('users').doc(props.uid).get()).data()
  //     setViajeState(data.viajeEnProceso)
  //   })();
  // }, []);
  const acceptRide = async () =>{    
    await firestore().collection('viajes').doc(ride.id).update({
      conductor: props.uid,
      estado: "En Proceso"
    }).then(async () =>{
      await firestore().collection('users').doc(props.uid).update({
        viajeEnProceso: 1
      }).then(async () =>{
        props.currentRide((await firestore().collection('viajes').doc(ride.id).get()).data())
        props.nav(2)
      })
    })    
    //props.nav(0)
  }
  const returnView = () =>{    
    props.nav(0)
  }
  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
          <Text style={styles.header}>Aceptar Viaje?</Text>
          <Button
          onPress={acceptRide}
          title="Aceptar"
          color="#ffcc66"
        />
        <Button
          onPress={returnView}
          title="Regresar"
          color="#FF0000"
        />
      </Card>
      <MapView 
        style={styles.map} 
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        initialRegion={{
          latitude: -2.16299,
          longitude: -79.9001917,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}        
      >    
       <Marker          
          coordinate={props.ride.origin}
          title={"Origen"}
          description={props.ride.origin.address}
        />
        <Marker          
          coordinate={props.ride.destination}
          title={"Destino"}
          description={props.ride.destination.address}
        />
      <MapViewDirections
      origin={props.ride.origin}
      destination={props.ride.destination}
      apikey={GOOGLE_MAPS_APIKEY}      
      />
      </MapView>
    </View>    
  );   
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccffff',    
    
  },
  card:{
    marginLeft: 20,
    position: 'absolute',//use absolute position to show button on top of the map
    backgroundColor: '#ffffcc',    
    
  },
  header:{
    fontWeight: 'bold',
    fontSize:25,
  },
  map: {
    flex: 1,
    zIndex: -1
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubText: {
    marginBottom: 1,    
  },
  bold: {
    fontWeight: 'bold',
  },
});