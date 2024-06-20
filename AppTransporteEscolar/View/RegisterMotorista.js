import React, { useState } from 'react';
import { View, StyleSheet, Text} from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const RegisterMotoristaScreen = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [placaVeiculo, setPlacaVeiculo] = useState('');

    const handleCadastro = () => {
        console.log('Dados do Motorista:', { nome, cpf, placaVeiculo });

        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro de Motorista</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={text => setNome(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="CPF"
                value={cpf}
                onChangeText={text => setCpf(text)}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Placa do Veículo"
                value={placaVeiculo}
                onChangeText={text => setPlacaVeiculo(text)}
            />
            <Button title="Cadastrar" onPress={handleCadastro} />
        </View>
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
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});

export default RegisterMotoristaScreen;
