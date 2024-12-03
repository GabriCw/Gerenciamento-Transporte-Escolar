import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalEdit from './components/ModalEdit';
import { getVehicleByUser, getVehicleListByUser, updateVehicle } from '../../data/vehicleServices';
import { AuthContext } from '../../providers/AuthProvider';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@expo/vector-icons';
import Header from "../../components/header/Header";
import PageDefault from '../../components/pageDefault/PageDefault';
import { useNavigation } from '@react-navigation/native';
import VehiclesAssociatedList from './components/VehiclesAssociatedList';

const Vehicle = () => {

    const navigation = useNavigation();
    const { userData, token } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [vehicles, setVehicles] = useState(null);
    const [vehicleSelect, setVehicleSelect] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reload, setReload] = useState(false);

    const requestData = async() => {
        setIsLoading(true);
        
        const response = await getVehicleListByUser(userData.id, token) ;

        if(response.status === 200){
            setVehicles(response.data);
        }
        else{
            navigation.goBack();
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: response.data.detail,
                visibilityTime: 3000,
            });
        }

        setIsLoading(false);
    };

    useEffect(() => { 
        requestData();
    }, []);

    useEffect(() => {
        if(reload === true){
            requestData();
        }
    }, [reload]);

    const handleGoToCreateVehicle = () => {
        navigation.navigate("CreateVehicle");
    };

    return  <PageDefault headerTitle="Meus Veículos" navigation={navigation} loading={isLoading} backNavigation={"Perfil"}>
        <View style={styles.content}>
            {
                vehicles?.length > 0 ?
                    <VehiclesAssociatedList
                        list={vehicles}
                        setIsLoading={setIsLoading}
                    />
                :
                <>
                    <View style={styles.withoutAssociation}>
                        <Text style={styles.withoutAssociationTitle}>Você não possui um veículo, vamos criar?</Text>
                        <View style={styles.initialButtonContainer}>
                            <Button
                                mode="contained"
                                onPress={handleGoToCreateVehicle}
                                style={styles.addButton}
                            >
                                Criar Veículo
                            </Button>
                        </View>
                    </View>
                </>
            }
        </View>
    </PageDefault> 
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
    },
    iconEdit: {
        position: "absolute",
        right: 0,
        zIndex: 2
    }, 
    text: {
        fontSize: 25,
        color: '#FFF',
        margin: 20,
        marginBottom: 40,
        textAlign: 'center',
        fontWeight: 'bold',
    },  
    content: {
        flex: 1,
        justifyContent: 'center',
        rowGap: 10,
        width: "100%",
        alignItems: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10
    },
    cardContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },  
    iconContent: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    textContent:{
        flex: 3
    },
    modalContainer: {
        backgroundColor: '#090833',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        height: 350,
    },
    input: {
        marginBottom: 10,
        fontSize: 20,
        color: '#FFF',
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#C36005',
        marginTop: 20,
    },
    cardText: {
        color: '#000',
        fontSize: 18,
        marginBottom: 5,
    },
    cardTitle: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    header: {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        marginLeft: 20,
        marginTop: 50,
        backgroundColor: '#090833',
    },
    buttonBack: {
        width: 90,
        backgroundColor: '#C36005',
        marginVertical: 10,
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
    withoutAssociation: {
        textAlign: "center",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        rowGap: 25,
        width: "100%"
    },
    withoutAssociationTitle: {
        color: "#fff",
        fontSize: 20,
        width: "80%",
        textAlign: "center",
        fontWeight: "bold"
    },
    addButton: {
        backgroundColor: '#C36005',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Vehicle;