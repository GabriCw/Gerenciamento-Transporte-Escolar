import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import TelaHome from '../homepage/TelaHome';
import MapaMotorista from '../homepage/MapaMotorista';
import MapaResponsavel from '../homepage/MapaResponsavel';
import Perfil from '../homepage/Perfil';
import Alunos from '../homepage/Alunos';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="HomeTela">
    <Stack.Screen name="HomeTela" component={TelaHome} options={{ headerShown: false }} />
    <Stack.Screen name="MapaMotorista" component={MapaMotorista} options={{ headerShown: false }} />
    <Stack.Screen name="MapaResponsavel" component={MapaResponsavel} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const PerfilStack = () => (
  <Stack.Navigator initialRouteName='Perfil'>
    <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
    <Stack.Screen name="Alunos" component={Alunos} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={PerfilStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default Tabs;
