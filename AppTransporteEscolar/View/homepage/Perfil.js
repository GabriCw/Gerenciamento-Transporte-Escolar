import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';

const Perfil = ({navigation}) => {

    const cadastrarAlunos = () => {
        navigation.navigate('Alunos');
    }

    return (
        <View style={styles.view}>
            <View style={styles.content}>
                <Text style={styles.text}>Perfil</Text>
                <Button 
                    onPress={cadastrarAlunos}
                    style={styles.buttonBack}
                    labelStyle={styles.buttonLabel}
                    >
                    Ver Alunos
                </Button>
            </View>
        </View>
    );

} 

const styles = StyleSheet.create({
    view: {
    flex: 1,
    backgroundColor: '#090833',
    }, 
    text: {
        fontSize: 20,
        color: '#FFF',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default Perfil;