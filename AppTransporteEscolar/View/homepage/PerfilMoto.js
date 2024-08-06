import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { AuthContext } from '../../providers/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const PerfilMoto = ({navigation}) => {

    const {userData} = useContext(AuthContext);

    const cadastrarVeiculo = () => {
        navigation.navigate('Veiculo');
    }

    const verPerfil = () => {
        navigation.navigate('VerPerfilMoto');
    }

    return (
        <View style={styles.view}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.perfilBox}>
                        <FontAwesome name="user" size={40} color="#000" style={{marginLeft:10, marginRight:25}} />
                        <View>
                            <Text style={[styles.text, {marginLeft:5}]}>{userData?.name}</Text>
                            <Text style={[styles.subtext, {marginLeft:5}]}>{userData?.email}</Text>
                        </View>
                    </View>
                </View>
                <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        <Button 
                            onPress={verPerfil}
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                            >
                            Ver Perfil
                        </Button>
                        <Button 
                            onPress={cadastrarVeiculo}
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                            >
                            Ver Veiculo
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
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
        color: '#000',
    },
    subtext: {
        fontSize: 15,
        color: '#000',
    },
    content: {
        flex: 1,
        marginTop: '5%',
        alignItems: 'center',
    },
    perfilBox:{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 5,
        width: '80%',
    },
    button: {
        width: '80%',
        backgroundColor: '#C36005',
        marginTop: 20,
    },
    buttonLabel: {
        color: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'flex-start',
        backgroundColor: '#090833',
    },
    header: {
        alignSelf: 'stretch',
        alignItems: 'center',
        marginTop: 90,
        backgroundColor: '#090833',
    },
})

export default PerfilMoto;