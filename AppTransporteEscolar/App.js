import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={TelaLogin} options={{ headerShown: false }}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={RegisterResponsavelScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Students" component={Students} options={{ headerShown: false }}/>
            <Stack.Screen name="Homepage" component={Tabs} options={{ headerShown: false }}/>
          </Stack.Navigator>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;