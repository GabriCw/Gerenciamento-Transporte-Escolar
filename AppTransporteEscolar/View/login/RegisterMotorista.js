import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import {auth} from "../../firebase/firebase";

const RegisterMotoristaScreen = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confSenha, setConfSenha] = useState('');
    const [placa, setPlaca] = useState('');

    const handleCadastro = async () => {
        if (!nome || !cpf || !telefone || !email || !senha || !confSenha || !placa) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Todos os campos são obrigatórios',
                visibilityTime: 3000,
            });
            return;
        }

        if (senha !== confSenha) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'As senhas não coincidem',
                visibilityTime: 3000,
            });
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, senha);
            console.log('Usuário criado com sucesso!');
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Cadastro realizado com sucesso!',
                visibilityTime: 3000,
            });
            setNome('');
            setCpf('');
            setTelefone('');
            setEmail('');
            setSenha('');
            setConfSenha('');
            setPlaca('');
            navigation.navigate("Login");
        } catch (error) {
            console.error('Erro de autenticação:', error.message);
            Toast.show({
                type: 'error',
                text1: 'Erro de Autenticação',
                text2: 'Erro ao cadastrar usuário (checar credenciais)',
            });
        }
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
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Cadastro do Motorista</Text>
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
                            label="Placa do Veículo"
                            mode="outlined"
                            value={placa}
                            onChangeText={text => setPlaca(text)}
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
        marginTop: 40,
        marginLeft: 20,
    },
    container: {
        flexGrow: 1,
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
        paddingTop: '10%',
    },
    button: {
        width: 150,
        backgroundColor: '#4B0082',
        marginVertical: 10,
    },
    buttonBack: {
        width: 90,
        backgroundColor: '#4B0082',
        marginVertical: 10,
    },
    buttonLabel: {
        color: 'white',
    },
});

export default RegisterMotoristaScreen;
