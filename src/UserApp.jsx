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
import {StyleSheet,Text,View,Button, ScrollView} from "react-native";
import { ViajeUser } from './ViajeUser';
import { Card, Dialog } from '@rneui/themed';
export const UserApp = (props) => {  
  const [viajes,setViajes] = useState([])
  const [coords, setCoords] = useState(null);
  const [user, setUser] = useState(props.user)
  const [origin, setOrigin] = useState(null);
  const [viajeEnProceso, setViajeState] = useState(0);
  const [distance, setDistance] = useState(0);
  const [listaViajes, setLista] = useState(0);
  const [destination, setDestination] = useState(null);
  const [dashToggle, setDashToggle] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const GOOGLE_MAPS_APIKEY = 'YOURMAPSAPIKEY';
  function logout() {    
    auth().signOut()
  }
  const updateCoords = (region) => {
    setCoords({ region })
  }  
  const setViaje = (data) => {    
    setViajeState(data)
  }
  const createRoute = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
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
        costo: distance * 0.5 < 3 ? 3 : 3 + (Math.round(distance)*0.5),
        created: firestore.FieldValue.serverTimestamp()
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
      let res = (await firestore().collection('users').doc(props.uid).get()).data()      
      if (res != null) {
        setUser(res)
      
      }      
      await firestore().collection('viajes').where('estado','==','Finalizado').get().then((querySnapshot) =>{
        let array = []
        querySnapshot.forEach(async (doc) => {
          setViajes([])
          let data = {id: doc.id, ...doc.data()}
          if (data.user.uid == props.uid) {            
            let conductor = (await firestore().collection('users').doc(data.conductor).get()).data()            
            const origin = data.origin.address
            const destination = data.destination.address
            array.push(
              <Card containerStyle={styles.card2} key={data.id}>
                <Text style={styles.headerCard}>Conductor - <Text style={styles.bold}>{conductor.nombres} {conductor.lastNames}</Text></Text>
                <Text style={styles.text}>Punto A <Text style={styles.bold}>{origin}</Text></Text>
                <Text style={styles.text}>Punto B <Text style={styles.bold}>{destination}</Text></Text>
                <Text style={styles.text}>Costo - <Text style={styles.bold}>${data.costo}</Text></Text>
                <Text style={styles.text}>Fecha <Text style={styles.bold}>{new Date(data.created.seconds * 1000).toISOString()}</Text></Text>
              </Card>
            )
          }          
        });
        setViajes(array)
      })
    })();
  }, []);
  if (viajeEnProceso == 0 && dashToggle == 0 && listaViajes == 0) {
    return (
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
            <Text style={styles.header}>A Donde Quieres Ir?</Text>
            <Button
            onPress={createRoute}
            title="Confirmar Destino"
            color={"#ffcc66"}
          />
        </Card>
        <Card containerStyle={styles.returnMap}>
            <Button
            onPress={() => {setDashToggle(1)}}
            title="Regresar"
            color={"#ffcc66"}
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
      </View>    
    );   
  }
  if (viajeEnProceso == 1) {
    return(
      <ViajeUser uid={props.uid} viajeEnProceso={setViaje} DashToggle={setDashToggle}/>
    )
  }
  if (dashToggle == 0 && listaViajes == 1) {
    return(
      <View style={styles.container}>
      <ScrollView>
        <Card containerStyle={styles.cardTitle}>
          <Text style={styles.headerTitle}>Viajes Realizados</Text>
        </Card>
        <Card containerStyle={styles.returnMap}>
          <Button
            onPress={() => {setDashToggle(1);setLista(0)}}
            title="Regresar"
            color={"#ffcc66"}
          />
        </Card>
        {viajes}        
      </ScrollView>      
    </View>
    )
  }
  if (dashToggle == 1 && viajeEnProceso == 0) {
    return(
      <View style={styles.container}>        
        <Card containerStyle={styles.cardTitle}>
            <Text style={styles.header}>Bienvenido {user.nombres} {user.lastNames}</Text>
        </Card>
        <Card containerStyle={styles.cardDash}>
            <Text style={styles.headerSub}>Viajes Realizados</Text>            
            <Text>Presiona aqui para ver los viajes que has realizado</Text>
            <Button style={styles.logoutButton}
            onPress={() => {setDashToggle(0);setLista(1)}}
            title="Ver Viajes"
            color={"#ffcc66"}
          />
        </Card>
        <Card containerStyle={styles.cardDash}>
            <Text style={styles.headerSub}>Quieres realizar un viaje?</Text>
            <Text>1. Coloca tu destino en el mapa</Text>
            <Text>2. Confirma el costo</Text>
            <Text>3. Espera a que un conductor acepte tu viaje y se comunique contigo</Text>
            <Text>4. Realiza tu viaje</Text>
            <Button style={styles.logoutButton}
            onPress={() => setDashToggle(0)}
            title="Abrir Mapa"
            color={"#ffcc66"}
          />
        </Card>        
        <Card containerStyle={styles.logoutButton}>
        <Button style={styles.logoutButton}
            onPress={() => auth().signOut()}
            title="Cerrar Sesion"
            color={"#ffcc66"}
          />
        </Card>
        
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccffff',
  },
  headerTitle:{
    fontWeight: 'bold',
    fontSize:25,
  },
  logoutButton:{
    backgroundColor: '#ffffcc',
    position: 'absolute',
    marginLeft: 20,
    top:0,
    left:0,
  },  
  cardTitle:{
    marginTop: 90,
    marginLeft: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffcc',
    
  },
  cardDash:{    
    marginLeft: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffcc',
  },
  card2:{    
    backgroundColor: '#ffffcc'
  },
  card:{
    marginLeft: 20,
    position: 'absolute',//use absolute position to show button on top of the map
    backgroundColor: '#ffffcc',    
    
  },
  returnMap:{
    right: 0,
    position: 'absolute',//use absolute position to show button on top of the map
    backgroundColor: '#ffffcc',    
    
  },
  header:{
    fontWeight: 'bold',
    fontSize:25,
  },
  headerSub:{
    fontWeight: 'bold',
    fontSize:20,
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