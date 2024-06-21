import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleSendCode = () => {
        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Preencha o campo de Email',
                visibilityTime: 3000,
            });
            return;
        }

        console.log('Email para recuperação:', email);

        Toast.show({
            type: 'success',
            text1: 'Sucesso',
            text2: 'Email enviado com sucesso!',
            visibilityTime: 3000,
        });

        navigation.navigate('ConfirmEmail'); // Navegar para a tela de confirmação do envio do e-mail
    };

    return (
        <>
            <View style={styles.header}>
                <Button 
                    mode="contained" 
                    onPress={() => navigation.navigate('Register')} 
                    style={styles.buttonBack}
                    labelStyle={styles.buttonLabel}
                >
                    Voltar
                </Button>
            </View>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container2}>
                    <Text style={styles.title}>Esqueci Minha Senha</Text>
                    <TextInput
                        style={styles.input}
                        label="Email Para Recuperação"
                        mode="outlined"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        keyboardType="email-address"
                    />
                    <Button 
                        mode="contained" 
                        onPress={handleSendCode} 
                        style={styles.button}
                    >
                        Enviar E-mail
                    </Button>
                </View>
            </KeyboardAwareScrollView>
        </>
        
    );
};

const styles = StyleSheet.create({
    header: {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        marginTop: 40,
        marginLeft: 20
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        marginTop: 100
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#4B0082',
    },
    buttonBack: {
        width: 150,
        backgroundColor: '#4B0082',
        marginVertical: 10,
    },
    buttonLabel: {
        color: 'white',
    },
});

export default ForgotPasswordScreen;
