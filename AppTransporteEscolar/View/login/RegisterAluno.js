import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RegisterAluno = ({navigation}) => {
    const [alunos, setAlunos] = useState([]);
    const [nomeAluno, setNomeAluno] = useState('');
    const [idadeAluno, setIdadeAluno] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleAddAluno = () => {
        setAlunos([...alunos, { nome: nomeAluno, idade: idadeAluno }]);
        setNomeAluno('');
        setIdadeAluno('');
        setShowForm(false);
    };

    const handleFinalizar = () => {
        //colocar pra enviar pra API dps
        console.log('Finalizar e enviar', alunos);
        setAlunos([]);
        navigation.navigate('Login');
    };

    return (
        <View style={styles.view}>
            <View style={styles.container}>
                {showForm ? (
                    <KeyboardAwareScrollView
                        contentContainerStyle={styles.view}
                        enableOnAndroid={true}
                        extraScrollHeight={20}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.formContainer}>
                            <Text style={styles.title}>Registre seu Aluno</Text>
                            <TextInput
                                label="Nome"
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                                value={nomeAluno}
                                onChangeText={text => setNomeAluno(text)}
                                style={styles.input}
                            />
                            <TextInput
                                label="Idade"
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                                value={idadeAluno}
                                onChangeText={text => setIdadeAluno(text)}
                                style={styles.input}
                            />
                            <View style={{alignItems:'center'}}>
                                <Button mode="contained" onPress={handleAddAluno} style={styles.button2}>
                                    Cadastrar
                                </Button>
                                <Text onPress={() => setShowForm(false)} style={styles.cancelar}>
                                    Cancelar
                                </Text>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                ) : (
                    <View style={styles.container}>
                        <Text style={styles.title}>Registre seu Aluno</Text>
                        <KeyboardAwareScrollView
                            contentContainerStyle={styles.alunoContainer}
                            style={styles.scrollView}
                            enableOnAndroid={true}
                            extraScrollHeight={20}
                            keyboardShouldPersistTaps="handled"
                        >
                            {alunos.map((aluno, index) => (
                                <View key={index} style={styles.alunoBox}>
                                    <FontAwesome name="child" size={24} color="black" style={styles.icon}/>
                                    <View style={styles.alunoInfo}>
                                        <Text>Nome: {aluno.nome}</Text>
                                        <Text>Idade: {aluno.idade}</Text>
                                    </View>
                                </View>
                            ))}
                        </KeyboardAwareScrollView>
                        <View style={styles.btn_container}>
                            <Button mode="contained" onPress={() => setShowForm(true)} style={styles.button}>
                                Cadastrar Aluno
                            </Button>
                            <Button mode="contained" onPress={handleFinalizar} style={styles.button}>
                                Finalizar e Enviar
                            </Button>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
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
        marginBottom: 35,
        color: '#C36005',
    },
    formContainer: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
    },
    alunoContainer: {
        flexGrow: 1,
    },
    scrollView: {
        maxHeight: 300,
        borderWidth: 3,
        borderColor: '#A9A9A9',
        backgroundColor: '#DCDCDC',
        borderRadius: 15,
        padding: 10,
    },
    scrollView2: {
        maxHeight: '100%',
        padding: 10,
    },
    alunoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 5,
    },
    icon: {
        marginRight: 20,
        marginLeft: 5,
    },
    alunoInfo: {
        flex: 1,
    },
    button: {
        width: 200,
        backgroundColor: '#C36005',
        marginVertical: 10,
        borderRadius: 20,
        padding: 5,
    },
    button2: {
        width: 200,
        backgroundColor: '#C36005',
        marginTop: 30,
        marginBottom: 10,
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
    cancelar: {
        fontSize: 13,
        color: '#ffff',
        fontFamily: '',
        textAlign: 'center',
        marginTop: 8,
        marginRight: 2,
        marginBottom: 20,
    },
});

export default RegisterAluno;