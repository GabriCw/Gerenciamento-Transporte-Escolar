import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import TelaLoginScreen from './View/TelaLogin';
import RegisterScreen from './View/Register';
import ForgotPasswordScreen from './View/ForgotPasswordScreen';
import ConfirmEmailScreen from './View/ConfirmEmailScreen';
import RegisterMotoristaScreen from './View/RegisterMotorista';
import RegisterResponsavelScreen from './View/RegisterResponsavel';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={TelaLoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="RegisterMotorista" component={RegisterMotoristaScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="RegisterResponsavel" component={RegisterResponsavelScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};

export default App;