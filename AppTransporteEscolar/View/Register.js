import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';

const RegisterScreen = ({ navigation }) => {

    const handleMotoristaPress = () => {
        navigation.navigate('RegisterMotorista');
    };

    const handleResponsavelPress = () => {
        navigation.navigate('RegisterResponsavel');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Button 
                    mode="contained" 
                    onPress={() => navigation.navigate('Login')} 
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                >
                    Voltar
                </Button>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Registrar-se</Text>
                <Text style={styles.subtitle}>Escolha qual a cadastro deseja fazer:</Text>
                <View style={styles.buttonsContainer}>
                    <Button 
                        mode="contained" 
                        onPress={handleMotoristaPress} 
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        Motorista
                    </Button>
                    <Button 
                        mode="contained" 
                        onPress={handleResponsavelPress} 
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        Responsável
                    </Button>
                </View>
            </View>
        </View>
    );
};

RegisterScreen.navigationOptions = {
    headerShown: false,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        marginBottom: 20,
        marginTop: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '50%',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 50,
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
    },
    button: {
        width: 150,
        backgroundColor: '#4B0082',
        marginVertical: 10,
    },
    buttonLabel: {
        color: 'white',
    },
});

export default RegisterScreen;
