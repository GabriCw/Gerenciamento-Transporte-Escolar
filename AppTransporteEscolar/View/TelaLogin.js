import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

const TelaLoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [formData, setFormData] = useState({});

    const handlePress = () => {
        if (!email || !senha) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Todos os campos são obrigatórios'
            });
            return;
        }

        const data = {
            email: email,
            senha: senha
        };
        setFormData(data);
        console.log('Form Data:', data);

        Toast.show({
            type: 'success',
            text1: 'Sucesso',
            text2: 'Login efetuado com sucesso!'
        });

        setEmail('');
        setSenha('');
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
                    Enviar
                </Button>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleRegisterPress}>
                        <Text style={styles.link}>Cadastrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleForgotPasswordPress}>
                        <Text style={styles.link}>Esqueci a senha</Text>
                    </TouchableOpacity>
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
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#4B0082',
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
});

export default TelaLoginScreen;