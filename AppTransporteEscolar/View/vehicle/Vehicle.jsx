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

const Vehicle = () => {

    const navigation = useNavigation();
    const { userData } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [vehicles, setVehicles] = useState(null);
    const [vehicleSelect, setVehicleSelect] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reload, setReload] = useState(false);

    const requestData = async() => {
        const response = await getVehicleListByUser(userData.id) ;

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
            setTimeout(async() => {
                requestData();
            }, 1000);
        }
    }, [reload]);

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

            const response = await updateVehicle(body);

            if(response.status === 200){
                setReload(true);

                Toast.show({
                    type: 'success',
                    text1: 'Sucesso',
                    text2: "Edição realizada com sucesso!",
                    visibilityTime: 3000,
                });

                setModalVisible(false);
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

    const handleOpenModalEdit = (vehicle) => {
        setModalVisible(!modalVisible);
        setVehicleSelect(vehicle);
    };

    return  <PageDefault headerTitle="Meus Veículos" navigation={navigation} loading={isLoading} backNavigation={"Perfil"}>
        <View style={styles.content}>
            {
                vehicles?.map((vehicle, index) => {
                    return <View style={styles.card}>
                        <View style={styles.iconEdit}>
                            <IconButton 
                                icon="pencil" 
                                onPress={() => handleOpenModalEdit(vehicle)} 
                            />
                        </View>
                        <View style={styles.cardContent} key={index}>
                            <View style={styles.iconContent}>
                                <FontAwesome name="bus" size={"40%"} color="black"/>
                            </View>
                            <View style={styles.textContent}>
                                <Text style={styles.cardText}>Placa: {vehicle?.plate.toUpperCase()}</Text>
                                <Text style={styles.cardText}>Modelo: {vehicle?.model ?? "Não informado"}</Text>
                            </View>
                        </View>
                    </View>
                })
            }
        </View>
        <ModalEdit data={vehicleSelect} open={modalVisible} onClose={handleOpenModalEdit} handleConfirm={handleUpdate}/>
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Vehicle;