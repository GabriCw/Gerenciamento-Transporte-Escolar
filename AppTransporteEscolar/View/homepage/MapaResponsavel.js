import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Button } from 'react-native-paper';
import { getPinImage } from '../../utils/getPinImage';
import { styles } from './Style/mapaResponsavelStyle'

const MapaResponsavel = ({ navigation }) => {
    const [camera, setCamera] = useState({
        center: {
            latitude: 0,
            longitude: 0,
        },
        pitch: 50,
        heading: 0,
        altitude: 0,
        zoom: 19,
    });
    const [optimizedWaypoints, setOptimizedWaypoints] = useState([]);
    const apiKey = 'AIzaSyB65ouahlrzxKKS3X_VeMHKWZPYrJTJx6E';
    const mapStyle = require('../../utils/mapstyle.json');
    const [totalDuration, setTotalDuration] = useState(null);
    const [totalDistance, setTotalDistance] = useState(null);
    const [nextWaypointDistance, setNextWaypointDistance] = useState(null);
    const [nextWaypointDuration, setNextWaypointDuration] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [currentLeg, setCurrentLeg] = useState(4) // Esse estado representa a 'perna' atual da rota, ou seja, qual o trecho atual

    useEffect(() => {
        const simulateLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation
            });
            const { latitude, longitude, heading } = location.coords;
            setUserLocation({ latitude, longitude });
            setCamera({
                center: {
                    latitude: latitude,
                    longitude: longitude,
                },
                pitch: 50,
                heading: heading,
                altitude: 0,
                zoom: 19
            });

            const waypoints = [
                { name: 'Felipe Matos Silvieri', latitude: latitude, longitude: longitude }, // Localização atual como primeiro ponto
                { name: 'Davi Soares', latitude: -23.650644, longitude: -46.578266 },
                { name: 'Gabriel Couto', latitude: -23.626814, longitude: -46.579835 },
                { name: 'Denverson Dias', latitude: -23.647414, longitude: -46.575591 },
                { name: 'Henrique Mello', latitude: -23.651001, longitude: -46.579639 },
                { name: 'Rosana Lima', latitude: -23.631476, longitude: -46.572259 },
            ];

            const origin = `${waypoints[0].latitude},${waypoints[0].longitude}`;
            const destination = `${waypoints[waypoints.length - 1].latitude},${waypoints[waypoints.length - 1].longitude}`;
            const waypointsString = waypoints
                .slice(1, -1)
                .map(point => `${point.latitude},${point.longitude}`)
                .join('|');

            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypointsString}&key=${apiKey}&overview=full&polylineQuality=high`;

            try {
                const response = await axios.get(url);
                if (response.data.routes && response.data.routes.length) {
                    const optimizedOrder = response.data.routes[0].waypoint_order;
                    const optimizedWaypoints = [waypoints[0], ...optimizedOrder.map(index => waypoints[index + 1]), waypoints[waypoints.length - 1]];
                    setOptimizedWaypoints(optimizedWaypoints);

                    // Atualizar a duração e a distância total
                    const route = response.data.routes[0];
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
                console.log('Error fetching directions:', error);
            }
        };

        simulateLocation();
    }, []);

    const monitorAuthState = async () => {
        onAuthStateChanged(auth, user => {
            if (!user) {
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

    const handleLogout = async () => {
        await signOut(auth);
    };

    if (!userLocation) {
        return (
            <View style={styles.loading}>
                <Text style={styles.text}>Carregando Mapa...</Text>
            </View>
        );
    }


    return (
        <View style={styles.view}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <MapView
                        style={styles.map}
                        showsMyLocationButton={true}
                        customMapStyle={mapStyle}
                        camera={camera}
                    >
                        {userLocation && (
                            <Marker
                                coordinate={userLocation}
                                title="Sua localização"
                            >
                                <Image
                                    source={require('../../assets/icons/van.png')}
                                    style={{ width: 30, height: 60 }}
                                />
                            </Marker>
                        )}
                        {optimizedWaypoints.length > 1 && (
                            <MapViewDirections
                                origin={optimizedWaypoints[0]}
                                waypoints={optimizedWaypoints.slice(1, -1)}
                                destination={optimizedWaypoints[optimizedWaypoints.length - 1]}
                                apikey={apiKey}
                                strokeWidth={8}
                                strokeColor="orange"
                                optimizeWaypoints={true}
                                lineCap="round"
                                precision="high"
                                mode="DRIVING"
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
                                    style={{ width: 30, height: 30 }}
                                />
                            </Marker>
                        ))}
                    </MapView>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.infoCard}>
                    <Text>
                        Distância Total: {(totalDistance / 1000).toFixed(2)} Km{'\n'}
                        Duração Total: {(totalDuration / 3600).toFixed(2)} Hrs{'\n'}
                        Distância até o Próximo Ponto: {(nextWaypointDistance / 1000).toFixed(2)} Km{'\n'}
                        Duração até o Próximo Ponto: {(nextWaypointDuration / 60).toFixed(2)} Min
                    </Text>
                </View>
            </View>

            <View style={styles.header}>
                <Button
                    mode="contained"
                    onPress={handleLogout}
                >
                    Sair
                </Button>
            </View>

            {/* Renderizando o card da criança
            {currentChild && (
                <View style={styles.footer}>
                    <ChildCard
                        child={currentChild}
                        onDeliver={() => setCurrentLeg((prev) => prev + 1)}
                    />
                </View>
            )} */}
        </View>
    );
};

export default MapaResponsavel;
