import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AgendaScreen from './AgendaScreen';
import MapScreen from './MapScreen';
import ClassScreen from './ClassScreen'; // Vous devez créer ce fichier

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Agenda">
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Classe" component={ClassScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
