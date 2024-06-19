import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const TelaLogin = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [formData, setFormData] = useState({});

    const handlePress = () => {
        const data = {
            email: email,
            senha: senha
        };
        setFormData(data);
        console.log('Form Data:', data);
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

export default TelaLogin;
