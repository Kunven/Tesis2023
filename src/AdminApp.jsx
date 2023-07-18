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

export const AdminApp = (props) => {  
  const [conductores, setConductores] = useState([]);
  useEffect(() => {
    (async () => {
      await firestore().collection('users').where('rol','==',2).onSnapshot((querySnapshot) =>{
        let array = []
        querySnapshot.forEach(doc => {
          let data = {id:doc.id,...doc.data()}
          array.push(
            <Card containerStyle={styles.card} key={data.id}>
              <Text style={styles.headerCard}>Conductor - {data.nombres +' '+ data.lastNames}</Text>
              <Text style={styles.text}>Estado - <Text style={styles.bold}>{data.estado}</Text></Text>
              <Text style={styles.text}>Telefono - <Text style={styles.bold}>{data.phone}</Text></Text>              
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
  return(
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Conductores</Text>
      {conductores}
      <Button
            onPress={() => auth().signOut()}
            title="Cerrar Sesion"
            color="#841584"
          />
    </View>
  )
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