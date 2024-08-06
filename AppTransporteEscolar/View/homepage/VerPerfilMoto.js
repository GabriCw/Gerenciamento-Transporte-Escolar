import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { Button, TextInput, IconButton, Modal, Portal, Card, Provider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome } from '@expo/vector-icons';
import { AuthContext } from '../../providers/AuthProvider';

const VerPerfilMoto = ({ navigation }) => {
    const { userData } = useContext(AuthContext);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [cep, setCep] = useState(userData.cep || '03333000');
    const [address, setAddress] = useState(userData.address || 'Rua Marechal Barbacena');
    const [number, setNumber] = useState(userData.number || '926');
    const [state, setState] = useState(userData.state || 'SP');
    const [city, setCity] = useState(userData.city || 'São Paulo');

    const formatCPF = (cpf) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatRG = (rg) => {
        return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    };

    const [cpf] = useState(formatCPF(userData.cpf));
    const [rg] = useState(formatRG(userData.rg));
    const [isModalVisible, setIsModalVisible] = useState(false);


    const toggleEditing = (setter) => {
        setter(prevState => !prevState);
    };

    const handleModalToggle = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleSaveAddress = () => {
        if (!cep || !address || !number || !state || !city) {
            Alert.alert('Erro', 'Preencha todos os campos para salvar o endereço');
            return;
        }
        // Salvar alterações de endereço
        handleModalToggle();
    };

    const fetchAddress = async () => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) {
                Alert.alert('Erro', 'CEP não encontrado');
                return;
            }
            setAddress(data.logradouro);
            setState(data.uf);
            setCity(data.localidade);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível buscar o endereço');
        }
    };

    return (
        <Provider>
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
                <ScrollView>
                    <KeyboardAwareScrollView
                    contentContainerStyle={styles.container}
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content2}>
                        <View style={styles.iconContainer}>
                            <FontAwesome name="user" size={40} color="#000" />
                        </View>
                    </View>
                    <View style={{ justifyContent: 'flex-start', marginTop: '5%', marginLeft: '5%' }}>
                        <Text style={[styles.title, { textDecorationLine: 'underline' }]}>Meus Dados</Text>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.inputRow}>
                            {isEditingName ? (
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    style={styles.textInput}
                                    mode="outlined"
                                    activeOutlineColor="#C36005"
                                    keyboardAppearance="dark"
                                />
                            ) : (
                                <Text style={styles.textInput2}>Nome: {name}</Text>
                            )}
                            <IconButton
                                icon={isEditingName ? "check" : "pencil"}
                                onPress={() => toggleEditing(setIsEditingName)}
                                style={styles.editButton}
                                color="white"
                            />
                        </View>
                        <View style={styles.inputRow}>
                            {isEditingEmail ? (
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.textInput}
                                    mode="outlined"
                                    activeOutlineColor="#C36005"
                                    keyboardAppearance="dark"
                                />
                            ) : (
                                <Text style={styles.textInput2}>Email: {email}</Text>
                            )}
                            <IconButton
                                icon={isEditingEmail ? "check" : "pencil"}
                                onPress={() => toggleEditing(setIsEditingEmail)}
                                style={styles.editButton}
                                color="white"
                            />
                        </View>
                        <View style={[styles.inputRow, { marginTop: 18, marginBottom: 30 }]}>
                            <Text style={styles.textInput2}>CPF: {cpf}</Text>
                        </View>
                        <View style={[styles.inputRow, { marginTop: 16, marginBottom: 25 }]}>
                            <Text style={styles.textInput2}>RG: {rg}</Text>
                        </View>
                        <Card style={styles.addressCard}>
                            <Card.Title
                                title="Meu Endereço"
                                titleStyle={styles.cardTitle}
                                right={(props) => <IconButton {...props} icon="pencil" onPress={handleModalToggle} />}
                            />
                            <Card.Content>
                                <Text style={styles.cardText}>CEP: {cep}</Text>
                                <Text style={styles.cardText}>Endereço: {address}, {number}</Text>
                                <Text style={styles.cardText}>Estado: {state}</Text>
                                <Text style={styles.cardText}>Cidade: {city}</Text>
                            </Card.Content>
                        </Card>
                    </View>
                    </KeyboardAwareScrollView>
                </ScrollView>
                <Portal>
                    <Modal visible={isModalVisible} onDismiss={handleModalToggle} contentContainerStyle={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Editar Endereço</Text>
                        <TextInput
                            label="CEP"
                            value={cep}
                            onChangeText={(text) => {
                                setCep(text);
                            }}
                            style={styles.textInputModal}
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                        />
                        <Button mode="contained" onPress={fetchAddress} style={[styles.searchButton, {marginTop:15, marginBottom:15}]} disabled={cep.length !== 8}>
                            Buscar
                        </Button>
                        <TextInput
                            label="Endereço"
                            value={address}
                            onChangeText={setAddress}
                            style={[styles.textInputModal, cep.length !== 8 && styles.disabledTextInput]}
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            editable={cep.length === 8}
                        />
                        <TextInput
                            label="Número"
                            value={number}
                            onChangeText={setNumber}
                            style={styles.textInputModal}
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                        />
                        <TextInput
                            label="Estado"
                            value={state}
                            onChangeText={setState}
                            style={[styles.textInputModal, cep.length !== 8 && styles.disabledTextInput]}
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            editable={cep.length === 8}
                        />
                        <TextInput
                            label="Cidade"
                            value={city}
                            onChangeText={setCity}
                            style={[styles.textInputModal, cep.length !== 8 && styles.disabledTextInput]}
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            editable={cep.length === 8}
                        />
                        <Button mode="contained" onPress={handleSaveAddress} style={styles.saveButton}>
                            Salvar
                        </Button>
                    </Modal>
                </Portal>
            </View>
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
    },
    title: {
        fontSize: 25,
        color: '#FFF',
        textAlign: 'left',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    content2: {
        alignItems: 'center',
        marginVertical: 25,
    },
    container: {
        flex: 1,
        height: "100%",
        justifyContent: 'center',
        backgroundColor: '#090833',
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
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        paddingLeft: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    textInput: {
        flex: 1,
        fontSize: 20,
        color: '#FFF',
        marginRight: 10,
    },
    textInputModal: {
        fontSize: 20,
        color: '#FFF',
        marginRight: 10,
    },
    textInput2: {
        flex: 1,
        fontSize: 20,
        color: '#FFF',
    },
    editButton: {
        backgroundColor: '#C36005',
    },
    addressCard: {
        backgroundColor: '#D3D3D3',
        marginVertical: 10,
        marginTop: 30,
    },
    cardTitle: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardText: {
        color: '#000',
        fontSize: 18,
        marginBottom: 5,
    },
    modalContainer: {
        backgroundColor: '#090833',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        height: 500,
    },
    modalTitle: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    searchButton: {
        backgroundColor: '#C36005',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#C36005',
        marginTop: 20,
    },
    disabledTextInput: {
        backgroundColor: '#808080',
    },
});

export default VerPerfilMoto;