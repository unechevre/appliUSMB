import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const ClasseScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('');
  const [openScanner, setOpenScanner] = useState(false); // Ajouté pour contrôler l'affichage du scanner

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setOpenScanner(false); // Fermer le scanner une fois un code scanné
    setText(data); // Mettre à jour l'input avec la donnée scannée
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
        onChangeText={setText}
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
        <Button title="Valider" />
      </View>
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
    marginBottom: 10, // Cela ajoutera un espace en dessous du bouton.
  },
});

export default ClasseScreen;
