import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { userTypeEnum } from '../../utils/userTypeEnum';
import { createUser, updateUserUuid } from '../../data/userServices';
import { auth } from '../../firebase/firebase';


const RegisterResponsavelScreen = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [confSenha, setConfSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formatCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };
    
    const goToAluno = () => {
        navigation.navigate('RegisterAlunoEscolha');
    }

    const formatTelefone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d)(\d{4})$/, '$1-$2');
    };

    const handleCadastro = async () => {
        if (!nome || !cpf || !telefone || !email || !senha || !confSenha || !rua || !numero) {
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

        setIsLoading(true);

        const registerBody = {
            name: nome,
            email: email,
            cpf: cpf.replace(/\D/g, ''),
            cnh: '',
            rg: '',
            phone: telefone.replace(/\D/g, ''),
            user_type_id: userTypeEnum.RESPONSAVEL,
            address: `${rua}, ${numero}`,
        };

        const create = await createUser(registerBody);

        if (create.status === 201) {
            try {
                const firebaseCreateAuth = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    senha
                );

                const updateBody = {
                    user_id: create.data,
                    uuid: firebaseCreateAuth.user.uid,
                };

                const update = await updateUserUuid(updateBody);

                if (update.status === 200) {
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
                    setRua('');
                    setNumero('');
                    setSenha('');
                    setConfSenha('');
                    navigation.navigate('Login');
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Erro de Autenticação',
                        text2: create.data.details,
                    });
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro de Autenticação firebase',
                    text2: error.message,
                });
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Erro de Autenticação',
                text2: 'Erro ao cadastrar usuário (checar credenciais)',
            });
        }

        setIsLoading(false);
    };

    return (
        <View style={styles.view}>
            <View style={styles.header}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('RegisterAlunoEscolha')}
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
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            value={nome}
                            onChangeText={(text) => setNome(text)}
                        />
                        <TextInput
                            style={styles.input}
                            label="CPF"
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            value={formatCPF(cpf)}
                            onChangeText={(text) => setCpf(text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            label="Telefone"
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            value={formatTelefone(telefone)}
                            onChangeText={(text) => setTelefone(text)}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            style={styles.input}
                            label="E-mail"
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            keyboardType="email-address"
                        />
                        <View style={{width:'100%', display: 'flex', flexDirection: 'row'}}>
                            <TextInput
                                style={[styles.input, { width: '65%', marginRight: '5%' }]}
                                label="Rua"
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                                value={rua}
                                onChangeText={(text) => setRua(text)}
                            />
                            <TextInput
                                style={[styles.input, { width: '30%' }]}
                                label="N°"
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                                value={numero}
                                onChangeText={(text) => setNumero(text)}
                                keyboardType="numeric"
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            label="Senha"
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            value={senha}
                            onChangeText={(text) => setSenha(text)}
                            secureTextEntry={true}
                            textContentType="none"
                            autoCompleteType="off"
                        />
                        <TextInput
                            style={styles.input}
                            label="Confirme sua Senha"
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            value={confSenha}
                            onChangeText={(text) => setConfSenha(text)}
                            secureTextEntry={true}
                            textContentType="none"
                            autoCompleteType="off"
                        />
                        <Button
                            mode="contained"
                            // onPress={handleCadastro}
                            onPress={goToAluno}
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                            disabled={isLoading}
                        >
                            Cadastrar
                        </Button>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#C36005" />
                </View>
            )}
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RegisterResponsavelScreen;