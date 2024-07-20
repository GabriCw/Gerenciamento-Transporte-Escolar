import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Button } from 'react-native-paper';

const TelaHome = ({ navigation }) => {

  useEffect(() => {
    const monitorAuthState = () => {
      onAuthStateChanged(auth, user => {
        if (!user) {
          navigation.navigate("Login");
          Toast.show({
            type: 'success',
            text1: 'Sucesso',
            text2: 'Logout realizado com sucesso!',
            visibilityTime: 3000,
          });
        }
      });
    };
    
    monitorAuthState();
  }, [navigation]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleMapaMotorista = () => {
    navigation.navigate("MapaMotorista");
  };

  const handleMapaResponsavel = () => {
    navigation.navigate("MapaResponsavel");
  };

  return (
    <View style={styles.view}>
      <View style={styles.header}>
        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={styles.buttonBack}
          labelStyle={styles.buttonLabel}
        >
          Sair
        </Button>
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Menu</Text>
          <View style={styles.content}>
            <Button 
              onPress={handleMapaResponsavel}
              style={styles.buttonBack}
              labelStyle={styles.buttonLabel}
            >
              Mapa Responsavel
            </Button>
            <Button 
              onPress={handleMapaMotorista}
              style={styles.buttonBack}
              labelStyle={styles.buttonLabel}
            >
              Mapa Motorista
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#090833',
  },
  header: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginTop: 50,
    backgroundColor: '#090833',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#090833',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#090833',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#C36005',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#FFF',
  }
});

export default TelaHome;