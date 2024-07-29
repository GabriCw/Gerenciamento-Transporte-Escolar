import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Button } from 'react-native-paper';
import { getPinImage } from '../../utils/getPinImage';
import { formatTime, formatDistance } from '../../utils/formatUtils';
import { styles } from './Style/mapaResponsavelStyle';
import { getDistance } from 'geolib';
import polyline from '@mapbox/polyline';

const MapaResponsavel = ({ navigation }) => {
    const [camera, setCamera] = useState({
        center: {
            latitude: 0,
            longitude: 0,
        },
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
    const [currentLeg, setCurrentLeg] = useState(0);
    const [currentLegName, setCurrentLegName] = useState('Felipe');
    const [speed, setSpeed] = useState(null);
    const [heading, setHeading] = useState(null);
    const [traveledRoute, setTraveledRoute] = useState([]);
    const [remainingRoute, setRemainingRoute] = useState([]);
    const [routePoints, setRoutePoints] = useState([]);
    const [apiCallCount, setApiCallCount] = useState(0); // Estado para contar chamadas à API, começa com 1 chamada
    const [waypointProximity, setWaypointProximity] = useState(true)

    const proximityThreshold = 20; // Distância em metros para atualizar a polilinha
    const recalculateThreshold = 50; // Distância em metros para recalcular a rota

    // Inicialização da tela (Permissão de localização inicial, set da câmera)

    useEffect(() => {
        const initializeLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation
            });
            const { latitude, longitude } = location.coords;
            setUserLocation({ latitude, longitude });
            setCamera((prevCamera) => ({
                ...prevCamera,
                center: { latitude, longitude },
                heading: location.coords.heading,
            }));// Colocar 'region' ao invés de camera pra incializar

            // Chamada inicial para calcular a rota
            calculateRoute({ latitude, longitude });
        };

        initializeLocation();
    }, []);

    const decodePolyline = (encoded) => {
        return polyline.decode(encoded).map(([latitude, longitude]) => ({ latitude, longitude }));
    };

    // Calcula de fato a rota, utilizando a API do Google Directions, com otimização de waypoints

    const calculateRoute = async (currentLocation) => {
        setApiCallCount(prevCount => prevCount + 1); // Incrementa o contador de chamadas
        console.log(`Chamando API do Google Maps: ${apiCallCount + 1} vez(es)`); // Log para monitorar chamadas
        
        const waypoints = [
            { name: 'Felipe Matos Silvieri', latitude: currentLocation.latitude, longitude: currentLocation.longitude }, // Localização atual como primeiro ponto
            { name: 'Davi Soares', latitude: -23.650644, longitude: -46.578266 },
            { name: 'Gabriel Couto', latitude: -23.626814, longitude: -46.579835 },
            { name: 'Denverson Dias', latitude: -23.647414, longitude: -46.575591 },
            { name: 'Henrique Mello', latitude: -23.651001, longitude: -46.579639 },
            { name: 'Rosana Lima', latitude: -23.631476, longitude: -46.572259 },
        ];
        
        const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
        const destination = `${waypoints[waypoints.length - 1].latitude},${waypoints[waypoints.length - 1].longitude}`;
        const waypointsString = waypoints
            .slice(1, -1)
            .map(point => `${point.latitude},${point.longitude}`)
            .join('|');
        
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypointsString}&key=${apiKey}&overview=full&polylineQuality=high`;
        
        try {
            const response = await axios.get(url);
            console.log('passou a response...')
            console.log(response.data.routes)
            if (response.data.routes && response.data.routes.length) {
                console.log('Entrou no if')
                const route = response.data.routes[0];
                const decodedPolyline = decodePolyline(route.overview_polyline.points);
                setRoutePoints(decodedPolyline);
                setOptimizedWaypoints(waypoints);
                // console.log('Rota otimizada:', decodedPolyline);
        
                // Atualizar a duração e a distância total
                setTotalDuration(route.legs.reduce((acc, leg) => acc + leg.duration.value, 0)); // duração em segundos
                setTotalDistance(route.legs.reduce((acc, leg) => acc + leg.distance.value, 0)); // distância em metros
        
                if (route.legs.length > 0) {
                    const nextLeg = route.legs[currentLeg];
                    setNextWaypointDistance(nextLeg.distance.value); // distância em metros
                    setNextWaypointDuration(nextLeg.duration.value); // duração em segundos
                }
                console.log('terminou o if')
        
            } else {
                console.log('No routes found');
            }
        } catch (error) {
            console.log('Error fetching directions:', error);
        }
    };    
    

    useEffect(() => {
        let locationSubscription;
    
        const startLocationWatch = async () => {
            locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 5000,
                    distanceInterval: 5,
                },
                (location) => {
                    const { latitude, longitude } = location.coords;
                    setUserLocation({ latitude, longitude });
                    if (routePoints.length > 0) {
                        updatePolyline(latitude, longitude);
                    }
                }
            );
        };
    
        startLocationWatch();
    
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [routePoints]);  // Adicione routePoints como dependência
    

    const updatePolyline = (latitude, longitude) => {
        const currentLocation = { latitude, longitude };
        console.log('Localização atual:', currentLocation);
        // console.log('Pontos da rota:', routePoints);
    
        if (routePoints.length === 0) {
            console.log('Nenhum ponto de rota disponível para cálculo de distância.');
            return;
        }
    
        // Calcular a distância mínima entre a localização atual e qualquer ponto na rota
        const distances = routePoints.map(point => getDistance(currentLocation, point));
        const distanceToNearestPoint = Math.min(...distances);
        console.log('Distância ao ponto mais próximo:', distanceToNearestPoint);
    
        if (distanceToNearestPoint > recalculateThreshold) {
            console.log(distanceToNearestPoint, ' --- Usuário está longe da rota. Recalculando...');
            calculateRoute(currentLocation);
        } else {
            let foundIndex = -1;
    
            // Encontrar o índice do ponto mais próximo dentro do limiar de proximidade
            for (let i = 0; i < routePoints.length; i++) {
                if (getDistance(routePoints[i], currentLocation) < proximityThreshold) {
                    foundIndex = i;
                    break;
                }
            }
    
            if (foundIndex !== -1) {
                const traveledPoints = routePoints.slice(0, foundIndex + 1);
                const remainingPoints = routePoints.slice(foundIndex + 1);
    
                setTraveledRoute(traveledPoints);
                setRemainingRoute(remainingPoints);
    
                // Atualizar todos os pontos percorridos
                setAllTraveledPoints(prevPoints => [...prevPoints, ...traveledPoints]);
    
                console.log('Pontos percorridos:', traveledPoints.length());
                console.log('Pontos restantes:', remainingPoints.length());
            } else {
                console.log('Nenhum ponto próximo o suficiente. Continuar verificando...');
            }
        }
    };

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
        
    
    // ---------- Monitora o Estado de autenticação do Firebase ----------

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
                        camera={camera}
                        mapType='standard'
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
                        {routePoints.length > 1 && (
                            <MapViewDirections
                                origin={optimizedWaypoints[0]}
                                waypoints={optimizedWaypoints.slice(1, -1)}
                                destination={optimizedWaypoints[optimizedWaypoints.length - 1]}
                                apikey={apiKey}
                                strokeWidth={5}
                                optimizeWaypoints={true}
                                lineCap="round"
                                precision="high"
                                mode="DRIVING"
                                onReady={result => {
                                    const points = result.coordinates; // Captura os pontos da rota
                                    // console.log('Pontos da rota gerados pelo MapViewDirections:', points);
                                    setRoutePoints(points); // Atualiza routePoints com os pontos gerados pelo MapViewDirections
                                }}
                            /> 
                        )}
                        
                        {optimizedWaypoints.length > 0 && optimizedWaypoints.map((coordinate, index) => (
                            <Marker
                                key={index}
                                coordinate={{ latitude: coordinate.latitude, longitude: coordinate.longitude }}
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
                <View style={styles.DeliveredCardPosition}> 
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
                    onPress={handleLogout}
                >
                    Sair
                </Button>
            </View>

            {/* ---------- CONTADOR CHAMADAS API ---------- */}
            <View style={styles.counterContainer}>
                <Text style={styles.counterText}>API Calls: {apiCallCount}</Text>
            </View>
        </View>
    );
};

export default MapaResponsavel;
