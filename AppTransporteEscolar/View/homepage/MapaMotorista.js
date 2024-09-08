import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Image, Text, Alert, Linking, Pressable } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { getPinImage } from '../../utils/getPinImage';
import { getDistance } from 'geolib';
import { styles } from './Style/mapaMotoristaStyle';
import { Button } from 'react-native-paper';
import { formatTime, formatDistance } from '../../utils/formatUtils';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { postDriverLocation, postRoutePoints } from '../../data/locationServices';
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
    const [encodedRoutePoints, setEncodedRoutePoints] = useState([]);
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
    const [mapsUrl, setMapsUrl] = useState('');
    const [currentStudentIndex, setCurrentStudentIndex] = useState(1); // ìndice do aluno atual (na lista de orderedWaypoints)
    const [eta, setEta] = useState(null);


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
                    const { latitude, longitude, heading, speed } = location.coords;
                    if (speed >= 0.5){ ; // Só atualiza os dados caso a velocidade seja maior que 0.5 m/s
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
                            console.log('lat, long',latitude,longitude, speed)
                            const distanceToRoute = calculateDistanceToRoute({latitude, longitude});
                            if (distanceToRoute > recalculateThreshold) {
                                calculateRoute(waypoints,{latitude, longitude});
                            }
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
                setEncodedRoutePoints(route.overview_polyline.points);
                setRoutePoints(decodedPolyline);

                const optimizedOrder = route.waypoint_order;
                setWaypointOrder(optimizedOrder);
                
                const orderedWaypoints = [waypoints[0], ...optimizedOrder.map(i => waypoints[i + 1]), waypoints[waypoints.length - 1]];
                console.log(decodedPolyline)
                setOptimizedWaypoints(orderedWaypoints);
                console.log('orderedWaypoints', orderedWaypoints)

                setTotalDuration(route.legs.reduce((acc, leg) => acc + leg.duration.value, 0)); // duração em segundos
                setTotalDistance(route.legs.reduce((acc, leg) => acc + leg.distance.value, 0)); // distância em metros
                
                console.log('aaaaaaaaaaaaaa', route.legs)

                if (route.legs.length > 0) {
                    const nextLeg = route.legs[currentLeg];
                    setNextWaypointDistance(nextLeg.distance.value); // distância em metros
                    setNextWaypointDuration(nextLeg.duration.value); // duração em segundos

                    // Cálculo do ETA: hora atual + duração em segundos
                    const eta = new Date(Date.now() + nextLeg.duration.value * 1000); // Converte segundos para milissegundos
                    setEta(eta); // Define o ETA
                }

                // Geração do link clicável para o Google Maps
                const mapsUrll = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypointsString.replace(/\|/g, '%7C')}`;
                console.log('Link para Google Maps:', mapsUrll);
                setMapsUrl(mapsUrll);

            } else {
                console.log('No routes found');
            }
            console.log('Chamou a API',{})
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
        if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
            console.log('Erro: Coordenadas inválidas para a localização atual.');
            return 0;
        }
        if (!routePoints || routePoints.length === 0) {
            console.log('Erro: Nenhum ponto de rota disponível.');
            return 0;
        }
    
        const currentLocation = { latitude, longitude };
    
        const validRoutePoints = routePoints.filter(
            point =>
                point &&
                typeof point.latitude === 'number' &&
                typeof point.longitude === 'number' &&
                !isNaN(point.latitude) &&
                !isNaN(point.longitude)
        );
        if (validRoutePoints.length === 0) {
            console.log('Erro: Nenhum ponto de rota válido encontrado.');
            return 0;
        }
        
        return Math.min(...validRoutePoints.map(point => getDistance(currentLocation, point)));
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


    // ------------------------------------------------------------ //
    //                Gerencia a Entrega dos Alunos
    // ------------------------------------------------------------ //

    const handleEntrega = (bool) => {
        if (bool) {
            console.log(`Aluno ${optimizedWaypoints[currentStudentIndex]?.name} Entregue!`);
            
            // Vai pulando de aluno em aluno enquanto houver alunos na lista de orderedWaypoints
            if (currentStudentIndex < optimizedWaypoints.length - 1) {
                setCurrentStudentIndex(currentStudentIndex + 1);
                setWaypointProximity(true);
                // Espaço para enviar pro backend \/
                //
                //
            } else {
                console.log('Toda a fila de alunos foi percorrida.');
                setWaypointProximity(false);
            }

        } else {
            if (currentStudentIndex < optimizedWaypoints.length - 1) {
                console.log('Criança não entregue!');
                setCurrentStudentIndex(currentStudentIndex + 1);
                setWaypointProximity(true);
                // Espaço para enviar pro backend \/
                //
                //
            }
            else {
                console.log('Toda a fila de alunos foi percorrida.');
                setWaypointProximity(false);
            }
        }
    };
    
    

    // ------------------------------------------------------------ //
    //             Envio da Localização (60 em 60 seg)
    // ------------------------------------------------------------ //
    const handlePostDriverLocation = async(body) => {
        const postLocation = await postDriverLocation(body)

        if(postLocation.status === 201){
            console.log('Sucesso ao enviar localização do motorista')
        }
        else{   
            console.log('Erro ao enviar localização do motorista')
        }
    }

    useEffect(() => {
        const isLocationAvailable = userLocation?.latitude && userLocation?.longitude
        
        if (isLocationAvailable && routeOnGoing && userData) {
            const body = {
                lat: userLocation.latitude,
                lng: userLocation.longitude,
                user_id: userData.id
            }
            // console.log('body: ',body)
            handlePostDriverLocation(body);
        }
    },[clock])

    useEffect(() => {
        let isMounted = true;

        const intervalFunc = () => {
            if (isMounted) {
                setClock(prevClock => !prevClock);
                setTimeout(intervalFunc, 60000); // Repetir a cada 10 segundos

            }
        };

        intervalFunc(); // Inicializar a primeira execução

        return () => {
            isMounted = false;
        };
    }, []);


    // ------------------------------------------------------------ //
    //        Envio da Rota pro Backend (Sempre que att a rota)
    // ------------------------------------------------------------ //
    const handlePostRoute = async(body) => {
        if (encodedRoutePoints && routeOnGoing && userData) {
            const body = {
                route_points: encodedRoutePoints
            }
            const postRoute = await postRoutePoints(body)
    
            if(postRoute.status === 201){
                console.log('Sucesso ao enviar rota codificada')
            }
            else{   
                console.log('Erro ao enviar rota codificada')
            }
        }
    }

    // ------------------------------------------------------------ //
    //                    Abrir App google Maps
    // ------------------------------------------------------------ //
    const openGoogleMaps = () => {
        if (mapsUrl) {
          Linking.openURL(mapsUrl).catch(err => {
            Alert.alert('Erro', 'Não foi possível abrir o Google Maps.');
          });
        } else {
          Alert.alert('Aviso', 'Nenhuma rota gerada ainda.');
        }
    };

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

            {/* Botão Google Maps */}
            {routeOnGoing && (
                <View style={styles.googleMapsPos}>
                    <Pressable style={styles.googleMaps} title="Abrir no Google Maps" onPress={openGoogleMaps}>
                        <Image
                            source={require('../../assets/icons/googleMaps.png')}
                            style={{ width: 45, height: 45 }}
                        />
                    </Pressable>  
                </View>
            )}
            

            {/* ---------- CARD IDA VOLTA ---------- */}
            {startButton && region && (
                <View>
                {/* Exibe os botões "IDA ESCOLA" e "VOLTA ESCOLA" se os dropdowns ainda não estiverem visíveis */}
                {!showDropdowns && !showStudentList && (
                  <View style={styles.startButtonPos}>
                    <View style={styles.startButton}>
                      <Button
                        style={styles.startRouteButton}
                        onPress={() => {setShowDropdowns(true), setRouteType(1)}} // Rota de ida
                        title="IDA ESCOLA"
                      >
                        IDA ESCOLA
                      </Button>
                      <Button
                        style={styles.startRouteButton}
                        onPress={() => {setShowDropdowns(true), setRouteType(2)}} // Rota de volta
                        title="VOLTA ESCOLA"
                      >
                        VOLTA ESCOLA
                    </Button>
                    </View>
                  </View>
                )}
          
                {/* Exibe os dropdowns se um dos botões tiver sido clicado */}
                {showDropdowns && (
                  <View style={styles.startButtonPos}>
                    <View style={styles.startDropdown}>
                        <Text>Escolha o carro:</Text>
                        <Picker
                        selectedValue={selectedCar}
                        onValueChange={(itemValue) => setSelectedCar(itemValue)}
                        style={{width: 200}}
                        >
                        <Picker.Item label="Selecione um carro" value="" />
                        <Picker.Item label="Carro 1" value="carro1" />
                        <Picker.Item label="Carro 2" value="carro2" />
                        <Picker.Item label="Carro 3" value="carro3" />
                        </Picker>
            
                        <Text>Escolha a escola:</Text>
                        <Picker
                        selectedValue={selectedSchool}
                        onValueChange={(itemValue) => setSelectedSchool(itemValue)}
                        style={{width: 200}}
                        >
                        <Picker.Item label="Selecione uma escola" value="" />
                        <Picker.Item label="Escola A" value="escolaA" />
                        <Picker.Item label="Escola B" value="escolaB" />
                        <Picker.Item label="Escola C" value="escolaC" />
                        </Picker>
            
                        <Button title="Confirmar" onPress={() => {
                        if (selectedCar && selectedSchool) {
                            setShowDropdowns(false);
                            setShowStudentList(true);
                        } else {
                            alert("Por favor, selecione o carro e a escola.");
                        }
                        }}>
                            Confirmar
                        </Button>
                    </View>
                  </View>
                )}
          
                {/* Exibe a lista de alunos após a confirmação dos dropdowns */}
                {showStudentList && (
                <View style={styles.startButtonPos}>
                    <View style={styles.startDropdown}>
                        <FlatList
                            data={[
                            { id: '1', name: 'João da Silva', age: 10 },
                            { id: '2', name: 'Maria Oliveira', age: 9 },
                            { id: '3', name: 'Carlos Souza', age: 11 },
                            { id: '4', name: 'Ana Santos', age: 10 },
                            ]}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text style={styles.studentName}>{item.name}</Text>
                                <Text>Idade: {item.age}</Text>
                            </View>
                            )}
                        />
                        <Button
                            title="Confirmar"
                            onPress={startRoute}
                        >
                            Confirmar
                        </Button>
                    </View>
                </View>
                )}
              </View>          
            )}

            {!startButton && eta && totalDistance && (
                <View style={styles.footer}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardTitle}>Até próxima parada ({optimizedWaypoints[currentStudentIndex]?.name})</Text>
                        <View style={styles.infoCardContent}>
                            <View style={styles.infoCardLeft}>
                                <Text>ETA</Text>
                                <Text style={styles.infoCardText}>
                                    {eta ? eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} {/* Verifica se eta não é null */}
                                </Text>
                            </View>
                            <View style={styles.infoCardRight}>
                                <Text>Distância</Text>
                                <Text style={styles.infoCardText}>{formatDistance(nextWaypointDistance)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
            }
            
            {/* ---------- CARD ALUNO ENTREGUE ---------- */}
            {waypointProximity && currentStudentIndex < optimizedWaypoints.length && (
                <View style={styles.deliveredCardPosition}> 
                    <View style={styles.deliveredCardContent}>
                        <Text style={styles.deliveredCardText}>
                            O ALUNO {optimizedWaypoints[currentStudentIndex]?.name?.toUpperCase() || 'NOME DESCONHECIDO'} FOI ENTREGUE?
                        </Text>
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