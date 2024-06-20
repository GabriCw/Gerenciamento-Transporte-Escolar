import React, { useState } from 'react';
import { View, StyleSheet, Text} from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const RegisterMotoristaScreen = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confSenha, setConfSenha] = useState('');
    const [placa, setPlaca] = useState('');

    const handleCadastro = () => {
        console.log('Dados do Motorista:', { nome, cpf, telefone, placa, email, senha, confSenha});

        navigation.navigate("Login");
    };

    return (
        <View style={styles.container}>
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
                />
                <TextInput
                    style={styles.input}
                    label="Confirme sua Senha"
                    mode="outlined"
                    value={confSenha}
                    onChangeText={text => setConfSenha(text)}
                    secureTextEntry={true}
                />
                <Button 
                    title="Cadastrar" 
                    onPress={handleCadastro} 
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                >
                    Cadastrar
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        marginBottom: 20,
        marginTop: 20,
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

export default RegisterMotoristaScreen;