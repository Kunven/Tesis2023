//import auth from '@react-native-firebase/auth';
//import { useNavigation } from "@react-navigation/native";
import { PROVIDER_GOOGLE } from 'react-native-maps';
import auth from '@react-native-firebase/auth';
import MapView from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import React, { useState, useEffect } from "react";
import {StyleSheet,Text,View,Button,Modal, Pressable} from "react-native";
import { ViajeUser } from './ViajeUser';

export const UserApp = (props) => {
  const [AppState, setApp] = useState(1);
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
  const getNavData = (data) => {    
    setNav(data)
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
    firestore().collection('viajes').add({
      origin: origin,
      destination: destination,
      user: props.uid,
      conductor: null,
      estado: "Pendiente",
      distancia: distance,
      costo: 3 + (Math.round(distance)*0.5)
    }).then(() =>{
      firestore().collection('users').doc(props.uid).update({viajeEnProceso: 1}).then(() =>{
        setViajeState(1)
        setModalVisible(!modalVisible)
      })
    })    
  }
  useEffect(() => {
    (async () => {
      let data = (await firestore().collection('users').doc(props.uid).get()).data()
      setViajeState(data.viajeEnProceso)
    })();
  }, []);
  if (viajeEnProceso == 0) {
    return (
      <View>    
       <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {          
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                <Text style={styles.bold}>Costo del Viaje</Text>
              </Text>
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
                Costo Total <Text style={styles.bold}>${3 + (Math.round(distance)*0.5)}</Text>
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={createRide}>
                <Text style={styles.textStyle}>Solicitar Viaje</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Text>A Donde Quieres ir?        
          <Button
            onPress={createRoute}
            title="Confirmar Destino"
            color="#841584"
          />
        </Text>
        
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
      </View>    
    );   
  }
  if (viajeEnProceso == 1) {
    return(
      <ViajeUser uid={props.uid}/>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%',
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