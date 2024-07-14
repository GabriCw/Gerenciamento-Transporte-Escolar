import { React, useState } from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RegisterAlunoEscolha = ({navigation}) => {

    const handleDepois = () => {
        navigation.navigate('Login');
    }

    const handleCadastrar = () => {
        navigation.navigate('RegisterAluno');
    }


    return (
        <View style={styles.view}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Cadastro de Alunos</Text>
                    <Text style={styles.subtitle}>Gostaria de cadastrar no seu perfil um aluno?</Text>
                    <View style={styles.btn_container}>
                        <Button mode="contained" style={styles.button} onPress={handleCadastrar}>Cadastrar Aluno</Button>
                        <Button mode="contained" style={styles.button} onPress={handleDepois}>Deixar para depois</Button>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
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
    subtitle: {
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFF',
        marginBottom: 50,
    },
    button: {
        width: 200,
        backgroundColor: '#C36005',
        marginVertical: 10,
        borderRadius: 20,
        padding: 5,
    },
    btn_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        maxHeight: 200,
    },
});

export default RegisterAlunoEscolha