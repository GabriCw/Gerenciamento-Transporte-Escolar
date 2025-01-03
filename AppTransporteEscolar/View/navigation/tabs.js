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
import StudentDetail from '../students/components/StudentDetail';
import CreateStudent from '../students/components/CreateStudent';
import ConfirmDriverAndSchool from '../students/components/ConfirmDriverAndSchool';
import Schools from '../school/Schools';
import AllSchoolsList from '../school/components/AllSchoolsList';
import SchoolsDetails from '../school/components/SchoolsDetails';
import RemoveUser from '../profile/components/RemoveUser';
import ParentNotifications from '../parentNotifications/ParentNotifications';
import CreateNotification from '../parentNotifications/components/CreateNotification';
import PastNotificationsList from '../parentNotifications/components/PastNotificationList';
import CreateVehicle from '../vehicle/components/CreateVehicle';
import VehicleDetails from '../vehicle/components/VehicleDetails';
import DriverScheduleHistoric from '../driverScheduleHistoric/DriverScheduleHistoric';
import DriverScheduleHistoricDetails from '../driverScheduleHistoric/components/DriverScheduleHistoricDetails';
import ResponsibleScheduleHistoric from '../responsibleScheduleHistoric/ResponsibleScheduleHistoric';
import ResponsibleScheduleHistoricDetails from '../responsibleScheduleHistoric/components/ResponsibleScheduleHistoricDetails';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PerfilRespStack = () => {
  return <Stack.Navigator initialRouteName={'Perfil'}>
    <Stack.Screen name="Perfil" component={ProfileTab} options={{ headerShown: false }} />
    <Stack.Screen name="Alunos" component={Students} options={{ headerShown: false }} />
    <Stack.Screen name="StudentDetail" component={StudentDetail} options={{ headerShown: false }} />
    <Stack.Screen name="CreateStudent" component={CreateStudent} options={{ headerShown: false }} />
    <Stack.Screen name="ConfirmDriverAndSchool" component={ConfirmDriverAndSchool} options={{ headerShown: false }} />
    <Stack.Screen name="VerPerfilMoto" component={Profile} options={{ headerShown: false }} />
    <Stack.Screen name="StudentAssociation" component={ConfirmStudentAssociation} options={{ headerShown: false }} />
    <Stack.Screen name="RemoveUser" component={RemoveUser} options={{ headerShown: false }} />
    <Stack.Screen name="ParentNotifications" component={ParentNotifications} options={{ headerShown: false }} />
    <Stack.Screen name="CreateNotification" component={CreateNotification} options={{ headerShown: false }} />
    <Stack.Screen name="PastNotificationsList" component={PastNotificationsList} options={{ headerShown: false }} />
    <Stack.Screen name="ResponsibleScheduleHistoric" component={ResponsibleScheduleHistoric} options={{ headerShown: false }} />
    <Stack.Screen name="ResponsibleScheduleHistoricDetails" component={ResponsibleScheduleHistoricDetails} options={{ headerShown: false }} />
  </Stack.Navigator>
};

const PerfilMotoStack = () => (
  <Stack.Navigator initialRouteName='Perfil'>
    <Stack.Screen name="Perfil" component={ProfileTab} options={{ headerShown: false }} />
    <Stack.Screen name="Veiculo" component={Vehicle} options={{ headerShown: false }} />
    <Stack.Screen name="CreateVehicle" component={CreateVehicle} options={{ headerShown: false }} />
    <Stack.Screen name="VehicleDetails" component={VehicleDetails} options={{ headerShown: false }} />
    <Stack.Screen name="VerPerfilMoto" component={Profile} options={{ headerShown: false }} />
    <Stack.Screen name="Schools" component={Schools} options={{ headerShown: false }} />
    <Stack.Screen name="AllSchoolsList" component={AllSchoolsList} options={{ headerShown: false }} />
    <Stack.Screen name="SchoolsDetails" component={SchoolsDetails} options={{ headerShown: false }} />
    <Stack.Screen name="RemoveUser" component={RemoveUser} options={{ headerShown: false }} />
    <Stack.Screen name="DriverScheduleHistoric" component={DriverScheduleHistoric} options={{ headerShown: false }} />
    <Stack.Screen name="DriverScheduleHistoricDetails" component={DriverScheduleHistoricDetails} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const PerfilAdminStack = () => (
  <Stack.Navigator initialRouteName='Perfil'>
    <Stack.Screen name="Perfil" component={ProfileTab} options={{ headerShown: false }} />
    <Stack.Screen name="Veiculo" component={Vehicle} options={{ headerShown: false }} />
    <Stack.Screen name="CreateVehicle" component={CreateVehicle} options={{ headerShown: false }} />
    <Stack.Screen name="VehicleDetails" component={VehicleDetails} options={{ headerShown: false }} />
    <Stack.Screen name="Alunos" component={Students} options={{ headerShown: false }} />
    <Stack.Screen name="StudentDetail" component={StudentDetail} options={{ headerShown: false }} />
    <Stack.Screen name="VerPerfilMoto" component={Profile} options={{ headerShown: false }} />
    <Stack.Screen name="StudentAssociation" component={ConfirmStudentAssociation} options={{ headerShown: false }} />
    <Stack.Screen name="ConfirmDriverAndSchool" component={ConfirmDriverAndSchool} options={{ headerShown: false }} />
    <Stack.Screen name="CreateStudent" component={CreateStudent} options={{ headerShown: false }} />
    <Stack.Screen name="Schools" component={Schools} options={{ headerShown: false }} />
    <Stack.Screen name="AllSchoolsList" component={AllSchoolsList} options={{ headerShown: false }} />
    <Stack.Screen name="SchoolsDetails" component={SchoolsDetails} options={{ headerShown: false }} />
    <Stack.Screen name="RemoveUser" component={RemoveUser} options={{ headerShown: false }} />
    <Stack.Screen name="ParentNotifications" component={ParentNotifications} options={{ headerShown: false }} />
    <Stack.Screen name="CreateNotification" component={CreateNotification} options={{ headerShown: false }} />
    <Stack.Screen name="PastNotificationsList" component={PastNotificationsList} options={{ headerShown: false }} />
    <Stack.Screen name="DriverScheduleHistoric" component={DriverScheduleHistoric} options={{ headerShown: false }} />
    <Stack.Screen name="DriverScheduleHistoricDetails" component={DriverScheduleHistoricDetails} options={{ headerShown: false }} />
    <Stack.Screen name="ResponsibleScheduleHistoric" component={ResponsibleScheduleHistoric} options={{ headerShown: false }} />
    <Stack.Screen name="ResponsibleScheduleHistoricDetails" component={ResponsibleScheduleHistoricDetails} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const Tabs = () => {
  const {userData} = useContext(AuthContext);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        activeTintColor: '#C36005',
        inactiveTintColor: 'black',
        tabBarStyle: {
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
          <Tab.Screen name="Mapa" component={MapaResponsavel} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="map" size={20} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Perfil" component={PerfilRespStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="user" size={24} color= {focused? '#C36005' : 'black'}/>)}} />        
        </>
        :
        userData?.user_type_id === userTypeEnum.MOTORISTA ?
        <>
          <Tab.Screen name="Mapa" component={MapaMotorista} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="map" size={20} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Perfil" component={PerfilMotoStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="user" size={24} color= {focused? '#C36005' : 'black'}/>)}} />        
        </>
        :
        <>
          <Tab.Screen name="Mapa" component={MapaMotorista} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="map" size={20} color= {focused? '#C36005' : 'black'}/>)}} />
          <Tab.Screen name="Perfil" component={PerfilAdminStack} options={{ headerShown: false, tabBarIcon: ({focused}) =>(<FontAwesome name="user" size={24} color= {focused? '#C36005' : 'black'}/>)}} />        
        </>
      }
    </Tab.Navigator>
  );
};

export default Tabs;