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

const AgendaScreen = () => {
  const navigation = useNavigation();
  const [eventsData, setEventsData] = useState(null);
  const [items, setItems] = useState({});
  const [selectedDay, setSelectedDay] = useState('');

  const refreshPage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('calendarData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setEventsData(parsedData);
        setSelectedDay(Object.keys(parsedData)[0]); // Sélectionner le premier jour par défaut
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données depuis AsyncStorage:', error);
    }
  };

  useEffect(() => {
    refreshPage();
  }, []);

  useEffect(() => {
    // Filtrer les événements pour ne montrer que ceux du jour sélectionné
    if (selectedDay && eventsData) {
      const selectedEvents = eventsData[selectedDay] || [];
      setItems({ [selectedDay]: selectedEvents });
    }
  }, [selectedDay, eventsData]);

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        selected={selectedDay}
        items={items}
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
