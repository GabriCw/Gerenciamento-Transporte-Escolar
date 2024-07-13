import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';

const TelaHome = ({navigation}) => {

    const handleMapaMotorista = () => {
        navigation.navigate("MapaMotorista");
    };

    const handleMapaResponsavel = () => {
        navigation.navigate("MapaResponsavel");
    }

    return (
        <View style={styles.view}>
            <Button onPress={handleMapaResponsavel}>
                Mapa Responsavel
            </Button>
            <Button onPress={handleMapaMotorista}>
                Mapa Motorista
            </Button>
        </View>
    );

} 

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
        justifyContent: 'center'
    },
    header: {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        marginLeft: 20,
        marginTop: 50,
        backgroundColor: '#090833',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#090833',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#090833',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#C36005',
        textAlign: 'center',

    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '110%',
        height: 500,
    },
    text: {
        fontSize: 20,
        color: '#FFF',
    }
});

export default TelaHome;