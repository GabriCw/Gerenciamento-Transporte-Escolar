import React, { useContext, useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { signInWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';
import {auth} from "../../firebase/firebase";
import { getUserByEmail } from '../../data/userServices';
import { AuthContext } from '../../providers/AuthProvider';
import MonitoraLogo from '../../assets/Logo/laranja-branco-pinbranco.png';

const TelaLogin = ({ navigation }) => {
    const {handleGenerateToken, handleVerifyStudent, handleGetUserDetails} = useContext(AuthContext);

    // const [email, setEmail] = useState('felipesilvieri@yahoo.com');
    // const [senha, setSenha] = useState('felipe123');
    const [email, setEmail] = useState('gilberto.motorista@gmail.com');
    const [senha, setSenha] = useState('motorista123');
    const [isLoading, setIsLoading] = useState(false);


    const handleLogInAuthentication = async () => {
        setIsLoading(true);

        const validEmail = await getUserByEmail(email);

        if(validEmail.status === 200){
            try {
                await Promise.all([signInWithEmailAndPassword(auth, email, senha), handleGenerateToken(), 
                    handleGetUserDetails(validEmail?.data?.id), handleVerifyStudent(validEmail?.data)]);

                    navigation.navigate('Homepage');
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

        setIsLoading(false);
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
        <View style={styles.logoWrapper}>
            <Image
                source={MonitoraLogo}
                style={styles.logo}
            />
        </View>
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
                    onChangeText={text => setEmail(text.toLowerCase())}
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
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#C36005" />
                </View>
            )}
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    logoWrapper:{
        marginTop: 85,
        marginBottom: 35,
    },
    logo:{
        width: 150,
        height: 150,
        alignSelf: 'center',
        justifyContent:'center',
        alignItems: 'center',
    },
    principalContainer: {
        flex: 1,
        backgroundColor: '#090833',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TelaLogin;
