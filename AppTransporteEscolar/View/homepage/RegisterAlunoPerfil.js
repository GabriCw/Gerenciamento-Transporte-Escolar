import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import { Button, Card, Modal, Portal, TextInput, Provider, IconButton } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons'; // Importa o FontAwesome

const RegisterAlunoPerfil = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [alunos, setAlunos] = useState([
        { nome: 'João', idade: 8 },
        { nome: 'Maria', idade: 9 },
        { nome: 'Carlos', idade: 10 },
    ]);
    const [tempAluno, setTempAluno] = useState({ nome: '', idade: '' });
    const [selectedAluno, setSelectedAluno] = useState(null);

    const handleModalToggle = () => {
        setModalVisible(!modalVisible);
    };

    const handleEditModalToggle = () => {
        setEditModalVisible(!editModalVisible);
    };

    const handleSave = () => {
        if (tempAluno.nome && tempAluno.idade) {
            setAlunos([...alunos, { ...tempAluno, idade: parseInt(tempAluno.idade, 10) }]);
            setTempAluno({ nome: '', idade: '' });
            setModalVisible(false);
        } else {
            alert('Por favor, preencha todos os campos');
        }
    };

    const handleEdit = (aluno) => {
        setSelectedAluno(aluno);
        setTempAluno({ nome: aluno.nome, idade: aluno.idade.toString() }); // Converta idade para string
        handleEditModalToggle();
    };

    const handleUpdate = () => {
        if (tempAluno.nome && tempAluno.idade) {
            const updatedAlunos = alunos.map(aluno =>
                aluno === selectedAluno ? { ...tempAluno, idade: parseInt(tempAluno.idade, 10) } : aluno
            );
            setAlunos(updatedAlunos);
            setTempAluno({ nome: '', idade: '' });
            setEditModalVisible(false);
        } else {
            alert('Por favor, preencha todos os campos');
        }
    };

    const handleDelete = (alunoToDelete) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Você tem certeza que deseja excluir este aluno?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    onPress: () => {
                        setAlunos(alunos.filter(aluno => aluno !== alunoToDelete));
                    },
                },
            ]
        );
    };

    return (
        <Provider>
            <Portal.Host>
                <View style={styles.view}>
                    <View style={styles.header}>
                        <Button
                            onPress={() => navigation.goBack()}
                            style={styles.buttonBack}
                            labelStyle={styles.buttonLabel}
                        >
                            <Text>Voltar</Text>
                        </Button>
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.text}>Seus Alunos</Text>
                        <View style={styles.scrollContainer}>
                            <ScrollView contentContainerStyle={styles.scrollContent}>
                                {alunos.map((aluno, index) => (
                                    <Card key={index} style={styles.card}>
                                        <Card.Content style={styles.cardContent}>
                                            <View style={styles.iconContainer}>
                                                <FontAwesome name="child" size={45} color="black" style={styles.icon} />
                                            </View>
                                            <View style={styles.cardDetails}>
                                                <Text style={[styles.cardText, {marginTop:1}]}>Nome: {aluno.nome}</Text>
                                                <Text style={styles.cardText}>Idade: {aluno.idade}</Text>
                                            </View>
                                            <IconButton  icon="pencil" size={20} onPress={() => handleEdit(aluno)}>
                                            </IconButton>
                                            <IconButton icon="trash-can" size={20} onPress={() => handleDelete(aluno)}>
                                            </IconButton>
                                        </Card.Content>
                                    </Card>
                                ))}
                            </ScrollView>
                        </View>
                        <Button
                            mode="contained"
                            onPress={handleModalToggle}
                            style={styles.addButton}
                        >
                            Cadastrar Aluno
                        </Button>
                    </View>
                    <Portal>
                        <Modal visible={modalVisible} onDismiss={handleModalToggle} contentContainerStyle={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Cadastrar Aluno</Text>
                            <TextInput
                                label="Nome"
                                value={tempAluno.nome}
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                                onChangeText={(text) => setTempAluno({ ...tempAluno, nome: text })}
                                style={styles.input}
                            />
                            <TextInput
                                label="Idade"
                                value={tempAluno.idade}
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                                keyboardType="numeric"
                                onChangeText={(text) => setTempAluno({ ...tempAluno, idade: text })}
                                style={styles.input}
                            />
                            <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                                Salvar
                            </Button>
                        </Modal>
                        <Modal visible={editModalVisible} onDismiss={handleEditModalToggle} contentContainerStyle={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Editar Aluno</Text>
                            <TextInput
                                label="Nome"
                                value={tempAluno.nome}
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                                onChangeText={(text) => setTempAluno({ ...tempAluno, nome: text })}
                                style={styles.input}
                            />
                            <TextInput
                                label="Idade"
                                value={tempAluno.idade}
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                                keyboardType="numeric"
                                onChangeText={(text) => setTempAluno({ ...tempAluno, idade: text })}
                                style={styles.input}
                            />
                            <Button mode="contained" onPress={handleUpdate} style={styles.saveButton}>
                                Atualizar
                            </Button>
                        </Modal>
                    </Portal>
                </View>
            </Portal.Host>
        </Provider>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
    },
    text: {
        fontSize: 25,
        color: '#FFF',
        margin: 20,
        marginBottom: 40,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
    },
    scrollContainer: {
        width: '90%',
        height: 400,
        maxHeight: 400,
        backgroundColor: '#f0f0f0',
        borderColor: '#d0d0d0',
        borderWidth: 4,
        borderRadius: 10,
        padding: 10,
        overflow: 'hidden',
    },
    scrollContent: {
        alignItems: 'center',
    },
    card: {
        width: '95%',
        marginVertical: 8,
    },
    icon: {
        marginRight: 10,
        marginBottom: 8,
    },
    modalContainer: {
        backgroundColor: '#090833',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    input: {
        marginBottom: 10,
        fontSize: 20,
        color: '#FFF',
    },
    saveButton: {
        backgroundColor: '#C36005',
        marginTop: 20,
    },
    addButton: {
        backgroundColor: '#C36005',
        margin: 40,
    },
    cardText: {
        color: '#000',
        fontSize: 18,
        marginBottom: 5,
    },
    cardTitle: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    header: {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        marginLeft: 20,
        marginTop: 50,
        backgroundColor: '#090833',
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
    modalTitle: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        alignItems: 'center',
    },
    cardDetails: {
        flex: 1,
    },
    iconActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default RegisterAlunoPerfil;