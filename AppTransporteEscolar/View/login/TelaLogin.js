import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { signInWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';
import {auth} from "../../firebase/firebase";
import { getUserByEmail } from '../../data/userServices';

const TelaLogin = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogInAuthentication = async () => {
        const validEmail = await getUserByEmail(email);

        if(validEmail.status === 200){
            try {
                await signInWithEmailAndPassword(auth, email, senha);
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
                Toast.show({
                    type: 'error',
                    text1: 'Erro de Autenticação',
                    text2: 'Credencias Incorretas',
                });
            }
        }
        else{
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
        <View style= {styles.principalContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Seja bem vindo!</Text>
                <Text style={styles.subtitle}>Faça seu login para continuar</Text>
                <TextInput
                    label="Digite seu e-mail"
                    mode="outlined" 
                    activeOutlineColor='#C36005'
                    inputMode="email"
                    keyboardAppearance='dark'
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    label="Digite sua senha"
                    mode="outlined"
                    inputMode='text'
                    keyboardAppearance='dark'
                    activeOutlineColor='#C36005'
                    secureTextEntry={true}
                    value={senha}
                    onChangeText={text => setSenha(text)}
                />
                <TouchableOpacity onPress={handleForgotPasswordPress}>
                        <Text style={styles.forgotPass}>Esqueci minha senha</Text>
                    </TouchableOpacity>
                <Button mode="contained" onPress={handlePress} style={styles.button} labelStyle={styles.buttonLabel}>
                    Entrar
                </Button>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleRegisterPress}>
                    <Text style={styles.cadastre}>Não é cadastrado? <Text style={styles.span}>Cadastre-se aqui</Text></Text>
                </TouchableOpacity>
            </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    principalContainer: {
        flex: 1,
        backgroundColor: '#090833',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#090833',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#C36005',
    },
    subtitle: {
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFF',
        marginBottom: 50,
    },
    title_2: {
        fontSize: 16,
        marginTop: '40%',
        textAlign: 'center',
        color: '#C36005',
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#C36005',
        marginLeft: '30%',
        marginRight: '30%',
        padding: 5,
    },
    footer: {
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cadastre: {
        textAlign: 'center',
        fontSize: 16,
        color: '#ffff',
        fontFamily: '',
    },
    span: {
        color: '#C36005',
    },
    forgotPass: {
        fontSize: 13,
        color: '#ffff',
        fontFamily: '',
        textAlign: 'right',
        marginTop: 8,
        marginRight: 2,
        marginBottom: 20,
    },
    buttonLabel: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default TelaLogin;
