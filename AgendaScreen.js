import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
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

const transformEventData = (events) => {
  return events.reduce((transformedData, event) => {
    const eventDate = event.start.split('T')[0];
    const limitedDescription = event.description.substring(0, 20);

    if (!transformedData[eventDate]) {
      transformedData[eventDate] = [];
    }

    transformedData[eventDate].push({
      name: event.summary,
      height: 50,
      salle: event.location,
      time: event.start.split('T')[1].substring(0, 5),
      lat: 45.640517637636094,
      lng: 5.8704033843112,
      description: limitedDescription,
    });

    return transformedData;
  }, {});
};

const AgendaScreen = () => {
  const navigation = useNavigation();
  const [eventsData, setEventsData] = useState(null);
  const [items, setItems] = useState(getInitialItemsState);
  const [selectedDay, setSelectedDay] = useState(Object.keys(items)[0]);

  useEffect(() => {
    (async () => {
      try {
        const storedData = await AsyncStorage.getItem('calendarData');
        if (storedData) {
          setEventsData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données depuis AsyncStorage:', error);
      }
    })();
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
    </View>
  );
};

export default AgendaScreen;
