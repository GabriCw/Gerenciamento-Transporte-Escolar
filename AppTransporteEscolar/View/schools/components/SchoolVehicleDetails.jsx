import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import PageDefault from "../../../components/pageDefault/PageDefault";
import { Button, IconButton, Text } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ModalEditPoint from "./ModalEditPoint";
import ModalEditVehicle from "./ModalEditVehicle";

const SchoolVehicleDetails = ({navigation, route}) => {
    
    const {schoolVehicleData} = route.params;

    const [school, setSchool] = useState(null);
    const [vehicle, setVehicle] = useState(null);
    const [editPoint, setEditPoint] = useState(false);
    const [editVehicle, setEditVehicle] = useState(false);

    useEffect(() => {
        setSchool(schoolVehicleData?.school);
        setVehicle(schoolVehicleData?.vehicle);
    }, [schoolVehicleData]);

    const handleUpdateSchool = (schoolUpdate) => {
        setSchool(schoolUpdate);
    };

    const handleUpdateVehicle = (vehicleUpdate) => {
        setVehicle(vehicleUpdate);
    };

    return <PageDefault headerTitle="Detalhes" navigation={navigation}>
        <View style={styles.viewContainter}>
            <View style={styles.cardContainer}>
                <View style={styles.mainInfosContainer}>
                    <View style={styles.content}>
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
                </View>

            <View style={styles.lineSeparator}/>

            <View style={styles.schoolContainer}>
                <View style={styles.schoolContent}>
                    <Text style={styles.colorBox}>Veículo</Text>
                    <Text style={styles.text}>{vehicle?.plate}</Text>
                    <Text style={styles.text}>({vehicle?.color})</Text>
                    <Pressable onPress={() => setEditVehicle(true)}>
                        <MaterialIcons name="edit" size={24} color="black" />
                    </Pressable>
                </View>
                <View>
                    <Text style={styles.text}>{vehicle?.model} - {vehicle?.year}</Text>
                </View>
                    <View style={styles.nameYearContent}>
                        {
                            vehicle?.code && <View style={styles.codeContent}>
                                <Text style={styles.codeText}>Código:</Text>
                                <Text style={styles.colorBox}>{vehicle?.code}</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        </View>

        <View style={styles.buttonContainer}>
            <Button
                mode="contained"
                // onPress={handleOpenEditModal}
                style={styles.button}
            >
                Concluir
            </Button>
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
        width: "90%"
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

export default SchoolVehicleDetails;