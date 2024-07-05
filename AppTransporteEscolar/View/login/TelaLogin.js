import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { initializeApp } from '@firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDhILsHN9bHVEA-gBc6iPHuqnctPGiQLRQ",
    authDomain: "auth-van-tcc.firebaseapp.com",
    projectId: "auth-van-tcc",
    storageBucket: "auth-van-tcc.appspot.com",
    messagingSenderId: "91731709434",
    appId: "1:91731709434:web:5a73b9c1a4c43e2a852843",
    measurementId: "G-HKEVN6CQX4"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const TelaLogin = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                // navigation.navigate('TelaHome');
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [navigation]);

    const handleLogInAuthentication = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, senha);
            console.log('User signed in successfully!');
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Autenticação efetuada com sucesso!',
            });
            setEmail('');
            setSenha('');
            navigation.navigate('TelaHome');
            }
        catch (error) {
            console.error('Authentication error:', error.message);
            Toast.show({
                type: 'error',
                text1: 'Erro de Autenticação',
                text2: 'Credencias Incorretas',
            });
        }
    };

    const handlePress = () => {
        if (!email || !senha) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Todos os campos são obrigatórios',
            });
            return;
        }

        handleLogInAuthentication();
    };

    const handleRegisterPress = () => {
        navigation.navigate('Register');
    };

    const handleForgotPasswordPress = () => {
        navigation.navigate('ForgotPassword');
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <Text style={styles.title}>Faça Seu Login</Text>
                <TextInput
                    label="Digite seu e-mail"
                    mode="outlined"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    label="Digite sua senha"
                    mode="outlined"
                    secureTextEntry={true}
                    value={senha}
                    onChangeText={text => setSenha(text)}
                    style={styles.input}
                />
                <Button mode="contained" onPress={handlePress} style={styles.button}>
                    Entrar
                </Button>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleRegisterPress}>
                        <Text style={styles.link}>Cadastrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleForgotPasswordPress}>
                        <Text style={styles.link}>Esqueci a senha</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.title_2}>Caso seja um motorista parceiro faça seu login por aqui</Text>
                    <Button mode="contained" style={styles.button_motorista}>
                        <Text style={styles.link}>Motorista</Text>
                    </Button>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        marginTop: '25%',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    title_2: {
        fontSize: 16,
        marginTop: '40%',
        textAlign: 'center',
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#4B0082',
        marginLeft: '30%',
        marginRight: '30%',
        padding: 5,
    },
    footer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    link: {
        fontSize: 16,
        color: '#1E90FF',
    },
    button_motorista: {
        marginTop: '1%',
        backgroundColor: 'transparent',
        marginLeft: '30%',
        marginRight: '30%',
    },
});

export default TelaLogin;
