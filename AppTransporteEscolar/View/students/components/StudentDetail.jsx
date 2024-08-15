import {  StyleSheet, Text, View } from "react-native";
import Header from "../../../components/header/Header";
import { FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator, Button } from "react-native-paper";
import { useState } from "react";
import ModalEdit from "./ModalEdit";
import { updateStudent } from "../../../data/studentServices";
import Toast from "react-native-toast-message";

const StudentDetail = ({navigation, route}) => {

    const {studentData} = route.params;

    const [openEditModal, setOpenEditModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenEditModal = () => {
        setOpenEditModal(!openEditModal);
    };

    const handleUpdate = async(student) => {
        if(!(student.name && student.year)){
            alert('Por favor, preencha todos os campos');
        }

        setLoading(true);
        setOpenEditModal(false);

        const response = await updateStudent(student);

        if(response.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Edição realizada com sucesso!',
                visibilityTime: 3000,
            });

            navigation.navigate("Perfil");
        }
        else{
            setOpenEditModal(true);

            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao editar',
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    const handleDisassociation = async() => {
        setLoading(true);

        // colocar endpoint para desassociação, considerar se o usuário em questão
        // é o principal, ou seja, é o primeiro que aparece no database ou que é
        // creation_user (mas este que está incoerente)

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return <View style={styles.view}>
        <Header navigation={navigation} title="Detalhes do Aluno"/>
        <View style={styles.viewContainter}>
            <View style={styles.cardContainer}>
                <View style={styles.mainInfosContainer}>
                    <View style={styles.iconContent}>
                        <FontAwesome name="child" color="black" style={styles.childIcon} />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.nameYearContent}>
                            <Text style={styles.title}>{studentData.name}</Text>
                            <Text style={styles.text}>{studentData.year} anos</Text>
                        </View>
                        <View style={styles.codeContent}>
                            <Text style={styles.codeText}>Código:</Text>
                            <Text style={styles.colorBox}>GVpe8zNC</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.lineSeparator}/>

                <View style={styles.schoolContainer}>
                    <View style={styles.schoolContent}>
                        <Text style={styles.colorBox}>Escola</Text>
                        <Text style={styles.text}>Jean Piaget</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>Avenida Presidente Wilson, 64</Text>
                        <Text style={styles.text}>Gonzaga - Santos/SP</Text>
                    </View>
                </View>

                <View style={styles.lineSeparator}/>

                <View style={styles.driverContainer}>
                    <View style={styles.driverContent}>
                        <Text style={styles.colorBox}>Motorista</Text>
                        <Text style={styles.text}>Carlos</Text>
                    </View>
                    <View>
                        <View style={styles.driverContent}>
                            <FontAwesome name="phone" size={24} color="black" />
                            <Text style={styles.text}>(13) 98119-3075</Text>
                        </View>
                        <View>
                            <Text>Código: asjsjkhas</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleOpenEditModal}
                    style={styles.button}
                >
                    Editar
                </Button>
                <Button
                    mode="contained"
                    onPress={handleDisassociation}
                    style={styles.button}
                >
                    Desassociar
                </Button>
            </View>
        </View>

        <ModalEdit
            open={openEditModal}
            onClose={handleOpenEditModal}
            handleConfirm={handleUpdate}
            data={studentData}
        />

        {
            loading && <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#C36005" />
            </View>
        }
    </View>
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
    },
    viewContainter: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        marginBottom: "12%",
        alignItems: "center",
        rowGap: 20,
        padding: "5%"
    },
    cardContainer: {
        width: '100%',
        height: "auto",
        marginHorizontal: "auto",
        maxHeight: 400,
        backgroundColor: '#f0f0f0',
        borderColor: '#d0d0d0',
        borderWidth: 4,
        borderRadius: 10,
        padding: 10,
        overflow: 'hidden',
    },
    mainInfosContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingBottom: 10
    },
    iconContent: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingLeft: 1,
    },
    childIcon: {
        marginRight: 10,
        marginBottom: 8,
        fontSize: 60
    },
    content: {
        flex: 1,
        paddingHorizontal: 5,
        display: "flex",
        rowGap: 5
    },
    nameYearContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    title: {
        color: '#000',
        fontSize: 22,
        marginBottom: 5,
        fontWeight: "bold",
        maxWidth: "70%",
    },  
    text: {
        color: '#000',
        fontSize: 18,
        marginBottom: 5,
    },
    codeContent: {
        display: "flex",
        flexDirection: "row",
        columnGap: 5,
        alignItems: "center"
    },
    colorBox: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
        backgroundColor: "#090833",
        textAlign: "center",
        paddingVertical: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontWeight: "bold"
    },
    codeText: {
        color: '#000',
        fontSize: 16,
        marginBottom: 5,
    },
    lineSeparator: {
        height: 1,
        backgroundColor: "#d0d0d0"
    },
    schoolContainer:{
        paddingVertical: 10,
        display: "flex",
    },
    schoolContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10
    },
    driverContainer:{
        paddingVertical: 10,
        display: "flex",
    },
    driverContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10
    },
    buttonContainer: {
        display : "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    button: {
        backgroundColor: '#C36005',
        width: "40%",
        display: "flex"
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default StudentDetail;