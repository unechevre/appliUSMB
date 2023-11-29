import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClasseScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('');
  const [openScanner, setOpenScanner] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true); // Définir l'état de chargement à true lors de la récupération des données
      //changer l'ip selon l'endroit où ce trouve le serveur
      const response = await axios.get('http://192.168.43.223:3000/recuperer_calendrier', {
        params: {
          url: text
        }
      });

      if (response.status === 200) {
        await AsyncStorage.setItem('calendarData', JSON.stringify(response.data));
        setData(response.data);
      } else {
        console.error('Erreur lors de la récupération des données:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false); // Définir l'état de chargement à false une fois la récupération terminée
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setOpenScanner(false);
    setText(data);
    alert(`QR Code scanné ! Donnée: ${data}`);
  };

  if (hasPermission === null) {
    return <Text>Demande de permission d'accès à la caméra</Text>;
  }
  if (hasPermission === false) {
    return <Text>Pas d'accès à la caméra</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Entrer la classe"
        value={text}
        onChangeText={(text) => setText(text)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Ouvrir le Scanner" onPress={() => setOpenScanner(true)} />
      </View>
      {openScanner && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button title="Valider" onPress={fetchData} />
      </View>
      <Text>{loading || data ? 'Récupération des données :' : ''}</Text>
      <Text>{loading ? 'En cours...' : data ? 'Terminé !' : ''}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginBottom: 10,
  },
});

export default ClasseScreen;
