import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ConfirmEmailScreen = ({ navigation }) => {
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
        > 
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
        </KeyboardAwareScrollView>
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
        backgroundColor: '#4B0082'
    },
});

export default ConfirmEmailScreen;