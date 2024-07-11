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
        <View>
            <KeyboardAwareScrollView>
                <View>
                    <Text>Cadastro de Aluno</Text>
                    <Text>Gostaria de cadastrar agora no seu perfil sua criança?</Text>
                    <View>
                        <Button mode="contained" onPress={() => {}}>Cadastrar Aluno</Button>
                        <Button mode="contained" onPress={() => {}}>Deixar para depois</Button>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default RegisterAlunoEscolha