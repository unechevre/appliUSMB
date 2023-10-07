import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventItem = React.memo(({ item, navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Map', { event: item })}>
      <View style={{ padding: 10, backgroundColor: 'lightgray', margin: 5 }}>
        <Text>{item.name} - {item.time}</Text>
      </View>
    </TouchableOpacity>
  );
});

const getInitialItemsState = () => {
  const initialItems = {};
  // Remplir initialItems avec des données pour chaque jour (par exemple, les 100 premiers jours)
  // ...

  return initialItems;
};

const shiftTimeByTwoHours = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const shiftedHours = (hours + 2) % 24; // Ajouter 2 heures et prendre en compte le changement de jour
  return `${shiftedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
const transformEventData = (events) => {
  if (!Array.isArray(events)) {
    console.error('Les données des événements ne sont pas valides.');
    return {};
  }
  return events.reduce((transformedData, event) => {
    const eventDate = event.start.split('T')[0];
    const limitedDescription = event.description.substring(0, 20);

    if (!transformedData[eventDate]) {
      transformedData[eventDate] = [];
    }

    const eventTimestart = shiftTimeByTwoHours(event.start.split('T')[1].substring(0, 5));
    const eventTimeend = shiftTimeByTwoHours(event.end.split('T')[1].substring(0, 5));
    const eventDetails = {
      name: event.summary,
      height: 50,
      salle: event.location,
      time: eventTimestart +"-"+ eventTimeend,
      lat: event.lat,
      lng: event.lng,
      description: limitedDescription,
    };

    transformedData[eventDate].push(eventDetails);
    transformedData[eventDate].sort((a, b) => {
      // Tri par l'heure de départ
      const timeA = a.time.split(':')[0];
      const timeB = b.time.split(':')[0];
      return timeA - timeB;
    });

    return transformedData;
  }, {});
};

const AgendaScreen = () => {
  const navigation = useNavigation();
  const [eventsData, setEventsData] = useState(null);
  const [items, setItems] = useState(getInitialItemsState);
  const [selectedDay, setSelectedDay] = useState(Object.keys(items)[0]);

  const refreshPage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('calendarData');
      if (storedData) {
        setEventsData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données depuis AsyncStorage:', error);
    }
  };

  useEffect(() => {
    refreshPage();
  }, []);

  useEffect(() => {
    if (eventsData) {
      setItems(transformEventData(eventsData));
    }
  }, [eventsData]);

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        selected={selectedDay}
        items={{ [selectedDay]: items[selectedDay] || [] }}
        onDayPress={(day) => {
          setSelectedDay(day.dateString);
        }}
        renderItem={(item) => <EventItem item={item} navigation={navigation} />}
      />
      <TouchableOpacity onPress={refreshPage} style={styles.refreshButton}>
        <Text>Rafraîchir</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center'
  }
});

export default AgendaScreen;
