import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import ModalEdit from "./ModalEdit";
import { useContext, useState } from "react";
import { updateVehicle } from "../../../data/vehicleServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";

const VehiclesAssociatedList = ({ list, setIsLoading }) => {

    const navigation = useNavigation();
    const { userData, token } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [vehicleSelect, setVehicleSelect] = useState(null);

    const handleOpenModalEdit = (vehicle) => {
        setModalVisible(!modalVisible);
        setVehicleSelect(vehicle);
    };

    const handleUpdate = async(vehicle) => {
        if (vehicle?.model && vehicle?.color && vehicle?.plate && vehicle?.year) {
            const body = {
                id: vehicle.id,
                plate: vehicle.plate,
                model: vehicle.model,
                color: vehicle.color,
                year: vehicle.year,
                user_id: userData.id
            };

            setIsLoading(true);

            const response = await updateVehicle(body, token);

            if(response.status === 200){
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso',
                    text2: "Edição realizada com sucesso!",
                    visibilityTime: 3000,
                });
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

            setIsLoading(false);
        } else {
            // Handle error, e.g., show a message to the user
            alert('Por favor, preencha todos os campos');
        }
    };

    const handleGoToCreateVehicle = () => {
        navigation.navigate("CreateVehicle");
    };

    const handleGoToVehicleDetails = (item) => {
        navigation.navigate("VehicleDetails", {vehicleData: item});
    };

    return <>
        <ScrollView style={styles.scrollContainer}>
            {
                list?.map((item, index) => {
                    return <Pressable style={styles.viewContainter} key={index} onPress={() => handleGoToVehicleDetails(item)}>
                        <View style={styles.cardContainer}>
                            <View style={styles.mainInfosContainer}>
                                <View style={styles.content}>
                                    <View style={styles.nameYearContent}>
                                        <View style={{display: "flex", flexDirection: "row", flex: 1, gap: 15, alignItems: "center"}}>
                                        <FontAwesome name="bus" size={"30%"} color="black"/>
                                            <Text style={styles.title}>{item?.plate.toUpperCase()}</Text>
                                        </View>
                                        <AntDesign name="rightcircle" size={24} color="black"/>
                                    </View>
                                    <View style={styles.schoolContent}>
                                <Text style={styles.text}>{item?.model}</Text>
                            </View>   
                            </View>
                        </View>            
                        <View style={styles.lineSeparator}/>
                        <View style={styles.codeContainer}>
                            <View style={styles.codeContent}>
                                <Text style={styles.codeText}>Mais informações</Text>
                                <Text style={[styles.colorBox, {backgroundColor: "#C36005"}]}>{item?.color} - {item?.year}</Text>
                            </View>
                        </View>
                        </View>
                    </Pressable>
                })
            }
        </ScrollView>
        <Pressable onPress={handleGoToCreateVehicle}>
            <Ionicons name="add-circle-sharp" style={styles.button}/>
        </Pressable>

        <ModalEdit data={vehicleSelect} open={modalVisible} onClose={handleOpenModalEdit} handleConfirm={handleUpdate}/>
    </>
};

const styles = StyleSheet.create({
    scrollContainer: {
        display: "flex",
        flexDirection: "column",
        position: "relative"
    }, 
    button: {
        position: "absolute",
        zIndex: 5,
        bottom: 0,
        left: "30%",
        width: "100%",
        color: "#C36005",
        fontSize: "70%"
    },
    viewContainter: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        width: "100%",
        minWidth: "90%",
        marginBottom: 15,
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
        justifyContent: "space-between",
        width: "100%"
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VehiclesAssociatedList;