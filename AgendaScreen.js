    import React, { useState, useEffect } from 'react';
    import { View, TouchableOpacity, Text } from 'react-native';
    import { Agenda } from 'react-native-calendars';
    import { useNavigation } from '@react-navigation/native';
    import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

    const AgendaScreen = () => {
    const navigation = useNavigation();

    const [eventsData, setEventsData] = useState(null);


    const transformEventData = (events) => {
        const transformedData = {};
      
        events.forEach((event) => {
          const eventDate = event.start.split('T')[0]; // Récupérer la date au format 'YYYY-MM-DD'
      
          if (!transformedData[eventDate]) {
            transformedData[eventDate] = [];
          }
      
          transformedData[eventDate].push({
            name: event.summary,
            height: 50,
            salle: event.location,
            time: event.start.split('T')[1].substring(0, 5), // Récupérer l'heure au format 'HH:MM'
            lat: 45, // Si les données de latitude et longitude sont disponibles dans votre JSON
            lng: 40, // Si les données de latitude et longitude sont disponibles dans votre JSON
            description: event.description,
          });
        });
        console.log(transformedData)
        return transformedData;
      };
      useEffect(() => {
        (async () => {
          // Charger les données depuis AsyncStorage lors du chargement du composant
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
      

      const transformedData = eventsData ? transformEventData(eventsData) : {};


      const [items, setItems] = useState(transformedData);
    
      const [selectedDay, setSelectedDay] = useState(Object.keys(items)[0]);
    
      return (
        <View style={{ flex: 1 }}>
          <Agenda
            selected={selectedDay}
            items={{ [selectedDay]: items[selectedDay] || [] }}
            onDayPress={(day) => {
              setSelectedDay(day.dateString);
            }}
            renderItem={(item) => {
              return (
                <TouchableOpacity onPress={() => navigation.navigate('Map', { event: item })}>
                  <View style={{ padding: 10, backgroundColor: 'lightgray', margin: 5 }}>
                    <Text>{item.name} - {item.time}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      );
    };
    export default AgendaScreen;
