import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { getPinImage } from '../../utils/getPinImage';
import { getDistance } from 'geolib';
import { styles } from './Style/mapaResponsavelStyle';
import { Button } from 'react-native-paper';
import { formatTime, formatDistance } from '../../utils/formatUtils';



const MapaMotorista = ({ navigation }) => {
    const [region, setRegion] = useState(null);
    const [heading, setHeading] = useState(0);
    const [userLocation, setUserLocation] = useState(null);
    const [routePoints, setRoutePoints] = useState([]);
    const [optimizedWaypoints, setOptimizedWaypoints] = useState([]);
    const mapRef = useRef(null);
    const apiKey = 'AIzaSyB65ouahlrzxKKS3X_VeMHKWZPYrJTJx6E';
    const inactivityTimeout = useRef(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [totalDuration, setTotalDuration] = useState(null);
    const [totalDistance, setTotalDistance] = useState(null);
    const [nextWaypointDistance, setNextWaypointDistance] = useState(null);
    const [nextWaypointDuration, setNextWaypointDuration] = useState(null);
    const [currentLeg, setCurrentLeg] = useState(1)
    const recalculateThreshold = 50; // Distância em metros para recalcular a rota
    const [waypointProximity, setWaypointProximity] = useState(true)

    useEffect(() => {
        const initializeLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }

                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.BestForNavigation,
                });

                if (location) {
                    const { latitude, longitude, heading } = location.coords;
                    setUserLocation({ latitude, longitude });
                    setRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.005,  // Ajuste o zoom conforme necessário
                        longitudeDelta: 0.005,
                    });
                    setHeading(heading || 0);
                    calculateRoute({ latitude, longitude });
                } else {
                    console.log('Could not get current location');
                }
            } catch (error) {
                console.error('Error during location initialization:', error);
            }
        };

        initializeLocation();
    }, []);

    useEffect(() => {
        let locationSubscription;

        const startLocationUpdates = async () => {
            locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 1000, // Atualiza a cada 1 segundo
                    distanceInterval: 1, // Ou a cada 1 metro
                },
                (location) => {
                    const { latitude, longitude, heading } = location.coords;
                    setUserLocation({ latitude, longitude });
                    setRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.005,  // Ajuste o zoom conforme necessário
                        longitudeDelta: 0.005,
                    });
                    setHeading(heading || 0);
                    if ( routePoints.length > 0) {
                        const distanceToRoute = calculateDistanceToRoute(latitude, longitude);
                        console.log(distanceToRoute)
                        if (distanceToRoute > recalculateThreshold) {
                            calculateRoute({ latitude, longitude });
                        }
                    }
                }
            );
        };

        startLocationUpdates();

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [isUserInteracting, routePoints]);

    const calculateRoute = async (currentLocation) => {
        const waypoints = [
            { name: 'Felipe Matos Silvieri', latitude: currentLocation.latitude, longitude: currentLocation.longitude }, // Localização atual como primeiro ponto
            { name: 'Mauá', latitude: -23.647438, longitude: -46.575321 }, 
            { name: 'Sacramento', latitude: -23.653268, longitude: -46.574290 },
            { name: 'Shopping', latitude: -23.626883, longitude: -46.580122 },
        ];

        const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
        const destination = `${waypoints[waypoints.length - 1].latitude},${waypoints[waypoints.length - 1].longitude}`;
        const waypointsString = waypoints
            .slice(0, -1)
            .map(point => `${point.latitude},${point.longitude}`)
            .join('|');

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypointsString}&key=${apiKey}&overview=full`;

        try {
            const response = await axios.get(url);
            if (response.data.routes && response.data.routes.length) {
                const route = response.data.routes[0];
                const decodedPolyline = polyline.decode(route.overview_polyline.points).map(point => ({
                    latitude: point[0],
                    longitude: point[1],
                }));
                setRoutePoints(decodedPolyline);

                const optimizedOrder = route.waypoint_order;
                const orderedWaypoints = [waypoints[0], ...optimizedOrder.map(i => waypoints[i + 1]), waypoints[waypoints.length - 1]];
                // console.log(route)
                setOptimizedWaypoints(orderedWaypoints);

                setTotalDuration(route.legs.reduce((acc, leg) => acc + leg.duration.value, 0)); // duração em segundos
                setTotalDistance(route.legs.reduce((acc, leg) => acc + leg.distance.value, 0)); // distância em metros
                
                if (route.legs.length > 0) {
                    const nextLeg = route.legs[currentLeg];
                    setNextWaypointDistance(nextLeg.distance.value); // distância em metros
                    setNextWaypointDuration(nextLeg.duration.value); // duração em segundos
                }
            } else {
                console.log('No routes found');
            }
        } catch (error) {
            console.log(`Error fetching directions: ${error.message || error}`);
        }
        console.log('Chegou Final')
    };

    const calculateDistanceToRoute = (latitude, longitude) => {
        if (routePoints.length === 0) return 0;
        const currentLocation = { latitude, longitude };
        return Math.min(...routePoints.map(point => getDistance(currentLocation, point)));
    };

    const recenterMap = () => {
        if (region) {
            setIsUserInteracting(false);
            try{
                mapRef.current.animateCamera({
                    center: {
                        latitude: region.latitude,
                        longitude: region.longitude,
                    },
                    pitch: 0,
                    heading: heading,
                    zoom: 18, // Ajuste o zoom conforme necessário
                    altitude: 0,
                }, { duration: 1000 }); // Anima a recentralização
            }
            catch{
                console.log('Erro de Animate Camera');
            }

        }
    };

    const handleUserInteraction = () => {
        setIsUserInteracting(true);
        if (inactivityTimeout.current) {
            clearTimeout(inactivityTimeout.current);
        }
        inactivityTimeout.current = setTimeout(recenterMap, 5000); // 5 segundos de inatividade
    };

    const handleNavigate = () => {
        navigation.navigate('Home');
    }

    // ---------- Gerencia a entrega do aluno ----------
    const handleEntrega = (bool) => {
        if (bool){
            setCurrentLeg(currentLeg+1);
        }
        else{
            console.log('Criança não entregue!')
        }

        setWaypointProximity(false);
    }

    return (
        <View style={styles.view}>
            <View style={styles.content}>
                {region && (
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        showsUserLocation={false}
                        showsMyLocationButton={false}
                        showsCompass={false}
                        showsTraffic={true}
                        showsBuildings={false}
                        pitchEnabled={false}
                        region={region}
                        onPanDrag={handleUserInteraction}
                        onRegionChangeComplete={handleUserInteraction}
                        onPress={handleUserInteraction}
                        camera={{
                            center: {
                                latitude: region.latitude,
                                longitude: region.longitude,
                            },
                            pitch: 0,
                            heading: heading, // Controla a direção do mapa
                            altitude: 0,
                            zoom: 18, // Ajuste o zoom conforme necessário
                        }}
                    >
                        {userLocation && (
                            <Marker
                                coordinate={userLocation}
                                title="Sua localização"
                                anchor={{x: 0.5, y: 0.5}}
                                rotation={0}
                            >
                                <Image
                                    source={require('../../assets/icons/van.png')}
                                    style={{ width: 30, height: 60 }}
                                />
                            </Marker>
                        )}
                        {routePoints.length > 0 && (
                            <Polyline
                                coordinates={routePoints}
                                strokeWidth={10}
                                strokeColor="orange"
                            />
                        )}
                        {optimizedWaypoints.length > 0 && optimizedWaypoints.map((coordinate, index) => (
                            <Marker
                                key={index}
                                coordinate={{ latitude: coordinate.latitude, longitude: coordinate.longitude }}
                                title={`Waypoint ${index + 1}`}
                            >
                                <Image
                                    source={getPinImage(index)}
                                    style={{ width: 30, height: 30 }}
                                />
                            </Marker>
                        ))}
                    </MapView>
                )}
            </View>
            {/* ---------- CARD INFO ROTA ---------- */}
            <View style={styles.footer}>
                <View style={styles.infoCard}>
                    <View style={styles.infoCardNextStop}>
                        <Text style={styles.infoCardTitle}>
                            Próxima Parada
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

                        {(totalDistance && totalDuration && typeof speed !== 'undefined' && typeof heading !== 'undefined') && (
                            <View style={styles.infoCardFullRouteTexts}>
                                <Text>
                                    {formatDistance(totalDistance)}
                                </Text>
                                <Text>
                                    {formatTime(totalDuration)}{'\n'}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
            
            {/* ---------- CARD ALUNO ENTREGUE ---------- */}
            {waypointProximity && (
                <View style={styles.deliveredCardPosition}> 
                    <View style={styles.deliveredCardContent}>
                        <Text style={styles.deliveredCardText}>O ALUNO FELIPE FOI ENTREGUE?</Text>
                        <View style={styles.deliveredCardButtons}>
                            <Button style={styles.deliveredCardButtonYes} mode="contained" onPress={() => handleEntrega(true)}>
                                SIM
                            </Button>
                            <Button style={styles.deliveredCardButtonNo} mode="contained" onPress={() => handleEntrega(false)}>
                                NÃO
                            </Button>
                        </View>
                    </View>
                </View>
            )}
            
            {/* ---------- BOTÃO SAIR ---------- */}
            <View style={styles.header}>
                <Button
                    mode="contained"
                    onPress={handleNavigate}
                >
                    Sair
                </Button>
            </View>
        </View>
    );
}


export default MapaMotorista;
