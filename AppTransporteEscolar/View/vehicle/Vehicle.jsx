import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalEdit from './components/ModalEdit';
import { getVehicleByUser } from '../../data/vehicleServices';
import { auth } from '../../firebase/firebase';
import { AuthContext } from '../../providers/AuthProvider';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@expo/vector-icons';

const Vehicle = ({ navigation }) => {
    const { userData } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [vehicle, setVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const requestData = async() => {
            setIsLoading(true);

            const response = await getVehicleByUser(userData.id) ;

            if(response.status === 200){
                setVehicle(response.data);
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

        requestData();
    }, []);

    const handleUpdate = (vehicle) => {
        if (vehicle?.model && vehicle?.color && vehicle?.plate) {

        } else {
            // Handle error, e.g., show a message to the user
            alert('Por favor, preencha todos os campos');
        }
    };

    const handleOpenModalEdit = () => {
        setModalVisible(!modalVisible);
    };

    return <View style={styles.view}>
        <View style={styles.header}>
            <Button
                onPress={() => navigation.goBack()}
                style={styles.buttonBack}
                labelStyle={styles.buttonLabel}
            >
                <Text>Voltar</Text>
            </Button>
        </View>
        <KeyboardAwareScrollView>
            <View style={styles.content}>
                <Text style={styles.text}>Seu Veículo Registrado</Text>
                <View style={styles.card}>
                    <View style={styles.iconEdit}>
                        <IconButton 
                            icon="pencil" 
                            onPress={handleOpenModalEdit} 
                        />
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.iconContent}>
                            <FontAwesome name="bus" size={"40%"} color="black"/>
                        </View>
                        <View style={styles.textContent}>
                            <Text style={styles.cardText}>Placa: {vehicle?.plate.toUpperCase()}</Text>
                            <Text style={styles.cardText}>Modelo: {vehicle?.model ?? "Não informado"}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
        <ModalEdit data={vehicle} open={modalVisible} onClose={handleOpenModalEdit} handleConfirm={handleUpdate}/>
        {isLoading && (
            <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#C36005" />
            </View>
        )}
    </View>  
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