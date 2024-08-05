import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Card, Modal, Portal, TextInput, IconButton, Provider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalEdit from './components/ModalEdit';

const Vehicle = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [vehicle, setVehicle] = useState(null);

    useEffect(() => {
        const requestData = async() => {
            // const response = await 
            const response = {
                model: null ?? "Não informado",
                plate: "cpk1212".toUpperCase(),
                vehicle_type_id: 1,
                chassi: null,
                user_id: 3,
                change_date: null,
                id: 3,
                color: null ?? "Não informado",
                year: null ?? "Não informado",
                renavam: null,
                creation_user: 2,
                change_user: null
            };

            setVehicle(response);
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
                <Card style={styles.card}>
                    <Card.Title 
                        title={"Veículo Registrado"} 
                        titleStyle={styles.cardTitle}
                        right={(props) => (
                            <IconButton 
                                {...props} 
                                icon="pencil" 
                                onPress={handleOpenModalEdit} 
                            />
                        )} 
                    />
                    <Card.Content>
                        <Text style={styles.cardText}>Placa: {vehicle?.plate}</Text>
                        <Text style={styles.cardText}>Modelo: {vehicle?.model}</Text>
                        <Text style={styles.cardText}>Cor: {vehicle?.color}</Text>
                    </Card.Content>
                </Card>
            </View>
        </KeyboardAwareScrollView>
        <ModalEdit data={vehicle} open={modalVisible} onClose={handleOpenModalEdit} handleConfirm={handleUpdate}/>
    </View>  
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
    },
    text: {
        fontSize: 20,
        color: '#FFF',
        margin: 20,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        margin: 20,
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
});

export default Vehicle;