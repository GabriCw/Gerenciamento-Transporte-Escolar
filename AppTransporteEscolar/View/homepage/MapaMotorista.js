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
import { Button, Checkbox } from 'react-native-paper';
import { formatTime, formatDistance } from '../../utils/formatUtils';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { postDriverLocation, postRoutePoints, getDriverScheduleDetails, createSchedule, startSchedule, updateSchedulePoint, endSchedule } from '../../data/locationServices';
import { getUserDetails } from '../../data/userServices';
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
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0); // ìndice do aluno atual (na lista de orderedWaypoints)
    const [currentLeg, setCurrentLeg] = useState(0);
    const [eta, setEta] = useState(null);
    const [etas, setEtas] = useState([]); // Stores ETAs for all legs
    const [showDropdowns, setShowDropdowns] = useState(false);
    const [selectedCar, setSelectedCar] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');
    const [routeType, setRouteType] = useState('');
    const [showStudentList, setShowStudentList] = useState(false);
    const [apiCalls, setApiCalls] = useState(0)
    const [routeLegs, setRouteLegs] = useState([]);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [scheduleId, setScheduleId] = useState(null);
    const [vehicleId, setVehicleId] = useState(null);
    const [schoolId, setSchoolId] = useState(null);
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [allVehicles, setAllVehicles] = useState([]);
    const [allSchools, setAllSchools] = useState([]);
    const [orderedPointIds, setOrderedPointIds] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showEndRouteButton, setShowEndRouteButton] = useState(false); // Controls visibility of "End Route" button
    const [originPoint, setOriginPoint] = useState(null);
    const [destinationPoint, setDestinationPoint] = useState(null);
    const [nextStopName, setNextStopName] = useState('');
    const [driverPoints, setDriverPoints] = useState([]);
    const [destinationOptions, setDestinationOptions] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null); //inicializa com -1 para representar a ida (qua não tem destino setado)
    const [selectedDestinationPoint, setSelectedDestinationPoint] = useState(null);
    const [showDestinationSelection, setShowDestinationSelection] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const response = await getUserDetails(userData.id);
            if (response.status === 200) {
                const userDetails = response.data;
                if (userDetails.points && userDetails.points.length > 0) {
                    setDriverPoints(userDetails.points);
                }
            } else {
                console.error('Erro ao obter detalhes do usuário:', response.data);
            }
        };
    
        fetchUserDetails();
    }, []);

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
                            // console.log('lat, long',latitude,longitude, speed)
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

    // Updated calculateRoute function
    const calculateRoute = async (stateWaypoints, currentLocation, routeType) => {
        // Map waypoints with their data
        const waypoints = stateWaypoints.map((wp) => {
            const studentNames = wp.student.map(student => student.name).join(', ');
            return {
                name: studentNames,
                latitude: wp.point.lat,
                longitude: wp.point.lng,
                point_id: wp.point.id,
            };
        });

        let origin, destination;
        let waypointsString = waypoints.map(point => `${point.latitude},${point.longitude}`).join('|');

        if (routeType === 1) {
            // Origin is driver's current location, destination is the school
            origin = `${currentLocation.latitude},${currentLocation.longitude}`;
            destination = `${schoolInfo.lat},${schoolInfo.lng}`;

            // Handle cases with no waypoints or a single waypoint
            if (waypoints.length === 0) {
                // No students, route directly to the school
                waypointsString = '';
            } else if (waypoints.length === 1) {
                // Only one student, waypointsString is that student's location
                waypointsString = `${waypoints[0].latitude},${waypoints[0].longitude}`;
            }
        } else if (routeType === 2) {
            // Origin is the school, destination is the last student's location
            origin = `${schoolInfo.lat},${schoolInfo.lng}`;

            if (!selectedDestinationPoint) {
                Alert.alert('Erro', 'Destino não selecionado.');
                setLoadingRoute(false);
                return;
            }
            destination = `${selectedDestinationPoint.latitude},${selectedDestinationPoint.longitude}`;        

            // Filter waypoints for selected students
            const selectedWaypoints = waypoints.filter(wp => selectedStudents.includes(wp.point_id));

            if (selectedWaypoints.length === 0) {
                Alert.alert('Aviso', 'Nenhum aluno selecionado para a rota de volta.');
                setLoadingRoute(false);
                return;
            } else if (selectedWaypoints.length === 1) {
                waypointsString = '';
                destination = `${selectedWaypoints[0].latitude},${selectedWaypoints[0].longitude}`;
            } else {
                waypointsString = selectedWaypoints.map(point => `${point.latitude},${point.longitude}`).join('|');
                destination = ''; // Destination will be handled by the API
            }

            // Update waypoints variable to use selected waypoints
            waypoints.splice(0, waypoints.length, ...selectedWaypoints);
        }

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination || origin}&waypoints=optimize:true|${waypointsString}&key=${apiKey}&overview=full`;

        try {
            setLoadingRoute(true);
            const response = await axios.get(url);
            console.log('Response:', response.data);

            if (response.data.routes && response.data.routes.length) {
                const route = response.data.routes[0];

                // Check if route.legs is populated
                if (!route.legs || route.legs.length === 0) {
                    console.log('No legs found in the route.');
                    Alert.alert('Erro', 'Não foi possível calcular a rota.');
                    return;
                }

                const decodedPolyline = polyline.decode(route.overview_polyline.points).map(point => ({
                    latitude: point[0],
                    longitude: point[1],
                }));

                setEncodedRoutePoints(route.overview_polyline.points);
                setRoutePoints(decodedPolyline);
                setRouteLegs(route.legs);

                // console.log('Route Legs:', routeLegs);
                // console.log('Number of Legs:', routeLegs.length);

                // console.log('Route:');
                // console.log(route);
                const optimizedOrder = route.waypoint_order || [];
                setWaypointOrder(optimizedOrder);

                let orderedWaypoints = [];
                let orderedPointIdsList = [];

                if (routeType === 1) {
                    if (waypoints.length > 1) {
                        // Para routeType 1 (Ida)
                        orderedWaypoints = [
                            ...optimizedOrder.map(i => waypoints[i]),
                            { name: schoolInfo.name, latitude: schoolInfo.lat, longitude: schoolInfo.lng, isDestination: true }
                        ];
                        orderedPointIdsList = optimizedOrder.map(i => waypoints[i].point_id)
                    } else {
                        orderedWaypoints = [
                            ...waypoints,
                            { name: schoolInfo.name, latitude: schoolInfo.lat, longitude: schoolInfo.lng, isDestination: true }
                        ];
                        orderedPointIdsList = waypoints.map(wp => wp.point_id)
                    }
                        
                    console.log('TIPO 1 ORDERED WAYPOINTS ---->')
                    console.log(orderedWaypoints);

                } else if (routeType === 2) {
                    if (waypoints.length > 1) {
                        orderedWaypoints = [
                            ...optimizedOrder.map(i => waypoints[i]),
                            {
                                name: selectedDestinationPoint.name,
                                latitude: selectedDestinationPoint.latitude,
                                longitude: selectedDestinationPoint.longitude,
                                isDestination: true,
                                point_id: selectedDestination
                            },
                        ];
                        console.log('TIPO 2 ORDERED WAYPOINTS ---->')
                        console.log(orderedWaypoints);
                        orderedPointIdsList = orderedWaypoints.map(wp => wp.point_id);
                    } else {
                        orderedWaypoints = [
                            ...waypoints,
                            {
                                name: selectedDestinationPoint.name,
                                latitude: selectedDestinationPoint.latitude,
                                longitude: selectedDestinationPoint.longitude,
                                isDestination: true,
                                point_id: selectedDestination
                            },
                        ];
                        orderedPointIdsList = waypoints.map(wp => wp.point_id);
                    }
                }

                setOptimizedWaypoints(orderedWaypoints);
                setOrderedPointIds(orderedPointIdsList);

                // Chamar updateNextWaypointDetails para o primeiro aluno
                updateNextWaypointDetails(currentStudentIndex, route.legs, orderedWaypoints);

                // Generate ETAs for all legs
                const allEtas = [];
                let cumulativeDuration = 0;
                for (let leg of route.legs) {
                    cumulativeDuration += leg.duration.value; // Duration in seconds
                    const eta = new Date(Date.now() + cumulativeDuration * 1000);
                    allEtas.push(eta.toISOString());
                }
                setEtas(allEtas); // Store ETAs in state

                // Calculate total duration and distance
                setTotalDuration(route.legs.reduce((acc, leg) => acc + leg.duration.value, 0));
                setTotalDistance(route.legs.reduce((acc, leg) => acc + leg.distance.value, 0));

                // Set next waypoint details
                if (route.legs.length >= 0) {
                    updateNextWaypointDetails(currentStudentIndex, route.legs, orderedWaypoints);                        
                }

                // Generate Google Maps URL
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination || origin}&waypoints=${waypointsString.replace(/\|/g, '%7C')}`;
                setMapsUrl(mapsUrl);

                return orderedPointIdsList;

            } else {
                console.log('Nenhuma rota encontrada.');
                Alert.alert('Erro', 'Não foi possível calcular a rota.');
            }

        } catch (error) {
            console.error(`Erro ao buscar direções: ${error.message || error}`);
            Alert.alert('Erro', 'Não foi possível calcular a rota.');
        } finally {
            setLoadingRoute(false);
        }
    };
   
    // Controlar a quantidade de chamadas API com 'throttle'    
    const throttledCalculateRoute = throttle(calculateRoute, 30000);


    const updateNextWaypointDetails = (nextIndex, legs, waypoints) => {
        const currentRouteLegs = legs || routeLegs;
        const currentOptimizedWaypoints = waypoints || optimizedWaypoints;
    
        // console.log('updateNextWaypointDetails called with nextIndex:', nextIndex);
        // console.log('Route Legs:', currentRouteLegs);
        // console.log('Number of Legs:', currentRouteLegs.length);
    
        if (!currentRouteLegs || currentRouteLegs.length === 0) {
            console.log('No route legs available.');
            setNextWaypointDistance(null);
            setNextWaypointDuration(null);
            setEta(null);
            return;
        }
    
        let nextLeg;
        let nextStopName;
    
        if (nextIndex === 'destination') {
            nextLeg = currentRouteLegs[currentRouteLegs.length - 1];
            nextStopName = destinationPoint.name;
        } else if (nextIndex < currentRouteLegs.length) {
            nextLeg = currentRouteLegs[nextIndex];
            nextStopName = currentOptimizedWaypoints[nextIndex]?.name;
        } else {
            console.log('nextIndex está fora dos limites:', nextIndex);
            setNextWaypointDistance(null);
            setNextWaypointDuration(null);
            setEta(null);
            return;
        }
    
        if (!nextLeg) {
            console.log('No next leg found for index:', nextIndex);
            setNextWaypointDistance(null);
            setNextWaypointDuration(null);
            setEta(null);
            return;
        }
    
        setNextWaypointDistance(nextLeg.distance.value);
        setNextWaypointDuration(nextLeg.duration.value);
    
        // Update ETA
        const cumulativeDuration = currentRouteLegs
            .slice(0, nextIndex + 1)
            .reduce((acc, leg) => acc + leg.duration.value, 0);
        const eta_inside = new Date(Date.now() + cumulativeDuration * 1000);
        setEta(eta_inside);
        setNextStopName(nextStopName); // Update next stop name
    
        console.log('Current Student NextWaypointsDetails:')
        console.log(nextWaypointDistance, '------', nextLeg.distance.value)
        console.log('Current Student ETA:')
        console.log(eta,'------',eta_inside)
    };

    // Updated student selection for return route
    const startRoute = async () => {
        if (routeType === 1 || (routeType === 2 && selectedStudents.length > 0 && selectedDestinationPoint)) {
            setShowDropdowns(false);
    
            let waypointsToUse = waypoints;
            if (routeType === 2) {
                // Filtrar waypoints com base nos alunos selecionados
                waypointsToUse = waypoints.filter(wp => {
                    return wp.student.some(student => selectedStudents.includes(student.point_id));
                });
            }
            
            console.log('waypointsToUse:');
            console.log(waypointsToUse);

            setCurrentStudentIndex(0);
            const list = await throttledCalculateRoute(waypointsToUse, userLocation, routeType);
            await handleStartSchedule(list);
            setRouteOngoing(true);
            setStartButton(false);
            console.log(`Rota iniciada! Na escola ${selectedSchool} com o veículo ${selectedCar}`);
        } else {
            Alert.alert('Aviso', 'Por favor, selecione pelo menos um aluno para a rota de volta.');
        }
    };
    
    const endRoute = (schedule) => {
        if (schedule === 1 || schedule === 2) {
            handleEndSchedule();
            setRouteOngoing(false);
            setShowStudentList(false);
            setStartButton(true);
            setRoutePoints([]);
            setOptimizedWaypoints([]);
            setRouteLegs([]);
            setEta(null);
            setNextWaypointDistance(null);
            setNextWaypointDuration(null);
            setCurrentStudentIndex(0);
            setShowEndRouteButton(false);
            setWaypointProximity(false);
            setSelectedStudents([]);
            setEncodedRoutePoints([]);
            setMapsUrl('');
            setTotalDuration(null);
            setTotalDistance(null);
        } else {
            console.log('Erro no tipo da schedule.');
        }
    };

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

    const handleCreateSchedule = async () => {
        const body = {
            user_id: userData.id,
            vehicle_id: vehicleId,
            school_id: schoolId,
            schedule_type: routeType
        };
    
        const response = await createSchedule(body);

        console.log('Response Create Schedule:', response.data);
    
        if (response.status === 201) {
            console.log('Schedule criado com sucesso');
            const data = response.data;
            setScheduleId(data.schedule_id);
            setSchoolInfo(data.school);
            setWaypoints(data.points);
            console.log('Waypoints:', data.points);
            console.log('School:', data.school);
            
            setShowDropdowns(false);

            if (routeType === 2) {
                setShowDestinationSelection(true); // Show destination selection for return trip
            } else {
                setShowStudentList(true); // For routeType === 1 (Ida), show student list
            }
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

    // useEffect(() => {
    //     console.log(orderedPointIds);
    // }, [orderedPointIds]);

    const handleStartSchedule = async (list) => {
        const endDate = new Date(Date.now() + totalDuration * 1000);
        const formattedEndDate = endDate.toISOString(); // Retorna no formato 'YYYY-MM-DDTHH:mm:ss.sssZ'
        const formattedEndDateWithoutMilliseconds = formattedEndDate.split('.')[0];

        console.log('List:');
        console.log(list);

        const body = {
            user_id: userData.id,
            schedule_id: scheduleId,
            school_id: schoolId,
            end_date: formattedEndDateWithoutMilliseconds,
            points: list,
            encoded_points: encodedRoutePoints.toString(),
            legs_info: JSON.stringify(routeLegs),
            eta: etas.toString(),
            destiny_id: selectedDestination
        };
        console.log('Body:', body);

        const response = await startSchedule(body);
    
        if (response.status === 200) {
            console.log('Schedule iniciado com sucesso');
        } else {
            console.error('Erro ao iniciar o schedule:', response.data);
        }
    };

    const handleStudentDelivered = async (schedulePointId, embarkedInfo) => {
        const body = {
            schedule_id: scheduleId,
            point_id: schedulePointId,
            has_embarked: embarkedInfo,
            user_id: userData.id
        };

        console.log('Body:', body);
    
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

    const handleStudentSelect = (studentId) => {
        setSelectedStudents((prevSelected) => {
            if (prevSelected.includes(studentId)) {
                // Se o aluno já está selecionado, remove-o
                return prevSelected.filter((id) => id !== studentId);
            } else {
                // Se o aluno não está selecionado, adiciona-o
                return [...prevSelected, studentId];
            }
        });
    };

    // ------------------------------------------------------------ //
    //                Gerencia a Entrega dos Alunos
    // ------------------------------------------------------------ //


    const handleEntrega = async (bool) => {
        if (optimizedWaypoints[currentStudentIndex]?.point_id) {
            await handleStudentDelivered(optimizedWaypoints[currentStudentIndex]?.point_id, bool);
        }
    
        if (currentStudentIndex < optimizedWaypoints.length - 1) {
            setCurrentStudentIndex((prevIndex) => {
                const newIndex = prevIndex + 1;
                setWaypointProximity(true);
    
                // Atualiza os detalhes do próximo waypoint
                updateNextWaypointDetails(newIndex);
    
                return newIndex;
            });
        } else {
            console.log('Toda a fila de alunos foi percorrida.');
            setWaypointProximity(false);
            setShowEndRouteButton(true); // Exibe o botão para encerrar a rota
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
    //                  Opções destino viagem volta
    // ------------------------------------------------------------ //
    useEffect(() => {
    const options = [];

    if (schoolInfo) {
        options.push({
            id: 'school',
            name: 'Escola',
            description: schoolInfo.name,
            latitude: schoolInfo.lat,
            longitude: schoolInfo.lng,
        });
    }

    if (driverPoints && driverPoints.length > 0) {
        driverPoints.forEach(point => {
            // Check if the point is the same as the school only if schoolInfo is available
            const isSameAsSchool = schoolInfo && point.lat === schoolInfo.lat && point.lng === schoolInfo.lng;

            if (!isSameAsSchool) {
                options.push({
                    id: point.id,
                    name: point.name,
                    description: point.description,
                    latitude: point.lat,
                    longitude: point.lng,
                });
            }
        });
    }

    setDestinationOptions(options);
}, [driverPoints, schoolInfo]);


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
                    {/* Show "IDA ESCOLA" and "VOLTA ESCOLA" buttons if no other selection is active */}
                    {!showDropdowns && !showStudentList && !showDestinationSelection && (
                        <View style={styles.startButtonPos}>
                            <View style={styles.startContent}>
                                <Button
                                    style={styles.startRouteButton}
                                    onPress={() => {
                                        setRouteType(1);
                                        handleUserVehiclesAndSchool();
                                    }} // Rota de ida
                                    title="IDA ESCOLA"
                                >
                                    IDA ESCOLA
                                </Button>
                                <Button
                                    style={styles.startRouteButton}
                                    onPress={() => {
                                        setRouteType(2);
                                        handleUserVehiclesAndSchool();
                                    }} // Rota de volta
                                    title="VOLTA ESCOLA"
                                >
                                    VOLTA ESCOLA
                                </Button>
                            </View>
                        </View>
                    )}

                    {/* Show car and school selection */}
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

                    {/* Show destination selection for return trip */}
                    {showDestinationSelection && (
                        <View style={styles.startButtonPos}>
                            <View style={styles.startDropdown}>
                                <Text>Escolha o destino:</Text>
                                {destinationOptions.length > 0 ? (
                                    <FlatList
                                        data={destinationOptions}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <View style={styles.card}>
                                                <Text style={styles.title}>{item.name}</Text>
                                                {item.description && item.description.trim() !== '' && (
                                                    <Text style={styles.description}>{item.description}</Text>
                                                )}
                                                <Button
                                                    mode="contained"
                                                    onPress={() => {
                                                        setSelectedDestination(item.id);
                                                        setSelectedDestinationPoint(item);
                                                        setShowDestinationSelection(false);
                                                        setShowStudentList(true);
                                                    }}
                                                >
                                                    Selecionar
                                                </Button>
                                            </View>
                                        )}
                                    />
                                ) : (
                                    <Text>Nenhum destino disponível.</Text>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Show student list after selecting destination for return trip */}
                    {showStudentList && routeType === 2 && (
                        <View style={styles.startButtonPos}>
                            <View style={styles.startDropdown}>
                                <FlatList
                                    data={waypoints.reduce((acc, point) => acc.concat(point.student), [])}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.card}>
                                            <Text style={styles.studentName}>{item.name}</Text>
                                            <Text>Idade: {item.year}</Text>

                                            {/* Checkbox to select/deselect the student */}
                                            <Checkbox
                                                status={selectedStudents.includes(item.point_id) ? 'checked' : 'unchecked'}
                                                onPress={() => handleStudentSelect(item.point_id)}
                                            />
                                        </View>
                                    )}
                                />
                                <Button
                                    mode="contained"
                                    onPress={() => {
                                        if (selectedStudents.length > 0) {
                                            startRoute();
                                        } else {
                                            Alert.alert('Aviso', 'Por favor, selecione pelo menos um aluno.');
                                        }
                                    }}
                                >
                                    Confirmar
                                </Button>
                            </View>
                        </View>
                    )}

                    {/* For routeType === 1 (Ida), show student list directly */}
                    {showStudentList && routeType === 1 && (
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

            {!startButton && eta && nextWaypointDistance !== null && (
                <View style={styles.footer}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardTitle}>Próxima parada: {nextStopName}</Text>
                        <View style={styles.infoCardContent}>
                            <View style={styles.infoCardLeft}>
                                <Text>ETA</Text>
                                <Text style={styles.infoCardText}>
                                    {eta ? eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </Text>
                            </View>
                            <View style={styles.infoCardRight}>
                                <Text>Distância</Text>
                                <Text style={styles.infoCardText}>{nextWaypointDistance? formatDistance(nextWaypointDistance) : ''}</Text>
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
                            {optimizedWaypoints[currentStudentIndex]?.isDestination
                                ? routeType === 1
                                    ? `Chegou ao destino ${optimizedWaypoints[currentStudentIndex]?.name}?`
                                    : `O aluno ${optimizedWaypoints[currentStudentIndex]?.name?.toUpperCase()} foi entregue?`
                                : routeType === 1
                                    ? `O aluno ${optimizedWaypoints[currentStudentIndex]?.name?.toUpperCase()} foi recebido?`
                                    : `O aluno ${optimizedWaypoints[currentStudentIndex]?.name?.toUpperCase()} foi entregue?`
                            }
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

            {showEndRouteButton && (
                <View style={styles.endRouteButtonContainer}>
                    <Button
                        mode="contained"
                        onPress={() => endRoute(routeType)}
                    >
                        Encerrar Rota
                    </Button>
                </View>
            )}

            
        </View>
    );
}

export default MapaMotorista;