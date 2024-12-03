import { Alert, StyleSheet, View } from "react-native";
import PageDefault from "../../../components/pageDefault/PageDefault";
import { Button, Text } from "react-native-paper";
import { useContext, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { AuthContext } from "../../../providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { removeVehicle, updateVehicle } from "../../../data/vehicleServices";
import ModalEdit from "./ModalEdit";

const VehicleDetails = ({route}) => {

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();
    const {userData, token} = useContext(AuthContext);
    const {vehicleData} = route.params;

    const handleOpenRemoveAlert = () => {
        Alert.alert('Excluir Veículo', 'Confirma a exclusão deste veículo?', [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {text: 'Confirmar', onPress: () => handleRemove()},
        ]);
    };

    const handleRemove = async() => {
        setLoading(true);

        const remove = await removeVehicle(vehicleData.id, token);

        if(remove.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: "Veículo removido com sucesso!",
                visibilityTime: 3000,
            });
            navigation.navigate("Perfil");
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: remove.data.detail,
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    const handleOpenUpdateModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleUpdate = async() => {
        if (vehicleData?.model && vehicleData?.color && vehicleData?.plate && vehicleData?.year) {
            const body = {
                id: vehicleData.id,
                plate: vehicleData.plate,
                model: vehicleData.model,
                color: vehicleData.color,
                year: vehicleData.year,
                user_id: userData.id
            };

            setLoading(true);
            
            const response = await updateVehicle(body, token);
            
            if(response.status === 200){
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso',
                    text2: "Edição realizada com sucesso!",
                    visibilityTime: 3000,
                });
                setModalVisible(false);
                navigation.navigate("Perfil")
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
        } else {
            // Handle error, e.g., show a message to the user
            alert('Por favor, preencha todos os campos');
        }
    };

    return <PageDefault headerTitle="Detalhes do Veículo" loading={loading}>
        <View style={styles.viewContainter} onPress={() => handleGoToVehicleDetails(vehicleData)}>
            <View style={styles.cardContainer}>
                <View style={styles.mainInfosContainer}>
                    <View style={styles.content}>
                        <View style={styles.nameYearContent}>
                            <View style={{display: "flex", flexDirection: "row", flex: 1, gap: 15, alignItems: "center"}}>
                            <FontAwesome name="bus" size={"30%"} color="black"/>
                                <Text style={styles.title}>{vehicleData?.plate.toUpperCase()}</Text>
                            </View>
                        </View>
                        <View style={styles.schoolContent}>
                    <Text style={styles.text}>{vehicleData?.model}</Text>
                </View>   
                </View>
            </View>            
            <View style={styles.lineSeparator}/>
            <View style={styles.codeContainer}>
                <View style={styles.codeContent}>
                    <Text style={styles.codeText}>Mais informações</Text>
                    <Text style={[styles.colorBox, {backgroundColor: "#C36005"}]}>{vehicleData?.color} - {vehicleData?.year}</Text>
                </View>
            </View>
            </View>
        </View>
        <View style={styles.buttonContainer}>
            <Button
                mode="contained"
                onPress={handleOpenUpdateModal}
                style={styles.button}
            >
                Editar
            </Button>
            <Button
                mode="contained"
                onPress={handleOpenRemoveAlert}
                style={styles.button}
                >
                Remover
            </Button>
        </View>
        <ModalEdit data={vehicleData} open={modalVisible} onClose={handleOpenUpdateModal} handleConfirm={handleUpdate}/>
    </PageDefault>
};

const styles = StyleSheet.create({
    scrollContainer: {
        display: "flex",
        flexDirection: "column",
        position: "relative"
    },
    viewContainter: {
        display: "flex",
        justifyContent: "center",
        width: "90%",
        alignItems: "center",
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
        alignSelf: "flex-start",
        paddingTop: 5,
        borderRadius: 30,
        paddingLeft: 1,
    },
    vehicleIcon: {
        marginRight: 10,
        marginBottom: 8,
        fontSize: 40
    },
    content: {
        flex: 1,
        paddingHorizontal: 5,
        display: "flex",
        rowGap: 5,
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
        width: "100%",
        display: "flex",
    },
    schoolContent: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        columnGap: 10
    },
    codeContainer:{
        paddingTop: 10,
        rowGap: 3,
        display: "flex",
    },
    codeContent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        columnGap: 10
    },
    buttonContainer: {
        display : "flex",
        flexDirection: "row",
        justifyContent: "center",
        columnGap: 15,
        width: "100%",
        marginTop: "5%"
    },
    button: {
        backgroundColor: "#C36005"
    }
});

export default VehicleDetails;