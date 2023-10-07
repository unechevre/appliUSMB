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
      setItems({}/*transformEventData(eventsData)*/);
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
