import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { userTypeEnum } from '../../utils/userTypeEnum';
import { createUser, updateUserUuid } from '../../data/userServices';
import { auth } from '../../firebase/firebase';
import PageDefault from '../../components/pageDefault/PageDefault';
import { pointTypeEnum } from '../../utils/pointTypeEnum';

const RegisterResponsavelScreen = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confSenha, setConfSenha] = useState('');
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [estado, setEstado] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    const formatCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const formatRG = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{1})\d+?$/, '$1');
    };

    const formatTelefone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d)(\d{4})$/, '$1-$2');
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (!nome || !cpf || !rg || !telefone || !email) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'Todos os campos da primeira etapa são obrigatórios',
                    visibilityTime: 3000,
                });
                return;
            }
        } else if (step === 2) {
            if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'Todos os campos da segunda etapa são obrigatórios',
                    visibilityTime: 3000,
                });
                return;
            }
        }
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        if (step === 1) {
            return "Login"
        } else {
            setStep(step - 1);
        }
    };

    const buscarEndereco = async () => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'CEP não encontrado',
                    visibilityTime: 3000,
                });
            } else {
                setRua(data.logradouro);
                setBairro(data.bairro);
                setCidade(data.localidade);
                setEstado(data.uf);
            }
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao buscar endereço. Verifique sua conexão.',
                visibilityTime: 3000,
            });
        }
    };

    const handleCadastro = async () => {
        if (!nome || !cpf || !rg || !telefone || !email || !senha || !confSenha || !rua || !numero || !cidade || !bairro || !estado || !cep) {
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
            rg: rg.replace(/\D/g, ''),
            phone: telefone.replace(/\D/g, ''),
            user_type_id: userTypeEnum.RESPONSAVEL,
            address: {
                address: `${rua}, ${numero}`,
                city: cidade,
                neighborhood: bairro,
                state: estado,
                point_type_id: pointTypeEnum.RESIDÊNCIA
            }
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
                    setRg('');
                    setTelefone('');
                    setEmail('');
                    setRua('');
                    setNumero('');
                    setSenha('');
                    setConfSenha('');
                    setCidade('');
                    setBairro('');
                    setEstado('');
                    setCep('');
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
        <PageDefault headerTitle="Preencha seu cadastro" backNavigation={handlePreviousStep()} loading={isLoading}>
            <View style={styles.view}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.container}
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <View style={styles.content}>
                            {step === 1 && (
                                <>
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
                                        label="RG"
                                        mode="outlined"
                                        activeOutlineColor="#C36005"
                                        keyboardAppearance="dark"
                                        value={formatRG(rg)}
                                        onChangeText={(text) => setRg(text)}
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
                                        onChangeText={(text) => setEmail(text.toLowerCase())}
                                        keyboardType="email-address"
                                    />
                                    <Button
                                        mode="contained"
                                        onPress={handleNextStep}
                                        style={styles.button}
                                        labelStyle={styles.buttonLabel}
                                    >
                                        Continuar
                                    </Button>
                                </>
                            )}
                            {step === 2 && (
                                <>  
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 }}>
                                        <TextInput
                                            style={[styles.input, { marginRight: 10, width:'60%' }]}
                                            label="CEP"
                                            mode="outlined"
                                            activeOutlineColor="#C36005"
                                            keyboardAppearance="dark"
                                            value={cep}
                                            onChangeText={(text) => setCep(text)}
                                            keyboardType="numeric"
                                        />
                                        <Button
                                            mode="contained"
                                            onPress={buscarEndereco}
                                            style={[styles.buttonCEP, { width: '40%'}]}
                                            labelStyle={styles.buttonLabel}
                                        >
                                            Buscar
                                        </Button>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 }}>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                { width: '65%', marginRight: 10 },
                                                cep.length < 7 && styles.disabledInput
                                            ]}
                                            label="Rua"
                                            mode="outlined"
                                            activeOutlineColor="#C36005"
                                            keyboardAppearance="dark"
                                            value={rua}
                                            onChangeText={(text) => setRua(text)}
                                            editable={cep.length > 7}
                                        />
                                        <TextInput
                                            style={[
                                                styles.input,
                                                { width: '35%' },
                                                cep.length < 7 && styles.disabledInput
                                            ]}
                                            label="Número"
                                            mode="outlined"
                                            activeOutlineColor="#C36005"
                                            keyboardAppearance="dark"
                                            value={numero}
                                            onChangeText={(text) => setNumero(text)}
                                            keyboardType="numeric"
                                            editable={cep.length > 7}
                                        />
                                    </View>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            cep.length < 7 && styles.disabledInput
                                        ]}
                                        label="Bairro"
                                        mode="outlined"
                                        activeOutlineColor="#C36005"
                                        keyboardAppearance="dark"
                                        value={bairro}
                                        onChangeText={(text) => setBairro(text)}
                                        editable={cep.length > 7}
                                    />
                                    <TextInput
                                        style={[
                                            styles.input,
                                            cep.length < 7 && styles.disabledInput
                                        ]}
                                        label="Cidade"
                                        mode="outlined"
                                        activeOutlineColor="#C36005"
                                        keyboardAppearance="dark"
                                        value={cidade}
                                        onChangeText={(text) => setCidade(text)}
                                        editable={cep.length > 7}
                                    />
                                    <TextInput
                                        style={[
                                            styles.input,
                                            cep.length < 7 && styles.disabledInput
                                        ]}
                                        label="Estado"
                                        mode="outlined"
                                        activeOutlineColor="#C36005"
                                        keyboardAppearance="dark"
                                        value={estado}
                                        onChangeText={(text) => setEstado(text)}
                                        editable={cep.length > 7}
                                    />
                                    <Button
                                        mode="contained"
                                        onPress={handleNextStep}
                                        style={styles.button}
                                        labelStyle={styles.buttonLabel}
                                    >
                                        <Text>Continuar</Text>
                                    </Button>
                                </>
                            )}
                            {step === 3 && (
                                <>
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
                                        onPress={handleCadastro}
                                        style={styles.button}
                                        labelStyle={styles.buttonLabel}
                                        disabled={isLoading}
                                    >
                                        Finalizar Cadastro
                                    </Button>
                                </>
                            )}
                        </View>
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
    disabledInput: {
        backgroundColor: '#808080',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '15%',
    },
    button: {
        width: 200,
        backgroundColor: '#C36005',
        marginVertical: 10,
        borderRadius: 20,
        padding: 5,
    },
    buttonCEP: {
        height: 45,
        marginTop: 4,
        borderRadius: 20,
        backgroundColor: '#C36005',
        textAlign: 'center',
        alignContent: 'center',
        justifyContent: 'center',
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