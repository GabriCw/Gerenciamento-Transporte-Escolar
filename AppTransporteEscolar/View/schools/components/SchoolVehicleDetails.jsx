import { Alert, Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import PageDefault from "../../../components/pageDefault/PageDefault";
import { Button, IconButton, Text } from "react-native-paper";
import { useCallback, useContext, useEffect, useState } from "react";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ModalEditPoint from "./ModalEditPoint";
import ModalEditVehicle from "./ModalEditVehicle";
import { associateVehicleToPoint } from "../../../data/vehicleServices";
import Toast from "react-native-toast-message";
import { createAssociation, deleteAssociation, updateAssociation } from "../../../data/vehiclePointServices";
import { AuthContext } from "../../../providers/AuthProvider";

const SchoolVehicleDetails = ({navigation, route}) => {
    
    const {schoolVehicleData} = route.params;
    const {userData} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [school, setSchool] = useState(null);
    const [vehicle, setVehicle] = useState(null);
    const [editPoint, setEditPoint] = useState(false);
    const [editVehicle, setEditVehicle] = useState(false);

    useEffect(() => {
        setSchool(schoolVehicleData?.point);
        setVehicle(schoolVehicleData?.vehicle);
    }, [schoolVehicleData]);

    const handleUpdateSchool = (schoolUpdate) => {
        setSchool(schoolUpdate);
    };

    const handleUpdateVehicle = (vehicleUpdate) => {
        setVehicle(vehicleUpdate);
    };

    const handleUpdateAssociation = async() => {
        setLoading(true);

        const body = {
            vehicle_point_id: schoolVehicleData.id,
            vehicle_id: vehicle.id,
            point_id: school.id,
            user_id: userData.id
        };

        const association = await updateAssociation(body);

        if(association.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Escola e veículo atualizados com sucesso!',
                visibilityTime: 3000,
            });

            navigation.navigate("Perfil");
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: association.data.detail,
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    const handleRemoveModal = () => {
        Alert.alert('Remover Associação', 'Confirma a remoção desta associação?', [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {text: 'Confirmar', onPress: () => handleRemoveAssociation()},
        ]);
    };

    const handleRemoveAssociation = async() => {
        setLoading(true);

        const remove = await deleteAssociation(schoolVehicleData.id);

        if(remove.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Associação removida com sucesso!',
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

    const handleCreateAssociation = async() => {
        setLoading(true);

        const body = {
            vehicle_id: vehicle.id,
            point_id: school.id,
            user_id: userData.id
        };

        const association = await createAssociation(body);

        if(association.status === 201){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Escola e veículo associados com sucesso!',
                visibilityTime: 3000,
            });

            navigation.navigate("Perfil");
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: association.data.detail,
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    return <PageDefault headerTitle={schoolVehicleData?.point && schoolVehicleData?.vehicle ? "Detalhes" : "Criar Associação"} loading={loading} navigation={navigation}>
        <View style={styles.viewContainter}>
            <View style={styles.cardContainer}>
                <View style={styles.mainInfosContainer}>
                    {
                        school ? <View style={styles.content}>
                            <View style={styles.nameYearContent}>
                                <Text style={styles.title}>{school?.name}</Text>
                                <Pressable onPress={() => setEditPoint(true)}>
                                    <MaterialIcons name="edit" size={24} color="black" />
                                </Pressable>
                            </View>
                        
                            <View style={{width: "100%"}}>
                                <View>
                                    <Text style={styles.text}>{school?.address}</Text>
                                    <Text style={styles.text}>{school?.neighborhood} - {school?.city}/{school?.state}</Text>
                                </View>
                            </View>  
                        </View>
                    :
                        <View style={styles.contentCreation}>
                            <Text style={[styles.text, {fontWeight: 600}]}>Selecione uma escola</Text>
                            <Pressable onPress={() => setEditPoint(true)}>
                                <Ionicons name="add-circle-sharp" style={styles.buttonAdd}/>
                            </Pressable>
                        </View>
                    }
                </View>

            <View style={styles.lineSeparator}/>

            <View style={styles.schoolContainer}>
                {
                    vehicle ? <>
                        <View style={styles.schoolContent}>
                            <View style={{display: "flex", flexDirection: "row", gap: 10}}>
                                <Text style={styles.colorBox}>Veículo</Text>
                                <Text style={styles.text}>{vehicle?.plate}</Text>
                            </View>
                            <Pressable onPress={() => setEditVehicle(true)}>
                                <MaterialIcons name="edit" size={24} color="black" />
                            </Pressable>
                        </View>
                        <View>
                            <Text style={styles.text}>{vehicle?.model} {vehicle?.color} - {vehicle?.year}</Text>
                        </View>
                    </> 
                    :
                        <View style={styles.contentCreation}>
                            <Text style={[styles.text, {fontWeight: 600}]}>Selecione um veículo</Text>
                            <Pressable onPress={() => setEditVehicle(true)}>
                                <Ionicons name="add-circle-sharp" style={styles.buttonAdd}/>
                            </Pressable>
                        </View>
                }
                </View>
            </View>
        </View>

        <View style={styles.buttonContainer}>
            {
                schoolVehicleData?.point && schoolVehicleData?.vehicle ? 
                <>
                    <Button
                        mode="contained"
                        onPress={handleRemoveModal}
                        style={styles.button}
                    >
                        Remover
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleUpdateAssociation}
                        style={styles.button}
                    >
                        Atualizar
                    </Button>
                </>
                :
                <Button
                    mode="contained"
                    onPress={handleCreateAssociation}
                    style={[styles.button, !(vehicle && school) ? {opacity: 0.7} : null]}
                    disabled={!(vehicle && school)}
                >
                    Criar
                </Button>
            }
        </View>
        <ModalEditPoint schoolSelected={school} handleUpdate={handleUpdateSchool} open={editPoint} setOpen={setEditPoint} navigation={navigation}/>
        <ModalEditVehicle vehicleSelected={vehicle} handleUpdate={handleUpdateVehicle} open={editVehicle} setOpen={setEditVehicle} navigation={navigation}/>
    </PageDefault> 
};

const styles = StyleSheet.create({
    scrollContainer: {
        display: "flex",
        flexDirection: "column",
    },  
    viewContainter: {
        display: "flex",
        justifyContent: "center",
        width: "90%",
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
        justifyContent: 'center',
        alignItems: 'center',
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
        rowGap: 5
    },
    contentCreation: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center"
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
        paddingTop: 10,
        rowGap: 3,
        display: "flex",
    },
    schoolContent: {
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
        justifyContent: "space-around",
        width: "90%"
    },
    button: {
        backgroundColor: '#C36005',
        width: "40%",
        display: "flex"
    },
    buttonAdd: {
        color: "#C36005",
        fontSize: "30%",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SchoolVehicleDetails;