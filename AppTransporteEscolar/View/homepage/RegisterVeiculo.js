import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Card, Modal, Portal, TextInput, IconButton, Provider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RegisterVeiculo = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleModalToggle = () => {
        setModalVisible(!modalVisible);
    };
    const [veiculo, setVeiculo] = useState({
        marca: 'Toyota',
        modelo: 'Corolla',
        cor: 'Preto',
        placa: 'ABC-1234'
    });

    const [tempVeiculo, setTempVeiculo] = useState({ ...veiculo });

    const handleSave = () => {
        if (tempVeiculo.modelo && tempVeiculo.cor && tempVeiculo.placa) {
            setVeiculo({ ...tempVeiculo });
            setModalVisible(false);
        } else {
            // Handle error, e.g., show a message to the user
            alert('Por favor, preencha todos os campos');
        }
    };

    return (
        <Provider>
            <Portal.Host>
                <View style={styles.view}>
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
                                            onPress={handleModalToggle} 
                                        />
                                    )} 
                                />
                                <Card.Content>
                                    <Text style={styles.cardText}>Marca: {veiculo.marca}</Text>
                                    <Text style={styles.cardText}>Modelo: {veiculo.modelo}</Text>
                                    <Text style={styles.cardText}>Cor: {veiculo.cor}</Text>
                                    <Text style={styles.cardText}>Placa: {veiculo.placa}</Text>
                                </Card.Content>
                            </Card>
                        </View>
                    </KeyboardAwareScrollView>
                    <Portal>
                        <Modal visible={modalVisible} onDismiss={handleModalToggle} contentContainerStyle={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Editar Veículo</Text>
                            <TextInput
                                label="Modelo"
                                value={tempVeiculo.modelo}
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                                onChangeText={(text) => setTempVeiculo({ ...tempVeiculo, modelo: text })}
                                style={styles.input}
                            />
                            <TextInput
                                label="Cor"
                                value={tempVeiculo.cor}
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                                onChangeText={(text) => setTempVeiculo({ ...tempVeiculo, cor: text })}
                                style={styles.input}
                            />
                            <TextInput
                                label="Placa"
                                value={tempVeiculo.placa}
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                                onChangeText={(text) => setTempVeiculo({ ...tempVeiculo, placa: text })}
                                style={styles.input}
                            />
                            <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                                Salvar
                            </Button>
                        </Modal>
                    </Portal>
                </View>
            </Portal.Host>
        </Provider>
    );
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

export default RegisterVeiculo;