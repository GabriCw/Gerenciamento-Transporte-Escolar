import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { userTypeEnum } from '../../utils/userTypeEnum';
import { createUser, updateUserUuid } from '../../data/userServices';
import {auth} from "../../firebase/firebase";

const RegisterResponsavelScreen = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confSenha, setConfSenha] = useState('');

    const handleCadastro = async () => {
        if (!nome || !cpf || !telefone || !email || !senha || !confSenha) {
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

        const registerBody = {
            name: nome,
            email: email,
            cpf: cpf,
            cnh: "",
            rg: "",
            user_type_id: userTypeEnum.RESPONSAVEL,
        };

        const create = await createUser(registerBody);

        if(create.status === 201){
            try{
                const firebaseCreateAuth = await createUserWithEmailAndPassword(auth, email, senha);
                
                const updateBody = {
                    user_id: create.data,
                    uuid: firebaseCreateAuth.user.uid
                };
                    
                const update = await updateUserUuid(updateBody);
    
                if(update.status === 200){
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
                    navigation.navigate("Login");
                }
                else{
                    Toast.show({
                        type: 'error',
                        text1: 'Erro de Autenticação',
                        text2: create.data.details
                    });
                }
            }
            catch(error){
                Toast.show({
                    type: 'error',
                    text1: 'Erro de Autenticação firebase',
                    text2: error.message
                });
            }
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro de Autenticação',
                text2: 'Erro ao cadastrar usuário (checar credenciais)'
            });
        }
    };

    return (
        <View style={styles.view}>
            <View style={styles.header}>
                        <Button 
                            mode="contained" 
                            onPress={() => navigation.navigate('Login')} 
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
                        <Text style={styles.title}>Preencha seu cadastro</Text>
                        <TextInput
                            style={styles.input}
                            label="Nome"
                            mode='outlined'
                            activeOutlineColor='#C36005'
                            keyboardAppearance='dark'
                            value={nome}
                            onChangeText={text => setNome(text)}
                        />
                        <TextInput
                            style={styles.input}
                            label="CPF"
                            mode="outlined"
                            activeOutlineColor='#C36005'
                            keyboardAppearance='dark'
                            value={cpf}
                            onChangeText={text => setCpf(text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            label="Telefone"
                            mode="outlined"
                            activeOutlineColor='#C36005'
                            keyboardAppearance='dark'
                            value={telefone}
                            onChangeText={text => setTelefone(text)}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            style={styles.input}
                            label="E-mail"
                            mode="outlined"
                            activeOutlineColor='#C36005'
                            keyboardAppearance='dark'
                            value={email}
                            onChangeText={text => setEmail(text)}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            label="Senha"
                            mode="outlined"
                            activeOutlineColor='#C36005'
                            keyboardAppearance='dark'
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
                            activeOutlineColor='#C36005'
                            keyboardAppearance='dark'
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
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
    },
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
        textAlign: 'center',
        marginBottom: 50,
        color: '#C36005',
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
        paddingTop: '15%',
    },
    button: {
        width: 150,
        backgroundColor: '#C36005',
        marginVertical: 10,
        borderRadius: 20,
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

export default RegisterResponsavelScreen;