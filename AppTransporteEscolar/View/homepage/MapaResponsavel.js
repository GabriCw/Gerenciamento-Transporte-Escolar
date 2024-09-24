import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import MapView, { Marker, Polyline, AnimatedRegion, Animated } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { getPinImage } from '../../utils/getPinImage';
import { getDistance } from 'geolib';
import { styles } from './Style/mapaResponsavelStyle';
import { Button } from 'react-native-paper';
import { formatTime, formatDistance } from '../../utils/formatUtils';
import { FontAwesome5 } from '@expo/vector-icons';
import { getDriverLocation } from '../../data/locationServices';

// Camera que nem a do uber (rota inteira, aumentando o zoom conforme diminuindo o tamanho)

const MapaResponsavel = ({ navigation }) => {

    const [residenciaAtiva, setResidenciaAtiva] = useState(
        { name: 'Sacramento', latitude: -23.6579, longitude: -46.5744 }
    )
    const [escola, setEscola] = useState(
        { name: 'Mauá', latitude: -23.647438, longitude: -46.575321 }
    )
    
    const [heading, setHeading] = useState(0);
    const [motoristaLoc, setMotoristaLoc] = useState(null);

    const [nextWaypointDuration, setNextWaypointDuration] = useState(300);
    const [nextWaypointDistance, setNextWaypointDistance] = useState(500);

    const mapRef = useRef(null);

    const [clock, setClock] = useState(true);

    // useEffect(() => {
    //     const initializeLocation = async () => {
    //         try {
    //             let { status } = await Location.requestForegroundPermissionsAsync();
    //             if (status !== 'granted') {
    //                 console.log('Permission to access location was denied');
    //                 return;
    //             }

    //             const location = await Location.getCurrentPositionAsync({
    //                 accuracy: Location.Accuracy.BestForNavigation,
    //             });

    //             if (location) {
    //                 const { latitude, longitude, heading } = location.coords;
    //                 updateRegion({ latitude, longitude }, residenciaAtiva, 50);
    //                 setMotoristaLoc({ latitude, longitude });
    //                 setHeading(heading);
    //             } else {
    //                 console.log('Could not get current location');
    //             }
    //         } catch (error) {
    //             console.error('Error during location initialization:', error);
    //         }
    //     };

    //     initializeLocation();
    // }, []);

    
    const handleGetDriverLocation = async(schedule_id) => {
        const getLocation = await getDriverLocation(schedule_id)

        if(getLocation.status === 200){
            console.log('Sucesso ao receber localização do motorista')
            return getLocation.data
        }
        else{   
            console.log('Erro ao receber localização do motorista')
        }
    }


    useEffect(() => {
        const requestLocation = async () => {
            const locationResponse = await handleGetDriverLocation(1);
            const lastCoordinate = locationResponse.coordinates[locationResponse.coordinates?.length - 1];
            console.log('last coord: ', lastCoordinate.lat, lastCoordinate.lng);
            return lastCoordinate;
        };
    
        const updateLocation = async () => {
            const lastCoord = await requestLocation();
            updateRegion({latitude: lastCoord.lat, longitude: lastCoord.lng}, residenciaAtiva, 1000);
            setMotoristaLoc({latitude: lastCoord.lat, longitude: lastCoord.lng});
        };
    
        updateLocation();
    }, [clock]);


    useEffect(() => {
        let isMounted = true;

        const intervalFunc = () => {
            if (isMounted) {
                setClock(prevClock => !prevClock);
                setTimeout(intervalFunc, 10000); // Repetir a cada 10 segundos

            }
        };

        intervalFunc(); // Inicializar a primeira execução

        return () => {
            isMounted = false; // Limpar na desmontagem do componente
        };
    }, []);


    const updateRegion = (motoristaLoc, residenciaAtiva, time) => {
        if (!motoristaLoc || !residenciaAtiva) return;
    
        const latitudes = [motoristaLoc.latitude, residenciaAtiva.latitude];
        const longitudes = [motoristaLoc.longitude, residenciaAtiva.longitude];
    
        const minLatitude = Math.min(...latitudes);
        const maxLatitude = Math.max(...latitudes);
        const minLongitude = Math.min(...longitudes);
        const maxLongitude = Math.max(...longitudes);
    
        let latitudeDelta = (maxLatitude - minLatitude) + 0.60*(maxLatitude - minLatitude); // margem extra
        let longitudeDelta = (maxLongitude - minLongitude) + 0.25*(maxLongitude - minLongitude); // margem extra
    
        // Define um valor mínimo para o delta de latitude e longitude
        const MIN_LAT_DELTA = 0.0005; // Ajuste esse valor conforme necessário
        const MIN_LON_DELTA = 0.0005; // Ajuste esse valor conforme necessário
    
        if (latitudeDelta < MIN_LAT_DELTA) {
            latitudeDelta = MIN_LAT_DELTA;
        }
    
        if (longitudeDelta < MIN_LON_DELTA) {
            longitudeDelta = MIN_LON_DELTA;
        }
    
        const newRegion = {
            latitude: (maxLatitude + minLatitude) / 2 - (latitudeDelta * 0.08),
            longitude: (maxLongitude + minLongitude) / 2,
            latitudeDelta,
            longitudeDelta,
        };

        // Verifica se a referência do mapa está definida e então anima para a nova região
        if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, time); // 1000ms para uma animação mais suave
        }
    };

    return (
        <View style={styles.view}>
            <View style={styles.content}>
                {mapRef && (
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        showsUserLocation={false}
                        showsMyLocationButton={false}
                        showsCompass={false}
                        showsTraffic={true}
                        showsBuildings={false}
                        pitchEnabled={false}
                    >
                        {residenciaAtiva && (
                            <Marker
                                coordinate={residenciaAtiva}
                                title="Residência Ativa"
                                anchor={{ x: 0.5, y: 0.5 }}
                                rotation={0}
                            >
                                <FontAwesome5 name="house-user" size={40} color="black" />
                            </Marker>
                        )}
                        {escola && (
                            <Marker
                                coordinate={escola}
                                title="Escola"
                                anchor={{ x: 0.5, y: 0.5 }}
                                rotation={0}
                            >
                                <FontAwesome5 name="school" size={35} color="black" />
                            </Marker>
                        )}


                        {motoristaLoc && (
                            <Marker
                                coordinate={motoristaLoc}
                                title="Localização motorista"
                                anchor={{ x: 0.5, y: 0.5 }}
                                rotation={heading}
                            >
                                <Image
                                    source={require('../../assets/icons/van.png')}
                                    style={{ width: 30, height: 60 }}
                                />
                            </Marker>
                        )}
                    </MapView>
                )}
            </View>
            <View style={styles.footer}>
                <View style={styles.infoCard}>
                    <View style={styles.infoCardNextStop}>
                        <Text style={styles.infoCardTitle}>
                            Chegará ao destino
                        </Text>
                        {nextWaypointDistance && nextWaypointDuration && (
                            <View style={styles.infoCardNextStopTexts}>
                                <Text style={styles.infoCardText}>
                                    {formatDistance(nextWaypointDistance)}
                                </Text>
                                <Text style={styles.infoCardText}>
                                    {formatTime(nextWaypointDuration)}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}

export default MapaResponsavel;