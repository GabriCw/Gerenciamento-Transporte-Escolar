import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { getStudentsByResponsiblePoint } from "../../../data/studentServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import PageDefault from "../../../components/pageDefault/PageDefault";
import ModalSelectStudent from "./ModalSelectStudent";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { createParentNotification, getAllPeriodOptions } from "../../../data/parentNotificationsServices";
import ModalSelectPeriod from "./ModalSelectPeriod";

const CreateNotification = () => {

    const navigation = useNavigation();
    const {userData, token} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [studentSelected, setStudentSelected] = useState(null);
    const [openStudentModal, setOpenStudentModal] = useState(false);
    const [openDateModal, setOpenDateModal] = useState(false);
    const [dateSelected, setDateSelected] = useState(null);
    
    const [openPeriodModal, setOpenPeriodModal] = useState(false);
    const [periodSelected, setPeriodSelected] = useState(null);

    const handleOpenStudentModal = () => {
        setOpenStudentModal(true);
    };
    
    const handleOpenDateModal = () => {
        setOpenDateModal(true);
    };

    const handleConfirmDate = (e) => {
        setDateSelected(e);
        setOpenDateModal(false);
    };

    const handleOpenPeriodModal = () => {
        setOpenPeriodModal(true);
    };

    const handleCreateNotification = async() => {
        setLoading(true);

        const body = {
            user_id: userData?.id,
            student_id: studentSelected?.id,
            inative_day: moment(dateSelected).format("YYYY-MM-DDTHH:mm"),
            period_id: periodSelected?.id
        };

        const response = await createParentNotification(body, token);

        if(response.status === 201){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: "Ocorrência registrada com sucesso",
                visibilityTime: 3000,
            });
            navigation.navigate("Perfil");
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: response.data.detail,
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    return <PageDefault headerTitle="Criar Ocorrência" loading={loading}>
        <View style={styles.viewContainter}>
            <View style={styles.cardContainer}>
                <View style={styles.schoolContainer}>
                    <View style={styles.pointContent}>
                        <View style={styles.pointContent}>
                            {
                                !studentSelected ? <Text style={styles.colorBox}>Escolha o aluno</Text> : <View>
                                    <Text style={styles.colorBox}>Aluno selecionado</Text>
                                    <View>
                                        <Text>{studentSelected?.name} - {studentSelected.year} anos</Text>
                                    </View>
                                </View>
                            }
                        </View>
                        <Pressable
                            onPress={handleOpenStudentModal}
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
                                !dateSelected ? <Text style={styles.colorBox}>Escolha a data</Text> : <View>
                                    <Text style={styles.colorBox}>Data selecionada</Text>
                                    <View>
                                        <Text>{moment(dateSelected).format("DD/MM/YY HH:mm")}</Text>
                                    </View>
                                </View>
                            }
                        </View>
                        <Pressable
                            onPress={handleOpenDateModal}
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
                                !periodSelected ? <Text style={styles.colorBox}>Escolha o período</Text> : <View>
                                <Text style={styles.colorBox}>Período selecionado</Text>
                                <View>
                                    <Text>{periodSelected?.name}</Text>
                                </View>
                            </View>
                            }
                        </View>
                        <Pressable
                            onPress={handleOpenPeriodModal}
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
                    onPress={handleCreateNotification}
                    style={styles.button}
                    disabled={!(studentSelected && dateSelected && periodSelected)}
                >
                    Criar Ocorrência
                </Button>
            </View>
        </View>

        <ModalSelectStudent open={openStudentModal} setOpen={setOpenStudentModal} setStudent={setStudentSelected} selected={studentSelected}/>
        <ModalSelectPeriod open={openPeriodModal} setOpen={setOpenPeriodModal} setPeriod={setPeriodSelected} selected={periodSelected}/>
        <DateTimePickerModal display="inline" mode="datetime" isVisible={openDateModal} onConfirm={(value) => handleConfirmDate(value)} onCancel={() => setOpenDateModal(false)}/>
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