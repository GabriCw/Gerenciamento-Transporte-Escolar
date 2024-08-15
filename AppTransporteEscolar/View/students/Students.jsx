import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, Pressable } from 'react-native';
import { Button, Card, Portal, TextInput, Provider, IconButton, ActivityIndicator } from 'react-native-paper';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'; // Importa o FontAwesome
import { createStudentList, deleteStudent, getStudentByCode, getStudentByResponsible, updateStudent } from '../../data/studentServices';
import { AuthContext } from '../../providers/AuthProvider';
import Toast from 'react-native-toast-message';
import ModalDefault from '../../components/modalDefault/ModalDefault';
import ModalRegister from './components/ModalRegister';
import ModalEdit from './components/ModalEdit';
import ModalAssociation from './components/ModalAssociation';
import Header from '../../components/header/Header';

const Students = ({ navigation }) => {
    const { userData } = useContext(AuthContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [associationModalVisible, setAssociationModalVisible] = useState(false);
    const [alunos, setAlunos] = useState([]);
    const [tempAluno, setTempAluno] = useState({ name: '', year: '' });
    const [selectedAluno, setSelectedAluno] = useState(null);
    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const requestData = async() => {
        const response = await getStudentByResponsible(userData.id);

        if(response.status === 200){
            const studentFormat = response.data.map(item => ({
                id: item.id,
                name: item.name,
                year: item.year,
                code: item.code
            }));
            
            setAlunos(studentFormat);
        }
        else{
            setAlunos([]);
        }

        setReload(false);
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        
        requestData();
    }, [userData]);

    useEffect(() => {
        if(reload){
            setTimeout(() => {
                requestData();
            }, 1000);
        }
    }, [reload]);

    const handleModalToggle = () => {
        setModalVisible(!modalVisible);
    };

    const handleAssociationModalToggle = () => {
        setAssociationModalVisible(!associationModalVisible);
    };

    const handleEditModalToggle = () => {
        setEditModalVisible(!editModalVisible);
    };

    const handleSave = (student) => {
        if (student.name && student.year) {
            setAlunos([...alunos, { ...student, year: parseInt(student.year, 10) }]);
            setModalVisible(false);
        } else {
            alert('Por favor, preencha todos os campos');
        }
    };

    const handleAddStudent = async() => {
        const studentsBody = alunos.map(item => ({
            id: item.id ?? null,
            name: item.name,
            year: item.year,
            responsible_id: userData.id
        }));

        setIsLoading(true);

        const response = await createStudentList(studentsBody);

        if(response.status === 201){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Cadastro realizado com sucesso!',
                visibilityTime: 3000,
            });
            navigation.goBack();
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao cadastrar',
                visibilityTime: 3000,
            });
        }
    };

    const handleEdit = (aluno) => {
        setSelectedAluno(aluno);
        setTempAluno({ id: aluno?.id, name: aluno.name, year: aluno.year.toString() }); // Converta idade para string
        handleEditModalToggle();
    };

    const handleUpdate = async(student) => {
        if (student.name && student.year) {
            if(student?.id !== undefined){
                const response = await updateStudent(student);

                setIsLoading(true);

                if(response.status === 200){
                    Toast.show({
                        type: 'success',
                        text1: 'Sucesso',
                        text2: 'Edição realizada com sucesso!',
                        visibilityTime: 3000,
                    });

                    setEditModalVisible(false);
                    setReload(true);
                }
                else{
                    Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'Erro ao editar',
                    visibilityTime: 3000,
                    });
                }
            }
            else{
                const updatedAlunos = alunos.map(aluno =>
                    aluno === selectedAluno ? { ...tempAluno, year: parseInt(tempAluno.year, 10) } : aluno
                );
                setAlunos(updatedAlunos);
                setTempAluno({ name: '', year: '' });
                setEditModalVisible(false);
            }
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
                    onPress: async() => {
                        if(alunoToDelete?.id !== undefined){

                            setIsLoading(true);
                            
                            const response = await deleteStudent(alunoToDelete?.id)
                            
                            if(response.status === 200){
                                setReload(true);
                                Toast.show({
                                    type: 'success',
                                    text1: 'Sucesso',
                                    text2: 'Remoção realizada com sucesso!',
                                    visibilityTime: 3000,
                                });
                            }
                            else{
                                Toast.show({
                                    type: 'error',
                                    text1: 'Sucesso',
                                    text2: 'Erro ao remover',
                                    visibilityTime: 3000,
                                });
                            }
                        }
                        else{
                            setAlunos(alunos.filter(aluno => aluno !== alunoToDelete));
                        }
                    },
                },
            ]
        );
    };

    const handleVerifyStudentByCode = async(studentCode) => {
        setIsLoading(true);
        setAssociationModalVisible(false);

        const student = await getStudentByCode(studentCode);

        if(student.status === 200){
            navigation.navigate("StudentAssociation", {studentData: student.data});
        }
        else{
            setAssociationModalVisible(true);

            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: student.data.detail,
                visibilityTime: 3000,
            });
        }

        setIsLoading(false);
    };

    const handleSelectStudent = (studentInfos) => {
        navigation.navigate("StudentDetail", {studentData: studentInfos});
    };

    return (
        <View style={styles.view}>
            <Header title="Meus Alunos" navigation={navigation}/>
            <View style={styles.content}>
                <View style={styles.scrollContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {alunos.map((aluno, index) => (
                            <Card key={index} style={styles.card} onPress={() => handleSelectStudent(aluno)}>
                                <Card.Content style={styles.cardContent}>
                                    <View style={styles.iconContainer}>
                                        <FontAwesome name="child" size={45} color="black" style={styles.icon} />
                                    </View>
                                    <View style={styles.cardDetails}>
                                        <Text style={[styles.cardText, {marginTop:1, fontWeight: "bold"}]}>{aluno.name}</Text>
                                        <Text style={styles.cardText}>{aluno.year} anos</Text>
                                    </View>
                                    <AntDesign name="rightcircle" size={24} color="black"/>
                                </Card.Content>
                            </Card>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleModalToggle}
                        style={styles.addButton}
                    >
                        Criar Aluno
                    </Button>
                </View>
                <Pressable hitSlop={20} style={{position: "absolute", bottom: "5%"}} onPress={() => handleAssociationModalToggle()}>
                    <Text style={styles.textAssociation}>Já existe aluno criado? Clique aqui!</Text>
                </Pressable>

                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#C36005" />
                    </View>
                )}
            </View>
            
            <ModalRegister
                open={modalVisible}
                onClose={handleModalToggle}
                handleConfirm={handleSave}
            />

            <ModalEdit
                data={tempAluno}
                open={editModalVisible}
                onClose={handleEditModalToggle}
                handleConfirm={handleUpdate}
            />

            <ModalAssociation
                open={associationModalVisible}
                onClose={handleAssociationModalToggle}
                handleConfirm={handleVerifyStudentByCode}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        zIndex: 1,
        position: "relative"
    },
    scrollContainer: {
        width: '90%',
        marginTop: 10,
        flex: 3,
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
    },
    cardText: {
        color: '#000',
        fontSize: 18,
        marginBottom: 5,
    },
    codeText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
        backgroundColor: "#090833",
        textAlign: "center",
        width: "70%"
    },
    cardTitle: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    header: {
        position: "absolute",
        marginLeft: 20,
        backgroundColor: '#090833',
        top: 50
    },
    buttonBack: {
        backgroundColor: '#C36005',
        zIndex: 2
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
    buttonContainer: {
        marginTop: 10,
        width: "100%",
        flex: 1,
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        display: "flex",
        flexDirection: "row"
    },
    textAssociation: {
        color: "#C36005",
        fontWeight: "bold",
        fontSize: 14,
        textDecorationLine: "underline"
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Students;