import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { sendPasswordResetEmail } from 'firebase/auth';
import {auth} from "../../firebase/firebase";
import PageDefault from '../../components/pageDefault/PageDefault';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleSendCode = async() => {
        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Preencha o campo de Email',
                visibilityTime: 3000,
            });
            return;
        }

        try{
            await sendPasswordResetEmail(auth, email);
    
            navigation.navigate('ConfirmEmail');
        }
        catch(error){
            Toast.show({
                type: 'error',
                text1: 'Erro no envio do e-mail',
                text2: 'Insira um e-mail válido',
            });
        }
    };

    return (
    <PageDefault headerTitle="Esqueci minha senha">
        <View style={styles.view}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container2}>
                    <TextInput
                        style={styles.input}
                        label="Email Para Recuperação"
                        mode="outlined"
                        activeOutlineColor='#EF7D14'
                        keyboardAppearance='dark'
                        value={email}
                        onChangeText={text => setEmail(text.toLowerCase())}
                        keyboardType="email-address"
                    />
                    <Button 
                        mode="contained" 
                        onPress={handleSendCode} 
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        Enviar E-mail
                    </Button>
                </View>
            </KeyboardAwareScrollView>
        </View>
    </PageDefault>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
        width: "100%"
    },
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
        marginTop: '50%'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#C36005',
    },
    input: {
        marginBottom: 30,
        paddingTop: 10
    },
    button: {
        marginTop: 20,
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#C36005',
        padding: 5,
    },
    buttonBack: {
        width: 90,
        backgroundColor: '#C36005',
        marginVertical: 10,
    },
    buttonLabel: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ForgotPasswordScreen;
