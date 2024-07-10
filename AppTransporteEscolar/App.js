import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import TelaLogin from "./View/login/TelaLogin"
import ForgotPasswordScreen from './View/login/ForgotPasswordScreen';
import ConfirmEmailScreen from './View/login/ConfirmEmailScreen';
import RegisterMotoristaScreen from './View/login/RegisterMotorista';
import RegisterResponsavelScreen from './View/login/RegisterResponsavel';
import TelaHomeScreen from './View/homepage/TelaHome';
import MapaMotorista from './View/homepage/MapaMotorista';
import MapaResponsavel from './View/homepage/MapaResponsavel';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={TelaLogin} options={{ headerShown: false }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterResponsavelScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="TelaHome" component={TelaHomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="MapaMotorista" component={MapaMotorista} options={{ headerShown: false }}/>
        <Stack.Screen name="MapaResponsavel" component={MapaResponsavel} options={{ headerShown: false }}/>
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};

export default App;