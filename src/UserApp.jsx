//import auth from '@react-native-firebase/auth';
//import { useNavigation } from "@react-navigation/native";
import { PROVIDER_GOOGLE } from 'react-native-maps';
import auth from '@react-native-firebase/auth';
import MapView from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import MapViewDirections from 'react-native-maps-directions';
import React, { useState, useEffect } from "react";
import {StyleSheet,Text,View,Button,Modal, Pressable} from "react-native";
import { ViajeUser } from './ViajeUser';
import { Card, Dialog } from '@rneui/themed';
export const UserApp = (props) => {
  const [AppState, setApp] = useState(0);
  const [coords, setCoords] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [viajeEnProceso, setViajeState] = useState(0);
  const [distance, setDistance] = useState(0);
  const [destination, setDestination] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCqb0o2yg8V4fvUA6PXzoD-lTm10Itdefg';
  function logout() {    
    auth().signOut()
  }
  const updateCoords = (region) => {
    setCoords({ region })
    //console.log(coords)
  }  
  const setViaje = (data) => {    
    setViajeState(data)
  }  
  const createRoute = async () => {
    //console.log(coords.region)
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    //setting origin and destination
    setOrigin({latitude: location.coords.latitude,longitude: location.coords.longitude})
    setDestination({latitude: coords.region.latitude, longitude: coords.region.longitude})

  }
  const scheduleRide = async (result) =>{
    setDistance(result.distance)    
    setModalVisible(true)
  }
  const createRide = async () =>{
    //Getting geocodes from coordinates
    let originAddress = await Geocoder.from({
      latitude : origin.latitude,
      longitude : origin.longitude
    });    
    let destinationAddress = await Geocoder.from({
      latitude : destination.latitude,
      longitude : destination.longitude
    });
    await firestore().collection('users').doc(props.uid).get().then(async (doc) =>{
      let userData = doc.data()
      await firestore().collection('viajes').add({
        origin: {address:originAddress.results[0].formatted_address,...origin},
        destination: {address: destinationAddress.results[0].formatted_address,...destination},
        user: {uid: props.uid, client: userData.nombres + ' ' + userData.lastNames,phone: userData.phone},
        conductor: null,
        estado: "Pendiente",
        distancia: distance,
        costo: 3 + (Math.round(distance)*0.5)
      }).then(async () =>{
        await firestore().collection('users').doc(props.uid).update({viajeEnProceso: 1}).then(() =>{
          //restarting vars
          setModalVisible(false);
          setCoords(null)
          setOrigin(null)
          setDistance(0)
          setDestination(null)
          //changing ride state state
          setViajeState(1)        
        })
      })
    })
    //saving ride    
  }
  useEffect(() => {
    (async () => {
      let data = (await firestore().collection('users').doc(props.uid).get()).data()
      setViajeState(data.viajeEnProceso)
    })();
  }, []);
  if (viajeEnProceso == 0) {
    return (
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
            <Text style={styles.header}>A Donde Quieres Ir?</Text>
            <Button
            onPress={createRoute}
            title="Confirmar Destino"
            color="#841584"
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
          onRegionChange={updateCoords}
        >    
        <MapViewDirections
        origin={origin}
        destination={destination}
        apikey={GOOGLE_MAPS_APIKEY}
        onReady={ async (result) =>  {await scheduleRide(result)}}
        />
        </MapView>      
        <Button
          onPress={logout}
          title="Cerrar Sesion"
          color="#841584"
        />
        <Dialog isVisible={modalVisible} onBackdropPress={() => {setModalVisible(false)}}>
          <Dialog.Title title='Costo del Viaje'/>          
          <Text style={styles.modalSubText}>
            Costo minimo <Text style={styles.bold}>$3.00</Text>
          </Text>
          <Text style={styles.modalSubText}>
            Costo por kilometro <Text style={styles.bold}>$0.50</Text>
          </Text>
          <Text style={styles.modalSubText}>
            Distancia <Text style={styles.bold}>{distance}km</Text>
          </Text>
          <Text style={styles.modalSubText}>
            Costo Total <Text style={styles.bold}>${distance * 0.5 < 3 ? 3 : 3 + (Math.round(distance)*0.5)}</Text>
          </Text>
          <Dialog.Actions>
            <Dialog.Button title="Solicitar Viaje" onPress={createRide}/>            
          </Dialog.Actions>
        </Dialog> 
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {          
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={createRide}>
                <Text style={styles.textStyle}>Solicitar Viaje</Text>
              </Pressable>
            </View>
          </View>
        </Modal> */}
      </View>    
    );   
  }
  if (viajeEnProceso == 1) {
    return(
      <ViajeUser uid={props.uid} viajeEnProceso={setViaje}/>
    )
  }
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