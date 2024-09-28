import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { getStudentsByResponsiblePoint } from "../../../data/studentServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import PageDefault from "../../../components/pageDefault/PageDefault";

const CreateNotification = () => {

    const navigation = useNavigation();
    const {userData} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentSelected, setStudentSelected] = useState(null);
    const [dateSelected, setDateSelected] = useState(null);
    const [periodSelected, setPeriodSelected] = useState(null);
    
    useEffect(() => {
        const requestData = async() => {
            setLoading(true);

            const studentsList = await getStudentsByResponsiblePoint(userData.id);

            console.log(studentsList.data);

            if(studentsList.status === 200){
                setStudents(studentsList.data);
            }
            else{
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: "Você não possuí alunos no seu endereço",
                    visibilityTime: 3000,
                });
                navigation.goBack();
            }

            setLoading(false);
        };

        requestData();
    }, [userData]);

    return <PageDefault headerTitle="Criar Ocorrência" loading={loading}>
        <View style={styles.viewContainter}>
            <View style={styles.cardContainer}>
                {/* <View style={styles.mainInfosContainer}>
                    <View style={styles.iconContent}>
                        <FontAwesome name="child" color="black" style={styles.childIcon} />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.nameYearContent}>
                            <Text style={styles.title}>{data?.student?.name}</Text>
                            <Text style={styles.text}>{data?.student?.year} anos</Text>
                        </View>
                    </View>
                </View> */}

                {/* <View style={styles.lineSeparator}/> */}

                <View style={styles.schoolContainer}>
                    {
                        !studentSelected ? <>
                            <View style={styles.pointContent}>
                                <View style={styles.pointContent}>
                                    <Text style={styles.colorBox}>Escolha o aluno</Text>
                                    {/* <Text style={styles.text}>{data?.point?.name}</Text> */}
                                </View>
                                <Pressable
                                    // onPress={handleOpenEditPointModal}
                                    style={styles.changeButtonContainer}
                                >
                                    <Text style={styles.changeButtonText}>Escolher</Text>
                                </Pressable>
                            </View>
                        </>
                        :
                        <>
                            <View style={styles.pointContent}>
                                <View style={styles.pointContent}>
                                    <Text style={styles.colorBox}>Escolha o aluno</Text>
                                    <Text style={styles.text}>{studentSelected?.name}</Text>
                                </View>
                                <Pressable
                                    // onPress={handleOpenEditPointModal}
                                    style={styles.changeButtonContainer}
                                >
                                    <Text style={styles.changeButtonText}>Trocar</Text>
                                </Pressable>
                            </View>

                            <View>
                                <Text style={styles.text}>{studentSelected?.age}</Text>
                            </View>
                        </> 
                    }
                </View>

                <View style={styles.lineSeparator}/>

                <View style={styles.schoolContainer}>
                    <View style={styles.pointContent}>
                        <View style={styles.pointContent}>
                            {
                                !dateSelected ? <Text style={styles.colorBox}>Escolha a data</Text> : <Text style={styles.colorBox}>Data selecionada</Text>
                            }
                        </View>
                        <Pressable
                            // onPress={handleOpenEditPointModal}
                            style={styles.changeButtonContainer}
                        >
                            {
                                !dateSelected ?
                                    <Text style={styles.changeButtonText}>Escolher</Text>
                                :
                                <Text style={styles.changeButtonText}>Trocar</Text>
                            }
                        </Pressable>
                    </View>
                </View>

                <View style={styles.lineSeparator}/>

                <View style={styles.schoolContainer}>
                    <View style={styles.pointContent}>
                        <View style={styles.pointContent}>
                            {
                                !periodSelected ? <Text style={styles.colorBox}>Escolha o período</Text> : <Text style={styles.colorBox}>Período selecionado</Text>
                            }
                        </View>
                        <Pressable
                            // onPress={handleOpenEditPointModal}
                            style={styles.changeButtonContainer}
                        >
                            {
                                !periodSelected ?
                                    <Text style={styles.changeButtonText}>Escolher</Text>
                                :
                                <Text style={styles.changeButtonText}>Trocar</Text>
                            }
                        </Pressable>
                    </View>
                </View>

            </View>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    // onPress={handleOpenEditModal}
                    style={styles.button}
                >
                    Criar Ocorrência
                </Button>
            </View>
        </View>
    </PageDefault> 
};

const styles = StyleSheet.create({
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
    pointContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
        justifyContent: "center",
        width: "100%"
    },
    changeButtonContainer: {
        backgroundColor: '#C36005',
        borderRadius: 5,
        paddingVertical: "1.5%",
        paddingHorizontal: "3%",
    },
    changeButtonText: {
        fontSize: 15,
        color: "#fff"
    },
    button: {
        backgroundColor: '#C36005',
        display: "flex"
    },
});

export default CreateNotification;