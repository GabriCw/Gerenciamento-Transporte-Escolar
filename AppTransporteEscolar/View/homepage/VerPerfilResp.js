import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Button, TextInput, IconButton, Modal, Portal, Card, Provider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome } from '@expo/vector-icons';
import { AuthContext } from '../../providers/AuthProvider';
import { updateUser } from '../../data/userServices';
import Toast from 'react-native-toast-message';
import { formatCPF, formatRG } from '../../utils/formatUtils';
import { getAddressByCEP } from '../../data/cepServices';

const VerPerfilResp = ({ navigation }) => {
    const { userData, handleUpdateUserdata } = useContext(AuthContext);

    console.log(userData);

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [cep, setCep] = useState(null);
    const [address, setAddress] = useState(null);
    const [number, setNumber] = useState(null);
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
    const [cpf, setCpf] = useState(null);
    const [rg, setRg] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleUser, setIsModalVisibleUser] = useState(false);

    useEffect(() => {
        setName(userData.name);
        setEmail(userData.email);
        setCep(userData.cep);
        setAddress(userData.address);
        setNumber(userData.number);
        setState(userData.state);
        setCity(userData.city);
        setCpf(formatCPF(userData.cpf));
        setRg(formatRG(userData.rg));
    }, [navigation, userData]);

    const handleOpenModalUser = () => {
        setIsModalVisibleUser(!isModalVisibleUser);
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

    const handleSaveUser = async() => {
        if (!name || !email || !cpf || ( rg && !rg)) {
            Alert.alert('Erro', 'Preencha todos os campos para salvar o endereço');
            return;
        }

        const body = {
            id: userData.id,
            name: name,
            email: email,
            cnh: "",
            cpf: cpf?.replace(/[.\-]/g, ''),
            rg: rg?.replace(/[.\-]/g, ''),
            user_type_id: 3
        };

        const response = await updateUser(body);

        if(response.status === 200){
            const reload = await handleUpdateUserdata();

            if(reload === true){
                setTimeout(() => {
                    Toast.show({
                        type: 'success',
                        text1: 'Sucesso',
                        text2: 'Edição realizada com sucesso!',
                        visibilityTime: 3000,
                    });
                    handleOpenModalUser();
                }, 1000);
            }
            else{
                Toast.show({
                    type: 'error',
                    text1: 'Sucesso',
                    text2: 'Erro ao atualizar',
                    visibilityTime: 3000,
                });
            }
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Sucesso',
                text2: 'Erro ao editar',
                visibilityTime: 3000,
            });
        }
    };

    const searchAddressByCEP = async() => {
        const response = await getAddressByCEP(cep);

        if(response.status === 200){
            setAddress(data.logradouro);
            setState(data.uf);
            setCity(data.localidade);
            setNumber(null);
        }
        else{
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
                    <View style={styles.content}>
                        <Card style={styles.addressCard}>
                            <Card.Title
                                title="Dados Pessoais"
                                titleStyle={styles.cardTitle}
                                right={(props) => <IconButton {...props} icon="pencil" onPress={handleOpenModalUser} />}
                            />
                            <Card.Content>
                                <Text style={styles.cardText}>Nome: {name}</Text>
                                <Text style={styles.cardText}>Email: {email}</Text>
                                <Text style={styles.cardText}>CPF: {cpf}</Text>
                                {
                                    rg && <Text style={styles.cardText}>RG: {rg}</Text>
                                }
                            </Card.Content>
                        </Card>

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
                <Portal>
                    <Modal visible={isModalVisibleUser} onDismiss={handleOpenModalUser} contentContainerStyle={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Editar Usuário</Text>
                        <TextInput
                            label="Nome"
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                            }}
                            style={styles.textInputModal}
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                        />
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.textInputModal}
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                        />
                        <TextInput
                            label="CPF"
                            value={cpf}
                            onChangeText={setCpf}
                            style={styles.textInputModal}
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                        />
                        {
                            rg && <TextInput
                                    label="RG"
                                    value={rg}
                                    onChangeText={setRg}
                                    style={styles.textInputModal}
                                    mode="outlined"
                                    activeOutlineColor="#C36005"
                                    keyboardAppearance="dark"
                                />
                        }
                        <Button mode="contained" onPress={handleSaveUser} style={styles.saveButton}>
                            Salvar
                        </Button>
                    </Modal>

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
                        <Button mode="contained" onPress={searchAddressByCEP} style={[styles.searchButton, {marginTop:15, marginBottom:15}]} disabled={cep?.length !== 8}>
                            Buscar
                        </Button>
                        <TextInput
                            label="Endereço"
                            value={address}
                            onChangeText={setAddress}
                            style={[styles.textInputModal, cep?.length !== 8 && styles.disabledTextInput]}
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            editable={cep?.length === 8}
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
                            style={[styles.textInputModal, cep?.length !== 8 && styles.disabledTextInput]}
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            editable={cep?.length === 8}
                        />
                        <TextInput
                            label="Cidade"
                            value={city}
                            onChangeText={setCity}
                            style={[styles.textInputModal, cep?.length !== 8 && styles.disabledTextInput]}
                            mode="outlined"
                            activeOutlineColor="#C36005"
                            keyboardAppearance="dark"
                            editable={cep?.length === 8}
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

export default VerPerfilResp;