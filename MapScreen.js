import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

const MapScreen = () => {
  const route = useRoute();

  // Récupérez les données de l'événement depuis les paramètres de navigation
  const event = route.params?.event;

  return (
<View style={{ flex: 1 }}>
  <MapView 
    style={{ flex: 1 }}
    region={{
      latitude: event.lat,
      longitude: event.lng,
      latitudeDelta: 0.002, // Ajustez selon vos besoins pour le zoom
      longitudeDelta: 0.002, // Ajustez selon vos besoins pour le zoom
    }}
  >
    <Marker
      coordinate={{ latitude: event.lat, longitude: event.lng }}
      title={event.name}
      description={event.description}
    />
  </MapView>
  <Text>{event.name} - {event.time} - {event.salle}</Text>
</View>
  );
};

export default MapScreen;
