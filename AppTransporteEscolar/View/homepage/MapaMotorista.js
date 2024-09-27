import React, { useState, useEffect, useRef, useContext } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { View, Image, Text, Alert, Linking, Pressable, FlatList, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
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
import { postDriverLocation, postRoutePoints, getDriverScheduleDetails, createSchedule, startSchedule, updateSchedulePoint, endSchedule } from '../../data/locationServices';
import { getVehicleByUser } from '../../data/vehicleServices';
import { getSchoolByDriver } from '../../data/pointServices';
import { AuthContext } from '../../providers/AuthProvider';
import { throttle } from 'lodash';



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
    const apiKey = GOOGLE_MAPS_API_KEY;
    const inactivityTimeout = useRef(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [totalDuration, setTotalDuration] = useState(null);
    const [totalDistance, setTotalDistance] = useState(null);
    const [nextWaypointDistance, setNextWaypointDistance] = useState(null);
    const [nextWaypointDuration, setNextWaypointDuration] = useState(null);
    const recalculateThreshold = 100; // Distância em metros para recalcular a rota
    const [waypointProximity, setWaypointProximity] = useState(true)
    const [startButton, setStartButton] = useState(true);
    const [routeOnGoing, setRouteOngoing] = useState(false);
    const [waypointOrder, setWaypointOrder] = useState([]);
    const {userData} = useContext(AuthContext);
    const [clock, setClock] = useState(true);
    const [mapsUrl, setMapsUrl] = useState('');
    const [currentStudentIndex, setCurrentStudentIndex] = useState(1); // ìndice do aluno atual (na lista de orderedWaypoints)
    const [eta, setEta] = useState(null);
    const [showDropdowns, setShowDropdowns] = useState(false);
    const [selectedCar, setSelectedCar] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');
    const [routeType, setRouteType] = useState('');
    const [showStudentList, setShowStudentList] = useState(false);
    const [apiCalls, setApiCalls] = useState(0)
    const [currentLeg, setCurrentLeg] = useState(1)
    const [routeLegs, setRouteLegs] = useState([]);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [scheduleId, setScheduleId] = useState(null);
    const [vehicleId, setVehicleId] = useState(null);
    const [schoolId, setSchoolId] = useState(null);
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [allVehicles, setAllVehicles] = useState([]);
    const [allSchools, setAllSchools] = useState([]);
    const [orderedPointIds, setOrderedPointIds] = useState([]);
    
    useEffect(() => {
        const initializeLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Permissão Negada',
                        'Precisamos da sua localização para fornecer o serviço. Por favor, habilite nas configurações.',
                        [
                            { text: 'Cancelar', style: 'cancel' },
                            { 
                                text: 'Abrir Configurações', 
                                onPress: () => Linking.openSettings()
                            },
                        ]
                    );
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


    const routePointsRef = useRef(routePoints);
    useEffect(() => {
        routePointsRef.current = routePoints;
    }, [routePoints]);


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
                    
                    console.log('Tamanho de routePoints antes da checagem:', routePointsRef.current.length);

                    if (speed >= 0){  // Só atualiza os dados caso a velocidade seja maior que 0.5 m/s
                        setUserLocation({ latitude, longitude });
                        // console.log('User Location: ', userLocation)
                        setRegion({
                            latitude,
                            longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        });
                        setHeading(heading || 0);
                        
                        if ( routePointsRef.current.length > 0 && {latitude, longitude}) {
                            console.log('lat, long',latitude,longitude, speed)
                            const distanceToRoute = calculateDistanceToRoute(latitude, longitude);
                            console.log('Distância para a rota:', distanceToRoute);
                            if (distanceToRoute > recalculateThreshold) {
                                throttledCalculateRoute(waypoints,{latitude, longitude});

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
        // Mapeia os waypoints com seus dados
        const waypoints = stateWaypoints.map((wp) => {
            const studentNames = wp.student.map(student => student.name).join(', ');
            console.log('waipoints', wp);
            return {
                name: studentNames,
                latitude: wp.point.lat,
                longitude: wp.point.lng,
                point_id: wp.point.id,  // Inclui o point_id
            };
        });
    
        const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
        const destination = `${schoolInfo.lat},${schoolInfo.lng}`;
    
        // Cria a string de waypoints (sem origem e destino) para a API do Google
        const waypointsString = waypoints
            .map(point => `${point.latitude},${point.longitude}`)
            .join('|');
    
        console.log('waypointsString', waypointsString);
    
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypointsString}&key=${apiKey}&overview=full`;
    
        try {
            setLoadingRoute(true);
            const response = await axios.get(url);
            console.log('Chamou a API -----------------------------------------------------------------');
    
            if (response.data.routes && response.data.routes.length) {
                const route = response.data.routes[0];
                console.log('antes de fazer decoded');
                
                const decodedPolyline = polyline.decode(route.overview_polyline.points).map(point => ({
                    latitude: point[0],
                    longitude: point[1],
                }));
                setEncodedRoutePoints(route.overview_polyline.points);
                console.log('decodedPolyline length:', decodedPolyline.length);
                setRoutePoints(decodedPolyline);
                setRouteLegs(route.legs);
    
                const optimizedOrder = route.waypoint_order; // Ordem otimizada dos waypoints retornada pela API
                setWaypointOrder(optimizedOrder);
    
                // Reorganiza os waypoints otimizados, mantendo origem e destino fixos
                const orderedWaypoints = [
                    { name: 'Origem', latitude: currentLocation.latitude, longitude: currentLocation.longitude },  // Origem
                    ...optimizedOrder.map(i => waypoints[i]), // Otimizados
                    { name: 'Destino', latitude: schoolInfo.lat, longitude: schoolInfo.lng }  // Destino
                ];
    
                // Extrai a lista de point_ids na ordem otimizada
                const orderedPointIdsList = [
                    waypoints[0].point_id,  // point_id da Origem
                    ...optimizedOrder.map(i => waypoints[i].point_id),  // point_ids otimizados
                    waypoints[waypoints.length - 1].point_id  // point_id do Destino
                ];
    
                setOptimizedWaypoints(orderedWaypoints);
                setOrderedPointIds(orderedPointIdsList);  // Atualiza o estado com a ordem dos point_id
                console.log('orderedWaypoints', orderedWaypoints);
                console.log('Ordered Point IDs:', orderedPointIdsList);
    
                setTotalDuration(route.legs.reduce((acc, leg) => acc + leg.duration.value, 0)); // duração em segundos
                setTotalDistance(route.legs.reduce((acc, leg) => acc + leg.distance.value, 0)); // distância em metros
    
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
                setMapsUrl(mapsUrll);
    
                // Define o ETA e a distância para o primeiro waypoint
                updateNextWaypointDetails(currentStudentIndex);
    
            } else {
                console.log('No routes found');
            }
        } catch (error) {
            console.log(`Error fetching directions: ${error.message || error}`);
        } finally {
            setLoadingRoute(false);
        }
    };

    // Controlar a quantidade de chamadas API com 'throttle'
    const throttledCalculateRoute = throttle(calculateRoute, 30000);


    const updateNextWaypointDetails = (nextIndex) => {
        if (nextIndex < routeLegs.length) {
            const nextLeg = routeLegs[nextIndex];
            setNextWaypointDistance(nextLeg.distance.value); // Distância em metros
            setNextWaypointDuration(nextLeg.duration.value); // Duração em segundos
    
            // Atualiza o ETA com base no tempo atual e na duração do próximo leg
            const eta = new Date(Date.now() + nextLeg.duration.value * 1000); // Converte segundos para milissegundos
            setEta(eta);
        }
    };

    const startRoute = () => {
        if (routeType === 1){
            setShowDropdowns(false);
            // Chamada API ida (recebe do backend a lista de alunos de ida (waypoints))
            throttledCalculateRoute(waypoints, userLocation); // os waypoints vem da API (backend)
            handleStartSchedule();
            setRouteOngoing(true);
            setStartButton(false);
            console.log(`Rota de ida iniciada! Na ${selectedSchool} com o ${selectedCar}`)
        }
        else if (routeType === 2){
            setShowDropdowns(false);
            // Chamada API volta (recebe do backend a lista de alunos de volta (waypoints))
            throttledCalculateRoute(waypoints, userLocation); // os waypoints vem da API (backend)
            handleStartSchedule();
            setRouteOngoing(true);
            setStartButton(false);
            console.log(`Rota de volta iniciada! Na ${selectedSchool} com o ${selectedCar}`)
        }
        else {
            console.log('Erro no tipo da schedule.')
        }
    }

    const endRoute = (schedule) => {
        if (schedule === 0){
            handleEndSchedule()
            setRouteOngoing(false);
            setStartButton(true);
        }
        else if (schedule === 1){
            // Enviar info de fim de viagem pra API
            handleEndSchedule()
            setRouteOngoing(false);
            setStartButton(true)
        }
        else {
            console.log('Erro no tipo da schedule.')
        }       
    }

    const calculateDistanceToRoute = (latitude, longitude) => {

        if (!latitude || !longitude) {
            console.log('Erro: Coordenadas inválidas para a localização atual.');
            return 0;
        }
        if (!routePointsRef.current || routePointsRef.current.length === 0) {
            console.log('Erro: Nenhum ponto de rota disponível.');
            return 0;
        }
    
        const currentLocation = { latitude, longitude };
    
        const validRoutePoints = routePointsRef.current.filter(
            point =>
                point &&
                typeof point.latitude === 'number' &&
                typeof point.longitude === 'number' &&
                !isNaN(point.latitude) &&
                !isNaN(point.longitude)
        );
        // console.log('validRoutePoints', validRoutePoints)
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

    const handleCreateSchedule = async () => {
        const body = {
            user_id: userData.id,
            vehicle_id: vehicleId,
            school_id: schoolId,
            schedule_type: routeType
        };
    
        const response = await createSchedule(body);
    
        if (response.status === 201) {
            console.log('Schedule criado com sucesso');
            const data = response.data;
            setScheduleId(data.schedule_id);
            setSchoolInfo(data.school);
            setWaypoints(data.points);
            console.log('Waypoints:', data.points);
            console.log('School:', data.school);
            setShowStudentList(true);
            setShowDropdowns(false);
        } else {
            console.error('Erro ao criar o schedule:', response.data);
        }
    };

    const fetchScheduleDetails = async () => {
        const response = await getDriverScheduleDetails(scheduleId);
    
        if (response.status === 200) {
            console.log('Detalhes do schedule obtidos com sucesso');
            const data = response.data;
            setWaypoints(data.waypoints); // Supondo que 'waypoints' seja o campo com os alunos
            // Outros detalhes podem ser salvos conforme necessário
        } else {
            console.error('Erro ao obter detalhes do schedule:', response.data);
        }
    };

    const handleStartSchedule = async () => {
        const body = {
            user_id: userData.id,
            schedule_id: scheduleId,
            school_id: schoolId,
            end_date: Date.now(),
            points: orderedPointIds,
            encoded_points: encodedRoutePoints,
            legs_info: routeLegs,
            eta: eta,
        };
        
        const response = await startSchedule(body);
    
        if (response.status === 200) {
            console.log('Schedule iniciado com sucesso');
        } else {
            console.error('Erro ao iniciar o schedule:', response.data);
        }
    };

    const handleStudentDelivered = async (schedulePointId) => {
        const body = {
            schedule_point_id: schedulePointId,
            status: 'delivered'
        };
    
        const response = await updateSchedulePoint(body);
    
        if (response.status === 200) {
            console.log('Status do aluno atualizado com sucesso');
        } else {
            console.error('Erro ao atualizar status do aluno:', response.data);
        }
    };

    const handleEndSchedule = async () => {
        const body = {
            schedule_id: scheduleId,
            user_id: userData.id
        };
    
        const response = await endSchedule(body);
    
        if (response.status === 200) {
            console.log('Schedule encerrado com sucesso');
        } else {
            console.error('Erro ao encerrar o schedule:', response.data);
        }
    };

    const handleUserVehiclesAndSchool = async () => {
        const response = await getVehicleByUser(userData.id);

        if (response.status === 200) {
            console.log('Veículos obtidos com sucesso');
            setAllVehicles(response.data);
            console.log('Veículos:', response.data);
        } else {
            console.error('Erro ao obter veículos:', response.data);
        }

        const response2 = await getSchoolByDriver(userData.id);

        if (response2.status === 200) {
            console.log('Escolas obtidas com sucesso');
            setAllSchools(response2.data);
            setShowDropdowns(true);
            console.log('Escolas:', response2.data);
        } else {
            console.error('Erro ao obter escolas:', response2.data);
        }
    }

    // ------------------------------------------------------------ //
    //                Gerencia a Entrega dos Alunos
    // ------------------------------------------------------------ //

    // const handleEntrega = (bool) => {
    //     if (bool) {
    //         console.log(`Aluno ${optimizedWaypoints[currentStudentIndex]?.name} Entregue!`);
            
    //         // Vai pulando de aluno em aluno enquanto houver alunos na lista de orderedWaypoints
    //         if (currentStudentIndex < optimizedWaypoints.length - 1) {
    //             setCurrentStudentIndex(currentStudentIndex + 1);
    //             setWaypointProximity(true);
    //             // Espaço para enviar pro backend \/
    //             //
    //             //
    //         } else {
    //             console.log('Toda a fila de alunos foi percorrida.');
    //             setWaypointProximity(false);
    //         }

    //     } else {
    //         if (currentStudentIndex < optimizedWaypoints.length - 1) {
    //             console.log('Criança não entregue!');
    //             setCurrentStudentIndex(currentStudentIndex + 1);
    //             setWaypointProximity(true);
    //             // Espaço para enviar pro backend \/
    //             //
    //             //
    //         }
    //         else {
    //             console.log('Toda a fila de alunos foi percorrida.');
    //             setWaypointProximity(false);
    //         }
    //     }
    // };

    // Atualização na função handleEntrega
    const handleEntrega = (bool) => {
        if (bool) {
            console.log(`Aluno ${optimizedWaypoints[currentStudentIndex]?.name} Entregue!`);

            // Vai pulando de aluno em aluno enquanto houver alunos na lista de orderedWaypoints
            if (currentStudentIndex < optimizedWaypoints.length - 1) {
                setCurrentStudentIndex((prevIndex) => {
                    const newIndex = prevIndex + 1;
                    setWaypointProximity(true);

                    // Atualiza os detalhes do próximo waypoint usando as legs da rota
                    updateNextWaypointDetails(newIndex);

                    return newIndex;
                });
            } else {
                console.log('Toda a fila de alunos foi percorrida.');
                setWaypointProximity(false);
            }
        } else {
            if (currentStudentIndex < optimizedWaypoints.length - 1) {
                console.log('Criança não entregue!');
                setCurrentStudentIndex((prevIndex) => {
                    const newIndex = prevIndex + 1;
                    setWaypointProximity(true);

                    // Atualiza os detalhes do próximo waypoint usando as legs da rota
                    updateNextWaypointDetails(newIndex);

                    return newIndex;
                });
            } else {
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
                {loadingRoute && (
                    <View style={styles.loadingRouteStyle}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
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
                    <View style={styles.startContent}>
                      <Button
                        style={styles.startRouteButton}
                        onPress={() => {setRouteType(1), handleUserVehiclesAndSchool()}} // Rota de ida
                        title="IDA ESCOLA"
                      >
                        IDA ESCOLA
                      </Button>
                      <Button
                        style={styles.startRouteButton}
                        onPress={() => {setRouteType(2), handleUserVehiclesAndSchool()}} // Rota de volta
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
                        selectedValue={vehicleId}
                        onValueChange={(itemValue) => {setVehicleId(itemValue), setSelectedCar(itemValue)}}
                        style={{width: 200}}
                        >
                            <Picker.Item label="Selecione um carro" value="" />
                            {Array.isArray(allVehicles) && allVehicles.length > 0 ? (
                            allVehicles.map(vehicle => (
                                <Picker.Item
                                key={vehicle.id}
                                label={`${vehicle.model} - ${vehicle.plate}`}
                                value={vehicle.id}
                                />
                            ))
                            ): (
                            <Picker.Item label="Nenhum veículo disponível" value="" />
                            )}
                        </Picker>
            
                        <Text>Escolha a escola:</Text>
                        <Picker
                        selectedValue={schoolId}
                        onValueChange={(itemValue) => {setSchoolId(itemValue), setSelectedSchool(itemValue)}}
                        style={{width: 200}}
                        >
                        <Picker.Item label="Selecione uma escola" value="" />
                            {Array.isArray(allSchools) && allSchools.length > 0 ? (
                            allSchools.map(school => (
                                <Picker.Item
                                key={school.point.id}
                                label={`${school.point.name}`}
                                value={school.point.id}
                                />
                            ))
                            ) : (
                            <Picker.Item label="Nenhuma escola disponível" value="" />
                            )}
                        </Picker>
            
                        <Button title="Confirmar" onPress={() => {
                        if (selectedCar && selectedSchool) {
                            handleCreateSchedule();
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
                            data={waypoints.reduce((acc, point) => acc.concat(point.student), [])}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text style={styles.studentName}>{item.name}</Text>
                                <Text>Idade: {item.year}</Text>
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