import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapaMotorista from '../homepage/MapaMotorista';
import MapaResponsavel from '../homepage/MapaResponsavel';
import { AuthContext } from '../../providers/AuthProvider';
import { userTypeEnum } from '../../utils/userTypeEnum';
import { FontAwesome } from '@expo/vector-icons';
import Students from '../students/Students';
import Vehicle from '../vehicle/Vehicle';
import Profile from '../profile/Profile';
import Homepage from '../homepage/Homepage';
import ProfileTab from '../profileTab/ProfileTab';
import ConfirmStudentAssociation from '../students/components/ConfirmStudentAssociation';
import Schools from '../schools/DriverSchools';
import DriverSchools from '../schools/DriverSchools';
import StudentDetail from '../students/components/StudentDetail';
import CreateStudent from '../students/components/CreateStudent';
import ConfirmDriverAndSchool from '../students/components/ConfirmDriverAndSchool';
import SchoolVehicleDetails from '../schools/components/SchoolVehicleDetails';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Homepage">
    <Stack.Screen name="Homepage" component={Homepage} options={{ headerShown: false }} />
    <Stack.Screen name="MapaMotorista" component={MapaMotorista} options={{ headerShown: false }} />
    <Stack.Screen name="MapaResponsavel" component={MapaResponsavel} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const PerfilRespStack = () => {
  return <Stack.Navigator initialRouteName={'Perfil'}>
    <Stack.Screen name="Perfil" component={ProfileTab} options={{ headerShown: false }} />
    <Stack.Screen name="Alunos" component={Students} options={{ headerShown: false }} />
    <Stack.Screen name="StudentDetail" component={StudentDetail} options={{ headerShown: false }} />
    <Stack.Screen name="CreateStudent" component={CreateStudent} options={{ headerShown: false }} />
    <Stack.Screen name="ConfirmDriverAndSchool" component={ConfirmDriverAndSchool} options={{ headerShown: false }} />
    <Stack.Screen name="VerPerfilMoto" component={Profile} options={{ headerShown: false }} />
    <Stack.Screen name="StudentAssociation" component={ConfirmStudentAssociation} options={{ headerShown: false }} />
  </Stack.Navigator>
};

const PerfilMotoStack = () => (
  <Stack.Navigator initialRouteName='Perfil'>
    <Stack.Screen name="Perfil" component={ProfileTab} options={{ headerShown: false }} />
    <Stack.Screen name="Veiculo" component={Vehicle} options={{ headerShown: false }} />
    <Stack.Screen name="VerPerfilMoto" component={Profile} options={{ headerShown: false }} />
    <Stack.Screen name="DriverSchools" component={DriverSchools} options={{ headerShown: false }} />
    <Stack.Screen name="SchoolVehicleDetails" component={SchoolVehicleDetails} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const PerfilAdminStack = () => (
  <Stack.Navigator initialRouteName='Perfil'>
    <Stack.Screen name="Perfil" component={ProfileTab} options={{ headerShown: false }} />
    <Stack.Screen name="Veiculo" component={Vehicle} options={{ headerShown: false }} />
    <Stack.Screen name="Alunos" component={Students} options={{ headerShown: false }} />
    <Stack.Screen name="StudentDetail" component={StudentDetail} options={{ headerShown: false }} />
    <Stack.Screen name="VerPerfilMoto" component={Profile} options={{ headerShown: false }} />
    <Stack.Screen name="StudentAssociation" component={ConfirmStudentAssociation} options={{ headerShown: false }} />
    <Stack.Screen name="ConfirmDriverAndSchool" component={ConfirmDriverAndSchool} options={{ headerShown: false }} />
    <Stack.Screen name="CreateStudent" component={CreateStudent} options={{ headerShown: false }} />
    <Stack.Screen name="DriverSchools" component={DriverSchools} options={{ headerShown: false }} />
    <Stack.Screen name="SchoolVehicleDetails" component={SchoolVehicleDetails} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const Tabs = () => {
  const {userData} = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptionsr={{
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
        userData?.user_type_id === userTypeEnum.RESPONSAVEL ?
        <>
          <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="home" size={24} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Mapa" component={MapaResponsavel} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="map" size={20} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Perfil" component={PerfilRespStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="user" size={24} color= {focused? '#C36005' : 'black'}/>)}} />        
        </>
        :
        userData?.user_type_id === userTypeEnum.MOTORISTA ?
        <>
          <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="home" size={24} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Mapa" component={MapaMotorista} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="map" size={20} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Perfil" component={PerfilMotoStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="user" size={24} color= {focused? '#C36005' : 'black'}/>)}} />        
        </>
        :
        <>
          <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="home" size={24} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Mapa" component={MapaMotorista} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="map" size={20} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Perfil" component={PerfilAdminStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="user" size={24} color= {focused? '#C36005' : 'black'}/>)}} />        
        </>
      }
    </Tab.Navigator>
  );
};

export default Tabs;