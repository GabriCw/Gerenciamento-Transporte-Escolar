import 'react-native-gesture-handler';
import * as React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import TelaLogin from "./View/login/TelaLogin"
import ForgotPasswordScreen from './View/login/ForgotPasswordScreen';
import ConfirmEmailScreen from './View/login/ConfirmEmailScreen';
import RegisterResponsavelScreen from './View/login/RegisterResponsavel';
import Tabs from './View/navigation/tabs';
import { AuthProvider } from './providers/AuthProvider';
import { Provider as PaperProvider } from 'react-native-paper';
import Students from './View/students/Students';
import { LogBox } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  
  LogBox.ignoreLogs([
    'Found screens with the same name nested inside one another',
  ]);
  LogBox.ignoreAllLogs();

  const lightTheme = {
    background: '#ffffff',
    text: '#000000',
  };

  return (
    <AuthProvider>
      <PaperProvider theme={lightTheme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={TelaLogin} options={{ headerShown: false }}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={RegisterResponsavelScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Students" component={Students} options={{ headerShown: false }}/>
            <Stack.Screen name="Homepage" component={Tabs} options={{ headerShown: false }}/>
          </Stack.Navigator>
          <Toast/>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;