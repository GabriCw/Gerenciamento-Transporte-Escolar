import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TelaHome from '../homepage/TelaHome';
import MapaMotorista from '../homepage/MapaMotorista';
import MapaResponsavel from '../homepage/MapaResponsavel';
import PerfilResp from '../homepage/PerfilResp';
import RegisterAlunos from '../login/RegisterAluno';
import VerPerfilResp from '../homepage/VerPerfilResp';
import { AuthContext } from '../../providers/AuthProvider';
import { userTypeEnum } from '../../utils/userTypeEnum';

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
    <Stack.Screen name="Perfil" component={PerfilResp} options={{ headerShown: false }} />
    <Stack.Screen name="Alunos" component={RegisterAlunos} options={{ headerShown: false }} />
    <Stack.Screen name="VerPerfilResp" component={VerPerfilResp} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const Tabs = () => {
  const {userData} = useContext(AuthContext);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Mapa" component={MapaMotorista} options={{ headerShown: false }}/>
      <Tab.Screen name="Perfil" component={PerfilStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default Tabs;
