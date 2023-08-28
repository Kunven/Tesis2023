//import auth from '@react-native-firebase/auth';
//import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import auth from '@react-native-firebase/auth';
import {  
  StyleSheet,
  Text,  
  View,Button  
} from "react-native";
import {Card} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker'

export const AdminApp = (props) => {  
  const [conductores, setConductores] = useState([]);
  const [dashToggle, setDashToggle] = useState(1);
  const [adminState, setAdminState] = useState(1);
  const [dateStart, setDateStart] = useState(new Date(Date.now() - 2629746000))
  const [openStart, setOpenStart] = useState(false)
  const [dateEnd, setDateEnd] = useState(new Date(Date.now()))
  const [openEnd, setOpenEnd] = useState(false)
  const [rideCounter, setRideCounter] = useState(0)
  useEffect(() => {
    (async () => {
      let rides = []
      await firestore().collection('viajes').get().then((querySnapshot) =>{
        querySnapshot.forEach(doc => {
          rides.push(doc.data())
        });
      })
      await firestore().collection('users').where('rol','==',2).onSnapshot((querySnapshot) =>{
        let array = []
        querySnapshot.forEach(doc => {
          let data = {id:doc.id,...doc.data()}
          array.push(            
            <Card containerStyle={styles.card} key={data.id}>
              <Text style={styles.headerCard}>{data.nombres +' '+ data.lastNames}</Text>
              <Text style={styles.text}>Estado - <Text style={styles.bold}>{data.estado}</Text></Text>
              <Text style={styles.text}>Telefono - <Text style={styles.bold}>{data.phone}</Text></Text>
              <Text style={styles.text}>Fecha de Entrada - <Text style={styles.bold}>{new Date(data.created.seconds * 1000).toISOString()}</Text></Text>
              <Text style={styles.text}>Viajes Realizados - <Text style={styles.bold}>{rides.filter(e => e.conductor == data.id).length}</Text></Text>
              <Button
                onPress={()=>{changeDriverState(data)}}
                title={data.estado == 'Activo' ? 'Desactivar Conductor' : 'Activar Conductor'}
                color="#ffcc66"  
              />
            </Card>
          )
        });
        setConductores(array)        
        
      })
      //ride counter      
      let res = await firestore().collection('viajes')
        .where('created','<=',firestore.Timestamp.fromDate(dateEnd))
        .where('created','>=',firestore.Timestamp.fromDate(dateStart))
        .count().get()        
      setRideCounter(res.data().count)
    })();
  }, []);
  const changeDriverState = async (user) =>{
    if (user.estado == 'Activo') {
      await firestore().collection('users').doc(user.id).update({estado: "Inactivo"})
    }
    if (user.estado == 'Inactivo') {
      await firestore().collection('users').doc(user.id).update({estado: "Activo"})
    }
  }
  if (adminState == 1 && dashToggle == 0) {
    return(
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <Text style={styles.headerTitle}>Conductores</Text>
        </Card>
        <Card containerStyle={styles.returnMap}>
            <Button
              onPress={() => {setDashToggle(1)}}
              title="Regresar"
              color={"#ffcc66"}
            />
          </Card>        
        {conductores}        
      </View>
    )
  }
  if (adminState == 2 && dashToggle == 0) {
    return(
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <Text style={styles.headerTitle}>Lista de Viajes</Text>
        </Card>
        <Card containerStyle={styles.returnMap}>
            <Button
              onPress={() => {setDashToggle(1)}}
              title="Regresar"
              color={"#ffcc66"}
            />
        </Card>
        <Card containerStyle={styles.card}>
          <View>
            <Text>Fecha de Inicio: {dateStart.toDateString()}</Text>
            <Button title="Fecha de Inicio" onPress={() => setOpenStart(true)} color={"#ffcc66"}/>
            <DatePicker
              modal
              mode="date"
              open={openStart}
              date={dateStart}
              onConfirm={async (dateStart) =>{
                setOpenStart(false)
                setDateStart(dateStart)
                let res = await firestore().collection('viajes')
                  .where('created','<=',firestore.Timestamp.fromDate(dateEnd))
                  .where('created','>=',firestore.Timestamp.fromDate(dateStart))
                  .count().get()        
                setRideCounter(res.data().count)
              }}
              onCancel={() => {
                setOpenStart(false)
              }}
            />
          </View>
          <View style={styles.dates}>
            <Text>Fecha de Fin: {dateEnd.toDateString()}</Text>
            <Button title="Fecha de Fin" onPress={() => setOpenEnd(true)} color={"#ffcc66"}/>
            <DatePicker
              modal
              mode="date"
              open={openEnd}
              date={dateEnd}
              onConfirm={async (dateEnd) => {
                setOpenEnd(false)
                setDateEnd(dateEnd)
                let res = await firestore().collection('viajes')
                  .where('created','<=',firestore.Timestamp.fromDate(dateEnd))
                  .where('created','>=',firestore.Timestamp.fromDate(dateStart))
                  .count().get()        
                setRideCounter(res.data().count)
              }}
              onCancel={() => {
                setOpenEnd(false)
              }}
            />
          </View>
        </Card>
        <Card containerStyle={styles.card}>                    
          <Text style={styles.headerSubTitle}>Numero de viajes en este rango</Text>
          <Text style={styles.dateReport}>{rideCounter}</Text>
        </Card>
      </View>
    )
  }
  if (dashToggle == 1) {
    return(
      <View style={styles.container}>        
        <Card containerStyle={styles.cardTitle}>
            <Text style={styles.header}>Bienvenido {props.user.nombres} {props.user.lastNames}</Text>
        </Card>
        <Card containerStyle={styles.cardDash}>
            <Text style={styles.headerSub}>Quieres administrar tus conductores?</Text>
            <Text>1. Abre el listado</Text>
            <Text>2. Administra a los conductores</Text>            
            <Button style={styles.logoutButton}
            onPress={() => {setDashToggle(0); setAdminState(1)}}
            title="Abrir Conductores"
            color={"#ffcc66"}
          />
        </Card>
        <Card containerStyle={styles.cardDash}>
            <Text style={styles.headerSub}>Quieres ver los viajes realizados?</Text>
            <Text>1. Selecciona un rango de fechas</Text>
            <Text>2. Selecciona un conductor</Text>            
            <Button style={styles.logoutButton}
            onPress={() => {setAdminState(2);setDashToggle(0)}}
            title="Abrir Lista de Viajes"
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
  returnMap:{
    right: 0,
    position: 'absolute',//use absolute position to show button on top of the map
    backgroundColor: '#ffffcc',    
    
  },
  header:{
    fontWeight: 'bold',
    fontSize:25,
  },
  dates:{
    marginTop: 10
  },
  dateReport:{
    textAlign: 'center',
    fontWeight:'bold',
    justifyContent:'center',
    fontSize:50,
  },  
  headerSub:{
    fontWeight: 'bold',
    fontSize:20,
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
  bold:{
    fontWeight: 'bold'
  },
  card:{
    backgroundColor: '#ffffcc'
  },
  cardReport:{
    backgroundColor: '#ffffcc',
    flexDirection:"row"
  },
  headerTitle:{
    fontWeight: 'bold',
    fontSize:25,
  },
  headerSubTitle:{    
    fontWeight: 'bold',
    fontSize:20,
  },
  headerCard:{    
    fontWeight: 'bold',
    fontSize:20,
  },
  text:{    
    fontSize:14,
  }
});