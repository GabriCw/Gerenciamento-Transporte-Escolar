import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';

const ConfirmEmailScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>E-mail Enviado</Text>
            <Text style={styles.message}>
                Um e-mail de recuperação foi enviado para o seu endereço de e-mail. Verifique sua caixa de entrada e siga as instruções para alterar sua senha.
            </Text>
            <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Login')} 
                style={styles.button}
            >
                Voltar para Login
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        marginTop: 20,
    },
});

export default ConfirmEmailScreen;
