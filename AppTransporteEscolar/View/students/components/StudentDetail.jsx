import {  Alert, StyleSheet, Text, View } from "react-native";
import Header from "../../../components/header/Header";
import { FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator, Button } from "react-native-paper";
import { useContext, useState } from "react";
import ModalEdit from "./ModalEdit";
import { deleteStudent, disassociationStudent, updateStudent } from "../../../data/studentServices";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../../providers/AuthProvider";
import PageDefault from "../../../components/pageDefault/PageDefault";

const StudentDetail = ({navigation, route}) => {

    const {studentData} = route.params;
    const {userData, handleVerifyStudent} = useContext(AuthContext);

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
            await handleVerifyStudent();
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

    const hhandleDisassociationModal = () => {
        Alert.alert('Desassociar Aluno', 'Confirma a desassociação deste aluno?', [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {text: 'Confirmar', onPress: () => handleDisassociation()},
        ]);
    };

    const handleDisassociation = async() => {
        setLoading(true);

        const body = {
            responsible_id: userData.id,
            student_id: studentData?.student?.id
        };

        const disassociation = await disassociationStudent(body);

        if(disassociation.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Sucesso ao desassociar!',
                visibilityTime: 3000, 
            });

            navigation.navigate("Perfil");
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao desassociar',
                visibilityTime: 3000,
            });

        }

        setLoading(false);
    };
    
    const handleRemoveModal = () => {
        Alert.alert('Excluir Aluno', 'Confirma a exclusão deste aluno?', [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {text: 'Confirmar', onPress: () => handleRemove()},
        ]);
    };

    const handleRemove = async() => {
        setLoading(true);

        const remove = await deleteStudent(studentData?.student?.id);

        if(remove.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Sucesso ao excluir!',
                visibilityTime: 3000, 
            });

            navigation.navigate("Perfil");
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao excluir',
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    return <PageDefault headerTitle="Detalhes do Aluno" loading={loading} navigation={navigation}>
        <View style={styles.viewContainter}>
            <View style={styles.cardContainer}>
                <View style={styles.mainInfosContainer}>
                    <View style={styles.iconContent}>
                        <FontAwesome name="child" color="black" style={styles.childIcon} />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.nameYearContent}>
                            <Text style={styles.title}>{studentData?.student?.name}</Text>
                            <Text style={styles.text}>{studentData?.student?.year} anos</Text>
                        </View>
                        <View style={styles.codeContent}>
                            <Text style={styles.codeText}>Código:</Text>
                            <Text style={styles.colorBox}>{studentData?.student?.code}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.lineSeparator}/>

                <View style={styles.schoolContainer}>
                    <View style={styles.schoolContent}>
                        <Text style={styles.colorBox}>Escola</Text>
                        <Text style={styles.text}>{studentData?.school?.name}</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>{studentData?.school?.address}</Text>
                        <Text style={styles.text}>{studentData?.school?.neighborhood} - {studentData?.school?.city}/{studentData?.school?.state}</Text>
                    </View>
                </View>

                <View style={styles.lineSeparator}/>

                <View style={styles.driverContainer}>
                    <View style={styles.driverContent}>
                        <Text style={styles.colorBox}>Motorista</Text>
                        <Text style={styles.text}>{studentData?.driver?.name}</Text>
                    </View>
                    {
                        studentData?.driver?.phones?.map(item => {
                            return <View style={styles.driverContent} key={item.id}>
                                <FontAwesome name="phone" size={24} color="black" />
                                <Text style={styles.text}>{item.phone}</Text>
                            </View>
                        })
                    }
                    <View style={styles.codeContent}>
                        <Text style={styles.codeText}>Código:</Text>
                        <Text style={styles.colorBox}>{studentData?.driver?.code}</Text>
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
                {
                    studentData?.student?.creation_user !== userData?.id ?
                        <Button
                            mode="contained"
                            onPress={hhandleDisassociationModal}
                            style={styles.button}
                        >
                            Desassociar
                        </Button>
                    :
                    <Button
                        mode="contained"
                        onPress={handleRemoveModal}
                        style={styles.button}
                    >
                    Excluir
                    </Button>
                }
            </View>
        </View>

        <ModalEdit
            open={openEditModal}
            onClose={handleOpenEditModal}
            handleConfirm={handleUpdate}
            data={studentData}
        />
    </PageDefault>
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
        width: "100%",
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
        rowGap: 3,
        display: "flex",
    },
    schoolContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10
    },
    driverContainer:{
        paddingTop: 10,
        rowGap: 3,
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