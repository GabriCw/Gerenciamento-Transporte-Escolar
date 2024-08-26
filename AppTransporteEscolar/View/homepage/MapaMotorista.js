import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { getPinImage } from '../../utils/getPinImage';
import { getDistance } from 'geolib';
import { styles } from './Style/mapaMotoristaStyle';
import { Button } from 'react-native-paper';
import { formatTime, formatDistance } from '../../utils/formatUtils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { postDriverLocation } from '../../data/locationServices';
import { AuthContext } from '../../providers/AuthProvider';


const MapaMotorista = ({ navigation }) => {
    const [waypoints, setWaypoints] = useState(
    [
        { name: 'Mauá', latitude: -23.647438, longitude: -46.575321 }, 
        { name: 'Sacramento', latitude: -23.653268, longitude: -46.574290 },
        { name: 'Shopping', latitude: -23.626883, longitude: -46.580122 },
    ]
    )
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
    const [startButton, setStartButton] = useState(true);
    const [routeOnGoing, setRouteOngoing] = useState(false);
    const [waypointOrder, setWaypointOrder] = useState([]);
    const {userData} = useContext(AuthContext);
    const [clock, setClock] = useState(true);


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
                    // console.log('User Location: ', userLocation)
                    setRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.005,  // Ajuste o zoom conforme necessário
                        longitudeDelta: 0.005,
                    });
                    setHeading(heading || 0);
                    if ( routePoints.length > 0 && {latitude, longitude}) {
                        const distanceToRoute = calculateDistanceToRoute({latitude, longitude});
                        if (distanceToRoute > recalculateThreshold) {
                            calculateRoute(waypoints,{latitude, longitude});
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
    }, []);

    const calculateRoute = async (stateWaypoints, currentLocation) => {
        const waypoints = [{ name: 'Felipe Matos Silvieri', latitude: currentLocation.latitude, longitude: currentLocation.longitude },...stateWaypoints] 
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
                setWaypointOrder(optimizedOrder);
                
                const orderedWaypoints = [waypoints[0], ...optimizedOrder.map(i => waypoints[i + 1]), waypoints[waypoints.length - 1]];
        
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
    };

    const startRoute = (schedule) => {
        if (schedule === 1){
            // Chamada API ida (recebe do backend a lista de alunos de ida (waypoints))
            calculateRoute(waypoints, userLocation); // os waypoints vem da API (backend)
            setRouteOngoing(true);
            setStartButton(false);
            console.log('Rota de ida iniciada!')
        }
        else if (schedule === 2){
            // Chamada API volta (recebe do backend a lista de alunos de volta (waypoints))
            calculateRoute(waypoints, userLocation); // os waypoints vem da API (backend)
            setRouteOngoing(true);
            setStartButton(false);
            console.log('Rota de volta iniciada!')
        }
        else {
            console.log('Erro no tipo da schedule.')
        }
    }

    const endRoute = (schedule) => {
        if (schedule === 0){
            // Enviar info de fim de viagem pra API
            setRouteOngoing(false);
            setStartButton(true);
        }
        else if (schedule === 1){
            // Enviar info de fim de viagem pra API
            setRouteOngoing(false);
            setStartButton(true)
        }
        else {
            console.log('Erro no tipo da schedule.')
        }       
    }

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
            // calculateRoute()
        }
        else{
            console.log('Criança não entregue!')
        }

        setWaypointProximity(false);
    }

    // ---------- Envio do pacote de informações ao Backend ----------

    const handlePostDriverLocation = async(body) => {
        const postLocation = await postDriverLocation(body)

        if(postLocation.status === 201){
            console.log('Sucesso ao enviar localização do motorista')
        }
        else{   
            console.log('Erro ao enviar localização do motorista')
        }
    }

    // O que tem que ser enviado:
    // UserId do motorista, que vem do user 
    useEffect(() => {

        
        // if (isLocationAvailable && routeOnGoing) {
            
        //     setRegion({
            //         latitude: userLocation.latitude,
            //         longitude: userLocation.longitude,
        //         latitudeDelta: 0.005,  // Ajuste o zoom conforme necessário
        //         longitudeDelta: 0.005,
        //     });
        // }
        
    },[userLocation])

    
    useEffect(() => {
        // console.log(clock)
        
        const isLocationAvailable = userLocation?.latitude && userLocation?.longitude
        
        if (isLocationAvailable && routeOnGoing) {
            const body = {
                lat: userLocation.latitude,
                lng: userLocation.longitude,
                user_id: userData.id
            }
            console.log('body: ',body)
        }
    },[clock])


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
                            zoom: 18,
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
            {startButton && (
                <View style={styles.startButtonPos}>
                    <View style={styles.startButton}>
                        <Button style = {styles.startRouteButton}
                            onPress={() => startRoute(1)}
                        >
                            <Text style={{color:'white', fontSize: 15, fontWeight: 'bold'}}>IDA ESCOLA</Text>
                        </Button>

                        <Button style = {styles.startRouteButton}
                            onPress={() => startRoute(2)}
                        >
                            <Text style={{color:'white', fontSize: 15, fontWeight: 'bold'}}>VOLTA ESCOLA</Text>
                        </Button>
                    </View>
                </View>
            )}

            {/* ---------- CARD INFO ROTA ---------- */}
            {!startButton &&(
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
            )
            }
            
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
            
        </View>
    );
}

export default MapaMotorista;