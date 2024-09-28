import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { Button, Card, ActivityIndicator } from 'react-native-paper';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { getStudentByCode, getStudentByResponsible, getStudentDetails } from '../../data/studentServices';
import { AuthContext } from '../../providers/AuthProvider';
import Toast from 'react-native-toast-message';
import ModalAssociation from './components/ModalAssociation';
import Header from '../../components/header/Header';
import PageDefault from '../../components/pageDefault/PageDefault';
import { useNavigation } from '@react-navigation/native';

const Students = () => {
    const { userData, hasStudent } = useContext(AuthContext);

    const navigation = useNavigation();

    const [associationModalVisible, setAssociationModalVisible] = useState(false);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [headerTitle, setHeaderTitle] = useState("Meus Alunos");

    const requestData = async() => {
        const response = await getStudentByResponsible(userData.id);

        if(response.status === 200){
            const studentFormat = response.data.map(item => ({
                id: item.id,
                name: item.name,
                year: item.year,
                code: item.code
            }));
            
            if(studentFormat?.length == 0){
                setHeaderTitle("Primeira Etapa!");
            }
            else{
                setHeaderTitle("Meus Alunos");
            }

            setStudents(studentFormat);
        }
        else{
            setStudents([]);
            setHeaderTitle("Primeira Etapa!");
        }

        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        
        requestData();
    }, [userData, hasStudent]);
    
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

        console.log(studentDetails.data);

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
        <PageDefault headerTitle={headerTitle} loading={loading} navigation={navigation} backNavigation={"Perfil"}>
            {
                students.length > 0 ? <>
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
                    </View>
                </>
                :
                <>
                    <View style={styles.withoutStudent}>
                        <Text style={styles.withoutStudentTitle}>Crie ou se associe a um aluno já existente</Text>
                        <View style={styles.initialButtonContainer}>
                            <Button
                                mode="contained"
                                onPress={handleAssociationModalToggle}
                                style={styles.addButton}
                            >
                                Associar Aluno
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleToCreateStudentPage}
                                style={styles.addButton}
                            >
                                Criar Aluno
                            </Button>
                        </View>
                    </View>
                </>
            }

            <ModalAssociation
                open={associationModalVisible}
                onClose={handleAssociationModalToggle}
                handleConfirm={handleVerifyStudentByCode}
            />
        </PageDefault>
    );
};

const styles = StyleSheet.create({
    withoutStudent: {
        textAlign: "center",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        rowGap: 25,
        width: "100%"
    },
    withoutStudentTitle: {
        color: "#fff",
        fontSize: 20,
        width: "80%",
        textAlign: "center",
        fontWeight: "bold"
    },
    initialButtonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        columnGap: 15,
        width: "100%"
    },  
    content: {
        flex: 1,
        width: "100%",
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
        zIndex: 5
    },
});

export default Students;