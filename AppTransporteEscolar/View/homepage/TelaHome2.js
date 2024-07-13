import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {auth} from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Button } from 'react-native-paper';

const TelaHome2 = ({navigation}) => {
    const [region, setRegion] = useState(null);
    const [optimizedWaypoints, setOptimizedWaypoints] = useState([]);
    const apiKey = 'AIzaSyB65ouahlrzxKKS3X_VeMHKWZPYrJTJx6E'; // Defina sua API Key aqui

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            // Coordenadas dos waypoints (1o é a localização atual, o resto é otimizado)
            const waypoints = [
                { latitude, longitude }, // Localização atual como primeiro ponto
                { latitude: -23.650644, longitude: -46.578266 },
                { latitude: -23.626814, longitude: -46.579835 },
                { latitude: -23.647414, longitude: -46.575591 },
                { latitude: -23.651001, longitude: -46.579639 },
                { latitude: -23.631476, longitude: -46.572259 },
            ];

            const origin = `${waypoints[0].latitude},${waypoints[0].longitude}`;
            const destination = `${waypoints[waypoints.length - 1].latitude},${waypoints[waypoints.length - 1].longitude}`;
            const waypointsString = waypoints
                .slice(1, -1)
                .map(point => `${point.latitude},${point.longitude}`)
                .join('|');

            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypointsString}&key=${apiKey}&overview=full`;

            try {
                const response = await axios.get(url);
                if (response.data.routes && response.data.routes.length) {
                    const optimizedOrder = response.data.routes[0].waypoint_order;
                    const optimizedWaypoints = [waypoints[0], ...optimizedOrder.map(index => waypoints[index + 1]), waypoints[waypoints.length - 1]];
                    setOptimizedWaypoints(optimizedWaypoints);
                } else {
                    console.log('No routes found');
                }
            } catch (error) {
                console.log('Error fetching directions:', error);
            }
        })();
    }, []);

    const getPinImage = (index) => {
        switch (index) {
            case 0:
                return require('../../assets/icons/pin1.png');
            case 1:
                return require('../../assets/icons/pin2.png');
            case 2:
                return require('../../assets/icons/pin3.png');
            case 3:
                return require('../../assets/icons/pin4.png');
            case 4:
                return require('../../assets/icons/pin5.png');
            default:
                return require('../../assets/icons/pin6.png');
        }
    };

    const monitorAuthState = async() => {
        onAuthStateChanged(auth, user => {
            if(!user){
                navigation.navigate("Login");
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso',
                    text2: 'Logout realizado com sucesso!',
                    visibilityTime: 3000,
                });
            }
        });
    };

    monitorAuthState();

    const handleLogout = async() => {
        await signOut(auth);
    };

    if (!region) {
        return (
            <View style={styles.loading}>
                <Text style={styles.text}>Carregando Mapa...</Text>
            </View>
        );
    }

    const handleMapaMotorista = () => {
        navigation.navigate("MapaMotorista");
    };

    const handleMapaResponsavel = () => {
        navigation.navigate("MapaResponsavel");
    }

    return (
        <View style={styles.view}>
            <View style={styles.header}>
                <Button 
                    mode="contained" 
                    onPress={handleLogout}
                    style={styles.buttonBack}
                    labelStyle={styles.buttonLabel}
                >
                    Sair
                </Button>
            </View>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                        <Text style={styles.title}>Rota Otimizada</Text>
                    <View style={styles.content}>
                        <MapView
                            style={styles.map}
                            region={region}
                            onRegionChangeComplete={(region) => setRegion(region)}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                        >
                            {optimizedWaypoints.length > 1 && (
                                <MapViewDirections
                                    origin={optimizedWaypoints[0]}
                                    waypoints={optimizedWaypoints.slice(1, -1)}
                                    destination={optimizedWaypoints[optimizedWaypoints.length - 1]}
                                    apikey={apiKey}
                                    strokeWidth={8}
                                    strokeColor="red"
                                    optimizeWaypoints={true}
                                />
                            )}
                            {optimizedWaypoints.map((coordinate, index) => (
                                <Marker
                                    key={index}
                                    coordinate={coordinate}
                                    title={`Waypoint ${index + 1}`}
                                    description={`Parada ${index + 1}`}
                                >
                                    <Image
                                        source={getPinImage(index)}
                                        style={{ width: 30, height: 30 }} // Ajuste o tamanho aqui
                                    />
                                </Marker>
                            ))}
                        </MapView>
                        <Button onPress={handleMapaResponsavel}>
                            Mapa Responsavel
                        </Button>
                        <Button onPress={handleMapaMotorista}>
                            Mapa Motorista
                        </Button>
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

export default TelaHome2;
