    import React, { useState } from 'react';
    import { View, TouchableOpacity, Text } from 'react-native';
    import { Agenda } from 'react-native-calendars';
    import { useNavigation } from '@react-navigation/native';

    const AgendaScreen = () => {
    const navigation = useNavigation();

    const [items, setItems] = useState({
        '2023-10-02': 
        [
            { name: 'Math', height: 50, salle:'4c39', time: '09:00', lat: 45.640517637636094, lng: 5.8704033843112, description: 'Cours de maths' },
            { name: 'chinois', height: 50, salle:'4c34', time: '10:00', lat: 45.640517637636094, lng: 5.8704033843112, description: 'Cours de maths' }
        ],
        '2023-10-03': [{ name: 'anglais', height: 50,salle:'8c39', time: '09:00', lat: 45.641418, lng: 5.869103, description: 'Cours de maths' }],
        // ... autres événements
    });

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
                <TouchableOpacity
                onPress={() => navigation.navigate('Map', { event: item })}
                >
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
