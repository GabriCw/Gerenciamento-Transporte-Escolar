import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { AuthContext } from '../../providers/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import { userTypeEnum } from '../../utils/userTypeEnum';
import DriverButtons from './components/DriverButtons';
import ResponsibleButtons from './components/ResponsibleButtons';
import AdminButtons from './components/AdminButtons';

const ProfileTab = ({navigation}) => {

    const {userData} = useContext(AuthContext);

    const userTypeConfig = {
        [userTypeEnum.ADMINISTRADOR]: {
            subtitle: "Administrador",
            buttons: <AdminButtons navigation={navigation}/>
        },
        [userTypeEnum.MOTORISTA]: {
            subtitle: "Motorista",
            buttons: <DriverButtons navigation={navigation}/>
        },
        [userTypeEnum.RESPONSAVEL]: {
            subtitle: "Responsável",
            buttons: <ResponsibleButtons navigation={navigation}/>
        }
    };

    const currentUserConfig = userTypeConfig[userData.user_type_id] || {};

    return (
        <View style={styles.view}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.perfilBox}>
                        <FontAwesome name="user" size={40} color="#000" style={{marginLeft:10, marginRight:25}} />
                        <View>
                            <Text style={[styles.text, {marginLeft:5}]}>{userData.name}</Text>
                            <Text style={[styles.subtext, {marginLeft:5}]}>{currentUserConfig?.subtitle}</Text>
                        </View>
                    </View>
                </View>
                {currentUserConfig?.buttons}
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

export default ProfileTab;