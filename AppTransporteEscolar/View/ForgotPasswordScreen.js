import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password Screen</Text>
            <Button title="Voltar ao Login" onPress={() => navigation.navigate('Login')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default ForgotPasswordScreen;
