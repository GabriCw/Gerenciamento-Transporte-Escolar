import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { Button, TextInput, IconButton, Modal, Portal, Card, Provider, ActivityIndicator } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome } from '@expo/vector-icons';
import { AuthContext } from '../../providers/AuthProvider';
import { getUserById, getUserDetails, updateUser } from '../../data/userServices';
import Toast from 'react-native-toast-message';
import { formatCPF, formatRG } from '../../utils/formatUtils';
import { getPointByUser, updatePoint } from '../../data/pointServices';
import { pointTypeEnum } from '../../utils/pointTypeEnum';
import ModalEditUser from './components/ModalEditUser';
import ModalEditPoint from './components/ModalEditPoint';
import Header from '../../components/header/Header';
import PageDefault from '../../components/pageDefault/PageDefault';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const navigation = useNavigation();
    const { userData } = useContext(AuthContext);

    const [user, setUser] = useState(null);
    const [point, setPoint] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleUser, setIsModalVisibleUser] = useState(false);
    const [reload, setReload] = useState(false);

    const requestData = async() => {
        const [user, points] = await Promise.all([getUserById(userData.id), getPointByUser(userData.id)])

        if(user.status === 200 && points.status === 200){
            setUser(user.data);

            const pointAddress = points.data[0];
            const address = pointAddress.address;

            setPoint(pointAddress);
            setAddress(address);
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Sucesso',
                text2: 'Erro ao carregar informações',
                visibilityTime: 3000,
            });
            navigation.goBack()                
        }

        setIsLoading(false);
        setReload(false);
    };

    useEffect(() => {
        setIsLoading(true);
        requestData();
    }, []);

    useEffect(() => {
        if(reload === true){
            setTimeout(() => {
                requestData();
            }, 2000);
        }
    }, [reload]);

    const handleOpenModalUser = () => {
        setIsModalVisibleUser(!isModalVisibleUser);
    };

    const handleOpenModalPoint = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleUpdatePoint = async(pointUpdate) => { 
        if (!pointUpdate?.address || !pointUpdate?.number || !pointUpdate?.state || !pointUpdate?.city) {
            Alert.alert('Erro', 'Preencha todos os campos para salvar o endereço');
            return;
        }
        
        const body = {
            id: pointUpdate?.id,
            name: pointUpdate?.name,
            address: `${pointUpdate?.address}, ${pointUpdate?.number}`,
            city: pointUpdate?.city,
            neighborhood: pointUpdate?.neighborhood,
            state: pointUpdate?.state,
            description: pointUpdate?.description,
            point_type_id: pointTypeEnum.RESIDÊNCIA
        };
        
        setIsLoading(true);

        const response = await updatePoint(body);

        if(response.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Edição realizada com sucesso!',
                visibilityTime: 3000,
            });
            handleOpenModalPoint();
            setReload(true);    
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

    const handleUpdateUser = async(userUpdate) => {
        if (!userUpdate?.name || !userUpdate?.email || !userUpdate?.cpf || (userUpdate?.rg && !userUpdate?.rg) || (userUpdate?.cnh && !userUpdate?.cnh)) {
            Alert.alert('Erro', 'Preencha todos os campos para salvar o endereço');
            return;
        }

        const body = {
            id: userUpdate?.id,
            name: userUpdate?.name,
            email: userUpdate?.email,
            cnh: userUpdate?.cnh === "" ? null : userUpdate?.cnh,
            cpf: userUpdate?.cpf?.replace(/[.\-]/g, ''),
            rg: userUpdate?.rg?.replace(/[.\-]/g, ''),
            user_type_id: userData.user_type_id
        };

        setIsLoading(true);

        const response = await updateUser(body);

        if(response.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Edição realizada com sucesso!',
                visibilityTime: 3000,
            });
            handleOpenModalUser();
            setReload(true);
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao editar',
                visibilityTime: 3000,
            });
        }
    };

    return (
        <PageDefault headerTitle="Perfil" navigation={navigation} loading={isLoading} backNavigation={"Perfil"}>
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
                            <View>
                                <Text style={styles.nameTitle}>{user?.name}</Text>
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
                                    <Text style={styles.cardText}>Email: {user?.email}</Text>
                                    <Text style={styles.cardText}>CPF: {formatCPF(user?.cpf)}</Text>
                                    {
                                        user?.rg && <Text style={styles.cardText}>RG: {formatRG(user?.rg)}</Text>
                                    }
                                    {
                                        user?.cnh && <Text style={styles.cardText}>CNH: {user?.cnh}</Text>
                                    }
                                </Card.Content>
                            </Card>

                            {
                                point && <Card style={styles.addressCard}>
                                    <Card.Title
                                        title="Meu Endereço"
                                        titleStyle={styles.cardTitle}
                                        right={(props) => <IconButton {...props} icon="pencil" onPress={handleOpenModalPoint} />}
                                    />
                                    <Card.Content>
                                        <Text style={styles.cardText}>Endereço: {address}</Text>
                                        <Text style={styles.cardText}>Bairro: {point?.neighborhood}</Text>
                                        <Text style={styles.cardText}>Estado: {point?.state}</Text>
                                        <Text style={styles.cardText}>Cidade: {point?.city}</Text>
                                    </Card.Content>
                                </Card>
                            }
                        </View>
                    </KeyboardAwareScrollView>
                </ScrollView>
                <ModalEditUser data={user} open={isModalVisibleUser} onClose={handleOpenModalUser} handleConfirm={handleUpdateUser}/>
                <ModalEditPoint data={point} open={isModalVisible} address={address} onClose={handleOpenModalPoint} handleConfirm={handleUpdatePoint}/>
        </PageDefault>
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
    },
    nameTitle: {
        color: "#fff",
        fontSize: 25,
        marginTop: 10,
        fontWeight: 'bold',
    },  
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    content2: {
        alignItems: 'center',
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Profile;