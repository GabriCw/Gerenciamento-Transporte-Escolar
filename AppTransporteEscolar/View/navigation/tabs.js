import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TelaHome from '../homepage/TelaHome';
import MapaMotorista from '../homepage/MapaMotorista';
import MapaResponsavel from '../homepage/MapaResponsavel';
import PerfilResp from '../homepage/PerfilResp';
import VerPerfilResp from '../homepage/VerPerfilResp';
import PerfilMoto from '../homepage/PerfilMoto';
import VerPerfilMoto from '../homepage/VerPerfilMoto';
import { AuthContext } from '../../providers/AuthProvider';
import { userTypeEnum } from '../../utils/userTypeEnum';
import { FontAwesome } from '@expo/vector-icons';
import Students from '../students/Students';
import Vehicle from '../vehicle/Vehicle';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="HomeTela">
    <Stack.Screen name="HomeTela" component={TelaHome} options={{ headerShown: false }} />
    <Stack.Screen name="MapaMotorista" component={MapaMotorista} options={{ headerShown: false }} />
    <Stack.Screen name="MapaResponsavel" component={MapaResponsavel} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const PerfilRespStack = () => {
  return <Stack.Navigator initialRouteName={'Perfil'}>
    <Stack.Screen name="Perfil" component={PerfilResp} options={{ headerShown: false }} />
    <Stack.Screen name="Alunos" component={Students} options={{ headerShown: false }} />
    <Stack.Screen name="VerPerfilResp" component={VerPerfilResp} options={{ headerShown: false }} />
  </Stack.Navigator>
};

const PerfilMotoStack = () => (
  <Stack.Navigator initialRouteName='Perfil'>
    <Stack.Screen name="Perfil" component={PerfilMoto} options={{ headerShown: false }} />
    <Stack.Screen name="Veiculo" component={Vehicle} options={{ headerShown: false }} />
    <Stack.Screen name="VerPerfilMoto" component={VerPerfilMoto} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const Tabs = () => {
  const {userData, hasStudent} = useContext(AuthContext);

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#C36005',
        inactiveTintColor: 'black',
        style: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          shadowOffset: {width: 5, height: 3},
          shadowColor: 'black',
          shadowOpacity: 0.5,
          elevation: 5,
        },
      }}
    >
      {
        userData.user_type_id === userTypeEnum.ADMINISTRADOR ?
        <>
          <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="home" size={24} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Mapa" component={MapaMotorista} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="map" size={20} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Perfil" component={PerfilRespStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="user" size={24} color= {focused? '#C36005' : 'black'}/>)}} />        
        </>
        :
        <>
          <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="home" size={24} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Mapa" component={MapaMotorista} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="map" size={20} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Perfil" component={PerfilMotoStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="user" size={24} color= {focused? '#C36005' : 'black'}/>)}} />        
        </>
      }
    </Tab.Navigator>
  );
};

export default Tabs;