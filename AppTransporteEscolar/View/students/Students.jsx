import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { Button, Card, ActivityIndicator } from 'react-native-paper';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { getStudentByCode, getStudentByResponsible, getStudentDetails } from '../../data/studentServices';
import { AuthContext } from '../../providers/AuthProvider';
import Toast from 'react-native-toast-message';
import ModalAssociation from './components/ModalAssociation';
import Header from '../../components/header/Header';

const Students = ({ navigation }) => {
    const { userData } = useContext(AuthContext);

    const [associationModalVisible, setAssociationModalVisible] = useState(false);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    const requestData = async() => {
        const response = await getStudentByResponsible(userData.id);

        if(response.status === 200){
            const studentFormat = response.data.map(item => ({
                id: item.id,
                name: item.name,
                year: item.year,
                code: item.code
            }));
            
            setStudents(studentFormat);
        }
        else{
            setStudents([]);
        }

        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        
        requestData();
    }, [userData]);
    
    const handleVerifyStudentByCode = async(studentCode) => {
        setLoading(true);
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

        setLoading(false);
    };

    const handleAssociationModalToggle = () => {
        setAssociationModalVisible(!associationModalVisible);
    };

    const handleToCreateStudentPage = () => {
        navigation.navigate("CreateStudent");
    };

    const handleSelectStudent = async(studentInfos) => {
        setLoading(true);

        const studentDetails = await getStudentDetails(studentInfos.id);

        if(studentDetails.status === 200){
            navigation.navigate("StudentDetail", {studentData: studentDetails.data});
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2:"Erro ao trazer detalhes do aluno",
                visibilityTime: 3000,
            });
        }

        
        setLoading(false);
    };

    return (
        <View style={styles.view}>
            <Header title="Meus Alunos" navigation={navigation}/>
            <View style={styles.content}>
                <View style={styles.scrollContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {students.map((student, index) => (
                            <Card key={index} style={styles.card} onPress={() => handleSelectStudent(student)}>
                                <Card.Content style={styles.cardContent}>
                                    <View style={styles.iconContainer}>
                                        <FontAwesome name="child" size={45} color="black" style={styles.icon} />
                                    </View>
                                    <View style={styles.cardDetails}>
                                        <Text style={[styles.cardText, {marginTop:1, fontWeight: "bold"}]}>{student.name}</Text>
                                        <Text style={styles.cardText}>{student.year} anos</Text>
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
                        onPress={handleToCreateStudentPage}
                        style={styles.addButton}
                    >
                        Criar Aluno
                    </Button>
                </View>
                <Pressable hitSlop={20} style={{position: "absolute", bottom: "5%"}} onPress={() => handleAssociationModalToggle()}>
                    <Text style={styles.textAssociation}>Já existe aluno criado? Clique aqui!</Text>
                </Pressable>

                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#C36005" />
                    </View>
                )}
            </View>

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