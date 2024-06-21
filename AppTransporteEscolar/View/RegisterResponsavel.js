import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

const RegisterResponsavelScreen = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confSenha, setConfSenha] = useState('');

    const handleCadastro = () => {
        if (!nome || !cpf || !telefone || !email || !senha || !confSenha) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Todos os campos são obrigatórios',
                visibilityTime: 3000,
            });
            return;
        }

        console.log('Dados do Responsável:', { nome, cpf, telefone, email, senha, confSenha});

        Toast.show({
            type: 'success',
            text1: 'Sucesso',
            text2: 'Cadastro efetuado com sucesso!',
            visibilityTime: 3000,
        });

        navigation.navigate("Login");
    };

    return (
        <>
            <View style={styles.header}>
                        <Button 
                            mode="contained" 
                            onPress={() => navigation.navigate('Register')} 
                            style={styles.button}
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
                <View style={styles.container}>
                    
                    <View style={styles.content}>
                        <Text style={styles.title}>Cadastro do Responsável</Text>
                        <TextInput
                            style={styles.input}
                            label="Nome"
                            mode="outlined"
                            value={nome}
                            onChangeText={text => setNome(text)}
                        />
                        <TextInput
                            style={styles.input}
                            label="CPF"
                            mode="outlined"
                            value={cpf}
                            onChangeText={text => setCpf(text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            label="Telefone"
                            mode="outlined"
                            value={telefone}
                            onChangeText={text => setTelefone(text)}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            style={styles.input}
                            label="E-mail"
                            mode="outlined"
                            value={email}
                            onChangeText={text => setEmail(text)}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            label="Senha"
                            mode="outlined"
                            value={senha}
                            onChangeText={text => setSenha(text)}
                            secureTextEntry={true}
                            textContentType="none"
                            autoCompleteType="off"
                        />
                        <TextInput
                            style={styles.input}
                            label="Confirme sua Senha"
                            mode="outlined"
                            value={confSenha}
                            onChangeText={text => setConfSenha(text)}
                            secureTextEntry={true}
                            textContentType="none"
                            autoCompleteType="off"
                        />
                        <Button 
                            mode="contained" 
                            onPress={handleCadastro} 
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                        >
                            Cadastrar
                        </Button>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        marginLeft: 20,
        marginTop: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '20%',
    },
    button: {
        width: 150,
        backgroundColor: '#4B0082',
        marginVertical: 10,
    },
    buttonLabel: {
        color: 'white',
    },
});

export default RegisterResponsavelScreen;