import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleSendCode = () => {
        // Aqui você pode chamar uma API para enviar o código para o e-mail
        console.log('Email para recuperação:', email);
        navigation.navigate('ConfirmEmail'); // Navegar para a tela de confirmação do envio do e-mail
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
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
    }
});

export default ForgotPasswordScreen;
