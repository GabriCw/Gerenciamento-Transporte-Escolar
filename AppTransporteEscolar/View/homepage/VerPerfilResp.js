import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, TextInput, IconButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome } from '@expo/vector-icons';
import { AuthContext } from '../../providers/AuthProvider';

const VerPerfilResp = ({ navigation }) => {
    const { userData } = useContext(AuthContext);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingCep, setIsEditingCep] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingState, setIsEditingState] = useState(false);
    const [isEditingCity, setIsEditingCity] = useState(false);

    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [cep, setCep] = useState(userData.cep);
    const [address, setAddress] = useState(userData.address);
    const [state, setState] = useState(userData.state);
    const [city, setCity] = useState(userData.city);

    const formatCPF = (cpf) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const [cpf] = useState(formatCPF(userData.cpf));

    const toggleEditing = (setter) => {
        setter(prevState => !prevState);
    };

    return (
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
                <View style={{ justifyContent: 'flex-start', marginTop: '5%', marginLeft: '5%' }}>
                    <Text style={styles.title}>Meus Dados</Text>
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
                    <View style={[styles.inputRow, {marginTop:18, marginBottom:30}]}>
                        <Text style={styles.textInput2}>CPF: {cpf}</Text>
                    </View>
                    <View style={styles.inputRow}>
                        {isEditingCep ? (
                            <TextInput
                                value={cep}
                                onChangeText={setCep}
                                style={styles.textInput}
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                            />
                        ) : (
                            <Text style={styles.textInput2}>CEP: {cep}</Text>
                        )}
                        <IconButton
                            icon={isEditingCep ? "check" : "pencil"}
                            onPress={() => toggleEditing(setIsEditingCep)}
                            style={styles.editButton}
                            color="white"
                        />
                    </View>
                    <View style={styles.inputRow}>
                        {isEditingAddress ? (
                            <TextInput
                                value={address}
                                onChangeText={setAddress}
                                style={styles.textInput}
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                            />
                        ) : (
                            <Text style={styles.textInput2}>Endereço: {address}</Text>
                        )}
                        <IconButton
                            icon={isEditingAddress ? "check" : "pencil"}
                            onPress={() => toggleEditing(setIsEditingAddress)}
                            style={styles.editButton}
                            color="white"
                        />
                    </View>
                    <View style={styles.inputRow}>
                        {isEditingState ? (
                            <TextInput
                                value={state}
                                onChangeText={setState}
                                style={styles.textInput}
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                            />
                        ) : (
                            <Text style={styles.textInput2}>Estado: {state}</Text>
                        )}
                        <IconButton
                            icon={isEditingState ? "check" : "pencil"}
                            onPress={() => toggleEditing(setIsEditingState)}
                            style={styles.editButton}
                            color="white"
                        />
                    </View>
                    <View style={styles.inputRow}>
                        {isEditingCity ? (
                            <TextInput
                                value={city}
                                onChangeText={setCity}
                                style={styles.textInput}
                                mode="outlined"
                                activeOutlineColor="#C36005"
                                keyboardAppearance="dark"
                            />
                        ) : (
                            <Text style={styles.textInput2}>Cidade: {city}</Text>
                        )}
                        <IconButton
                            icon={isEditingCity ? "check" : "pencil"}
                            onPress={() => toggleEditing(setIsEditingCity)}
                            style={styles.editButton}
                            color="white"
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
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
        marginBottom: 20,
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
    textInput2: {
        flex: 1,
        fontSize: 20,
        color: '#FFF',
    },
    editButton: {
        backgroundColor: '#C36005',
    },
});

export default VerPerfilResp;