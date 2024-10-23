import React, { useState, useEffect, useRef, useContext } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { View, Image, Text, Alert, Linking, Pressable, FlatList, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { getPinImage } from '../../utils/getPinImage';
import { getDistance } from 'geolib';
import { styles } from './Style/mapaMotoristaStyle';
import { Button, Checkbox } from 'react-native-paper';
import { formatDistance } from '../../utils/formatUtils';
import { postDriverLocation, postRoutePoints, getDriverScheduleDetails, createSchedule, startSchedule, updateSchedulePoint, endSchedule } from '../../data/locationServices';
import { getCurrentSchedules } from '../../data/scheduleServices';
import { getUserDetails } from '../../data/userServices';
import { getVehicleByUser } from '../../data/vehicleServices';
import { getSchoolByDriver } from '../../data/pointServices';
import { AuthContext } from '../../providers/AuthProvider';
import { throttle } from 'lodash';
// Importação do DropDownPicker
import DropDownPicker from 'react-native-dropdown-picker';
import { color } from 'react-native-elements/dist/helpers';

const MapaMotorista = ({ navigation }) => {
    const [waypoints, setWaypoints] = useState([]);
    const [region, setRegion] = useState(null);
    const [heading, setHeading] = useState(0);
    const [userLocation, setUserLocation] = useState(null);
    const [routePoints, setRoutePoints] = useState([]);
    const [encodedRoutePoints, setEncodedRoutePoints] = useState("");
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
    const [waypointProximity, setWaypointProximity] = useState(true);
    const [startButton, setStartButton] = useState(true);
    const [routeOnGoing, setRouteOngoing] = useState(false);
    const [waypointOrder, setWaypointOrder] = useState([]);
    const { userData } = useContext(AuthContext);
    const [clock, setClock] = useState(true);
    const [mapsUrl, setMapsUrl] = useState('');
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [currentLeg, setCurrentLeg] = useState(0);
    const [eta, setEta] = useState(null);
    const [etas, setEtas] = useState([]); // Armazena ETAs para todas as pernas
    const [showDropdowns, setShowDropdowns] = useState(false);
    const [selectedCar, setSelectedCar] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');
    const [routeType, setRouteType] = useState('');
    const [showStudentList, setShowStudentList] = useState(false);
    const [apiCalls, setApiCalls] = useState(0);
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
    const [showEndRouteButton, setShowEndRouteButton] = useState(false);
    const [originPoint, setOriginPoint] = useState(null);
    const [destinationPoint, setDestinationPoint] = useState(null);
    const [nextStopName, setNextStopName] = useState('');
    const [driverPoints, setDriverPoints] = useState([]);
    const [destinationOptions, setDestinationOptions] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [selectedDestinationPoint, setSelectedDestinationPoint] = useState(null);
    const [showDestinationSelection, setShowDestinationSelection] = useState(false);

    // Estados para o DropDownPicker de veículos
    const [vehicleOpen, setVehicleOpen] = useState(false);
    const [vehicleValue, setVehicleValue] = useState(null);
    const [vehicleItems, setVehicleItems] = useState([]);

    // Estados para o DropDownPicker de escolas
    const [schoolOpen, setSchoolOpen] = useState(false);
    const [schoolValue, setSchoolValue] = useState(null);
    const [schoolItems, setSchoolItems] = useState([]);

    // Estado para o DropDownPicker de destinos
    const [destinationOpen, setDestinationOpen] = useState(false);

    const [isLoadingVehiclesAndSchools, setIsLoadingVehiclesAndSchools] = useState(false);
    const [isLoadingCreateSchedule, setIsLoadingCreateSchedule] = useState(false);
    const [isLoadingStartRoute, setIsLoadingStartRoute] = useState(false);
    const [isLoadingEndRoute, setIsLoadingEndRoute] = useState(false);

    

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
        const checkForOngoingSchedule = async () => {
            const response = await handleGetCurrentSchedules();
    
            if (response && response.id) {
                console.log('Ongoing schedule found:', response);
                setScheduleId(response.id);
                setRouteType(response.schedule_type_id);
                setStartButton(false);
                setRouteOngoing(true);
    
                // Fetch detailed schedule information
                await fetchScheduleDetails(response.id);
            } else {
                console.log('No ongoing schedule found.');
                // Show start route buttons if there's no ongoing schedule
                setStartButton(true);
            }
        };
    
        checkForOngoingSchedule();
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
                        latitudeDelta: 0.005,
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
                    timeInterval: 1000,
                    distanceInterval: 1,
                },
                (location) => {
                    const { latitude, longitude, heading, speed } = location.coords;

                    if (speed >= 1) {
                        setUserLocation({ latitude, longitude });
                        setRegion({
                            latitude,
                            longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        });
                        setHeading(heading || 0);

                        if (routePointsRef.current.length > 0 && { latitude, longitude }) {
                            const distanceToRoute = calculateDistanceToRoute(latitude, longitude);
                            console.log('Distância para a rota:', distanceToRoute);
                            
                            if (distanceToRoute > recalculateThreshold) {
                                throttledCalculateRoute(waypoints, { latitude, longitude }, routeType);
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
    }, [routeType]);

    // Atualização da função calculateRoute
    const calculateRoute = async (stateWaypoints, currentLocation, routeType) => {
        // Mapear waypoints com seus dados
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
            // Origem é a localização atual do motorista, destino é a escola
            origin = `${currentLocation.latitude},${currentLocation.longitude}`;
            destination = `${schoolInfo.lat},${schoolInfo.lng}`;

            if (waypoints.length === 0) {
                waypointsString = '';
            } else if (waypoints.length === 1) {
                waypointsString = `${waypoints[0].latitude},${waypoints[0].longitude}`;
            }
        } else if (routeType === 2) {
            // Origem é a escola, destino é o último aluno
            origin = `${schoolInfo.lat},${schoolInfo.lng}`;

            if (!selectedDestinationPoint) {
                Alert.alert('Erro', 'Destino não selecionado.');
                setLoadingRoute(false);
                return;
            }
            destination = `${selectedDestinationPoint.latitude},${selectedDestinationPoint.longitude}`;

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
                destination = '';
            }

            waypoints.splice(0, waypoints.length, ...selectedWaypoints);
        }

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination || origin}&waypoints=optimize:true|${waypointsString}&key=${apiKey}&overview=full`;

        try {
            setLoadingRoute(true);
            const response = await axios.get(url);
            console.log('Response:', response.data);
            console.log('Waypoints para a rota:', waypoints);

            if (response.data.routes && response.data.routes.length) {
                const route = response.data.routes[0];

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

                const optimizedOrder = route.waypoint_order || [];
                setWaypointOrder(optimizedOrder);

                let orderedWaypoints = [];
                let orderedPointIdsList = [];

                if (routeType === 1) {
                    if (waypoints.length > 1) {
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

                updateNextWaypointDetails(currentStudentIndex, route.legs, orderedWaypoints);

                const allEtas = [];
                let cumulativeDuration = 0;
                for (let leg of route.legs) {
                    cumulativeDuration += leg.duration.value;
                    const eta = new Date(Date.now() + cumulativeDuration * 1000);
                    allEtas.push(eta.toISOString());
                }
                setEtas(allEtas);

                setTotalDuration(route.legs.reduce((acc, leg) => acc + leg.duration.value, 0));
                setTotalDistance(route.legs.reduce((acc, leg) => acc + leg.distance.value, 0));

                if (route.legs.length >= 0) {
                    updateNextWaypointDetails(currentStudentIndex, route.legs, orderedWaypoints);
                }

                const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination || origin}&waypoints=${waypointsString.replace(/\|/g, '%7C')}`;
                setMapsUrl(mapsUrl);

                return {
                    orderedPointIdsList,
                    allEtas,
                    overviewPolylinePoints: route.overview_polyline.points,
                    legs: route.legs,
                    orderedWaypoints // Adicionado
                };

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

    const throttledCalculateRoute = throttle(calculateRoute, 30000);

    const updateNextWaypointDetails = (nextIndex, legs, waypoints) => {
        const currentRouteLegs = legs || routeLegs;
        const currentOptimizedWaypoints = waypoints || optimizedWaypoints;

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

        const cumulativeDuration = currentRouteLegs
            .slice(0, nextIndex + 1)
            .reduce((acc, leg) => acc + leg.duration.value, 0);
        const eta_inside = new Date(Date.now() + cumulativeDuration * 1000);
        setEta(eta_inside);
        setNextStopName(nextStopName);
    };

    const startRoute = async () => {
        if (routeOnGoing) {
            Alert.alert('Aviso', 'Já existe uma rota em andamento.');
            return;
        }
        setIsLoadingStartRoute(true);
        try {
            if (routeType === 1 || (routeType === 2 && selectedStudents.length > 0 && selectedDestinationPoint)) {
                setShowDropdowns(false);

                let waypointsToUse = waypoints;
                if (routeType === 2) {
                    waypointsToUse = waypoints.filter(wp => {
                        return wp.student.some(student => selectedStudents.includes(student.point_id));
                    });
                }

                setCurrentStudentIndex(0);
                const { orderedPointIdsList, allEtas, overviewPolylinePoints, legs, orderedWaypoints } = await throttledCalculateRoute(waypointsToUse, userLocation, routeType);
                await handleStartSchedule(orderedPointIdsList, allEtas, overviewPolylinePoints, legs, orderedWaypoints);
                setRouteOngoing(true);
                setStartButton(false);
                console.log(`Rota iniciada! Na escola ${selectedSchool} com o veículo ${selectedCar}`);
            } else {
                Alert.alert('Aviso', 'Por favor, selecione pelo menos um aluno para a rota de volta.');
            }
        } catch (error) {
            console.error('Erro ao iniciar a rota:', error);
        } finally {
            setIsLoadingStartRoute(false);
        }
    };

    const endRoute = async (schedule) => {
        setIsLoadingEndRoute(true);
        if (schedule === 1 || schedule === 2) {
            await handleEndSchedule();
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
            setIsLoadingEndRoute(false);
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

        if (validRoutePoints.length === 0) {
            console.log('Erro: Nenhum ponto de rota válido encontrado.');
            return 0;
        }

        return Math.min(...validRoutePoints.map(point => getDistance(currentLocation, point)));
    };

    const recenterMap = () => {
        if (region) {
            setIsUserInteracting(false);
            try {
                mapRef.current.animateCamera({
                    center: {
                        latitude: region.latitude,
                        longitude: region.longitude,
                    },
                    pitch: 0,
                    heading: heading,
                    zoom: 18,
                    altitude: 0,
                }, { duration: 1000 });
            }
            catch {
                console.log('Erro de Animate Camera');
            }

        }
    };

    const handleUserInteraction = () => {
        setIsUserInteracting(true);
        if (inactivityTimeout.current) {
            clearTimeout(inactivityTimeout.current);
        }
        inactivityTimeout.current = setTimeout(recenterMap, 5000);
    };

    const handleCreateSchedule = async () => {
        setIsLoadingCreateSchedule(true);
        try {
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
                    setShowDestinationSelection(true);
                } else {
                    setShowStudentList(true);
                }
            } else {
                console.error('Erro ao criar o schedule:', response.data);
            }
        } catch (error) {
            console.error('Erro ao criar o schedule:', error);
        } finally {
            setIsLoadingCreateSchedule(false);
        }
    };

    const fetchScheduleDetails = async (scheduleIdParam) => {
        const response = await getDriverScheduleDetails(scheduleIdParam || scheduleId);
    
        if (response.status === 200) {
            console.log('Schedule details obtained successfully');
            const data = response.data;
    
            // Update necessary state variables
            setSchoolInfo(data.schedule.school); // Assuming schedule has a school object
            setWaypoints(data.points);
            setVehicleId(data.vehicle.id);
            setVehicleValue(data.vehicle.id);
            setSelectedCar(data.vehicle.id);
            setSchoolId(data.schedule.school_id); // Assuming schedule has a school_id
            setSchoolValue(data.schedule.school_id);
            setSelectedSchool(data.schedule.school_id);
            setRouteType(data.schedule.schedule_type_id);
    
            // Reconstruct the route and waypoints
            await reconstructRouteFromSchedule(data);
    
        } else {
            console.error('Error obtaining schedule details:', response.data);
        }
    };

    const reconstructRouteFromSchedule = async (data) => {
        // Extract the necessary information
        const orderedPointIdsList = data.points.map(point => point.point.id);
        const legsInfo = JSON.parse(data.schedule.legs_info);
        const overviewPolylinePoints = data.schedule.encoded_points;
        const allEtas = data.schedule.eta.split(',');
    
        // Decode the polyline to get route points
        const decodedPolyline = polyline.decode(overviewPolylinePoints).map(point => ({
            latitude: point[0],
            longitude: point[1],
        }));
        setEncodedRoutePoints(overviewPolylinePoints);
        setRoutePoints(decodedPolyline);
        setRouteLegs(legsInfo);
    
        // Set the optimized waypoints
        const orderedWaypoints = data.points.map(point => {
            const studentNames = point.student.map(student => student.name).join(', ');
            return {
                name: studentNames || point.point.name,
                latitude: point.point.lat,
                longitude: point.point.lng,
                point_id: point.point.id,
                isDestination: point.point.point_type_id === 2, // Assuming 2 indicates destination (school)
            };
        });
        setOptimizedWaypoints(orderedWaypoints);
    
        // Determine current student index based on the status of points
        let currentIndex = 0;
        for (let i = 0; i < data.points.length; i++) {
            if (data.points[i].status.has_embarked !== null) {
                currentIndex = i + 1;
            } else {
                break;
            }
        }
        setCurrentStudentIndex(currentIndex);
    
        // Update next waypoint details
        updateNextWaypointDetails(currentIndex, legsInfo, orderedWaypoints);
    
        // Set total duration and distance (you may need to calculate these)
        setTotalDuration(legsInfo.reduce((acc, leg) => acc + leg.duration.value, 0));
        setTotalDistance(legsInfo.reduce((acc, leg) => acc + leg.distance.value, 0));
    
        // Set other relevant state variables
        setEtas(allEtas);
        setShowStudentList(false);
        setShowEndRouteButton(currentIndex >= orderedWaypoints.length);
    };

    const handleGetCurrentSchedules = async () => {
        const response = await getCurrentSchedules(userData.id);

        if (response.status === 200) {
            console.log('Current schedules obtained successfully');
            const data = response.data;
            return data; // Return the schedule data
        } else {
            console.error('Error obtaining current schedules:', response.data);
            return null;
        }
    };

    const handleStartSchedule = async (orderedPointIdsList, allEtas, overviewPolylinePoints, legs, orderedWaypoints) => {
        const endDate = new Date(Date.now() + totalDuration * 1000);
        const formattedEndDate = endDate.toISOString();
        const formattedEndDateWithoutMilliseconds = formattedEndDate.split('.')[0];

        console.log('List:');
        console.log(orderedPointIdsList);

        const legsInfo = legs.map((leg, index) => {
            let point_id = null;
        
            // Verificar se existe um waypoint correspondente
            if (index < orderedWaypoints.length) {
                point_id = orderedWaypoints[index].point_id || null;
            }
            
            return {
                start_location: leg.start_location,
                end_location: leg.end_location,
                duration: leg.duration, // Adicionado
                point_id: point_id
            };
        });

        console.log('Legs Info:', JSON.stringify(legsInfo));
        console.log('Encoded',overviewPolylinePoints.toString())

        const body = {
            user_id: userData.id,
            schedule_id: scheduleId,
            school_id: schoolId,
            end_date: formattedEndDateWithoutMilliseconds,
            points: orderedPointIdsList,
            encoded_points: overviewPolylinePoints.toString(),
            legs_info: JSON.stringify(legsInfo),
            eta: allEtas.toString(),
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
        setIsLoadingVehiclesAndSchools(true);
        try {
            const response = await getVehicleByUser(userData.id);

        if (response.status === 200) {
            console.log('Veículos obtidos com sucesso');
            setAllVehicles(response.data);
            setVehicleItems(response.data.map(vehicle => ({
                label: `${vehicle.model} - ${vehicle.plate}`,
                value: vehicle.id
            })));
            console.log('Veículos:', response.data);
        } else {
            console.error('Erro ao obter veículos:', response.data);
        }

        const response2 = await getSchoolByDriver(userData.id);

        if (response2.status === 200) {
            console.log('Escolas obtidas com sucesso');
            setAllSchools(response2.data);
            setSchoolItems(response2.data.map(school => ({
                label: `${school.point.name}`,
                value: school.point.id
            })));
            setShowDropdowns(true);
            console.log('Escolas:', response2.data);
        } else {
            console.error('Erro ao obter escolas:', response2.data);
        }
        } catch (error) {
            console.error('Erro ao obter veículos ou escolas:', error);
        } finally {
            setIsLoadingVehiclesAndSchools(false);
        }
    }

    const handleStudentSelect = (studentId) => {
        setSelectedStudents((prevSelected) => {
            if (prevSelected.includes(studentId)) {
                return prevSelected.filter((id) => id !== studentId);
            } else {
                return [...prevSelected, studentId];
            }
        });
    };

    const handleEntrega = async (bool) => {
        if (optimizedWaypoints[currentStudentIndex]?.point_id) {
            await handleStudentDelivered(optimizedWaypoints[currentStudentIndex]?.point_id, bool);
        }

        if (currentStudentIndex < optimizedWaypoints.length - 1) {
            setCurrentStudentIndex((prevIndex) => {
                const newIndex = prevIndex + 1;
                setWaypointProximity(true);

                updateNextWaypointDetails(newIndex);

                return newIndex;
            });
        } else {
            console.log('Toda a fila de alunos foi percorrida.');
            setWaypointProximity(false);
            setShowEndRouteButton(true);
        }
    };

    const handlePostDriverLocation = async (body) => {
        const postLocation = await postDriverLocation(body)

        if (postLocation.status === 201) {
            console.log('Sucesso ao enviar localização do motorista')
        }
        else {
            console.log('Erro ao enviar localização do motorista')
        }
    }

    useEffect(() => {
        const isLocationAvailable = userLocation?.latitude && userLocation?.longitude

        if (isLocationAvailable && routeOnGoing && userData) {
            const body = {
                lat: userLocation.latitude,
                lng: userLocation.longitude,
                user_id: userData.id,
                schedule_id: scheduleId
            }
            handlePostDriverLocation(body);
        }
    }, [clock])

    useEffect(() => {
        let isMounted = true;

        const intervalFunc = () => {
            if (isMounted) {
                setClock(prevClock => !prevClock);
                setTimeout(intervalFunc, 60000);
            }
        };

        intervalFunc();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const options = [];

        if (schoolInfo) {
            options.push({
                id: schoolInfo.id,
                name: schoolInfo.name,
                description: schoolInfo.description,
                latitude: schoolInfo.lat,
                longitude: schoolInfo.lng,
            });
        }

        if (driverPoints && driverPoints.length > 0) {
            driverPoints.forEach(point => {
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

    const handlePostRoute = async (body) => {
        if (encodedRoutePoints && routeOnGoing && userData) {
            const body = {
                route_points: encodedRoutePoints
            }
            const postRoute = await postRoutePoints(body)

            if (postRoute.status === 201) {
                console.log('Sucesso ao enviar rota codificada')
            }
            else {
                console.log('Erro ao enviar rota codificada')
            }
        }
    }

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
                        <ActivityIndicator size="large" color="#C36005" />
                    </View>
                )}
                {region ? (
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
                            heading: heading,
                            altitude: 0,
                            zoom: 18,
                        }}
                    >

                        {userLocation && (
                            <Marker
                                coordinate={userLocation}
                                title="Sua localização"
                                anchor={{ x: 0.5, y: 0.5 }}
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
                )
            :
            (<ActivityIndicator size="large" color="#C36005" />)}
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
            {startButton && !routeOnGoing && region && (
                <View>
                    {/* Show "IDA ESCOLA" and "VOLTA ESCOLA" buttons if no other selection is active */}
                    {!showDropdowns && !showStudentList && !showDestinationSelection && (
                        <View style={styles.startButtonPos}>
                            <View style={styles.startContent}>
                                <Button
                                    disabled={isLoadingVehiclesAndSchools}
                                    style={styles.startRouteButton}
                                    onPress={() => {
                                        setRouteType(1);
                                        handleUserVehiclesAndSchool();
                                    }}
                                    >
                                    {isLoadingVehiclesAndSchools ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" style={{alignSelf:'center'}}/>
                                    ) : (
                                        <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>IDA ESCOLA</Text>
                                    )}
                                    </Button>

                                    <Button
                                    disabled={isLoadingVehiclesAndSchools}
                                    style={styles.startRouteButton}
                                    onPress={() => {
                                        setRouteType(2);
                                        handleUserVehiclesAndSchool();
                                    }}
                                    >
                                    {isLoadingVehiclesAndSchools ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" style={{alignSelf:'center'}}/>
                                    ) : (
                                        <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>VOLTA ESCOLA</Text>
                                    )}
                                </Button>
                            </View>
                        </View>
                    )}

                    {/* Show car and school selection */}
                    {showDropdowns && (
                        <View style={styles.startButtonPos}>
                            <View style={styles.startDropdown}>
                                <Text style={styles.dropdownLabel}>Escolha o carro:</Text>
                                <DropDownPicker
                                    open={vehicleOpen}
                                    value={vehicleValue}
                                    items={vehicleItems}
                                    setOpen={setVehicleOpen}
                                    setValue={(callback) => {
                                        const value = callback(vehicleValue);
                                        setVehicleValue(value);
                                        setVehicleId(value);
                                        setSelectedCar(value);
                                    }}
                                    setItems={setVehicleItems}
                                    placeholder="Selecione um carro"
                                    style={styles.dropdown}
                                    dropDownContainerStyle={styles.dropdownContainer}
                                    zIndex={3000}
                                    zIndexInverse={1000}
                                />

                                <Text style={styles.dropdownLabel}>Escolha a escola:</Text>
                                <DropDownPicker
                                    open={schoolOpen}
                                    value={schoolValue}
                                    items={schoolItems}
                                    setOpen={setSchoolOpen}
                                    setValue={(callback) => {
                                        const value = callback(schoolValue);
                                        setSchoolValue(value);
                                        setSchoolId(value);
                                        setSelectedSchool(value);
                                    }}
                                    setItems={setSchoolItems}
                                    placeholder="Selecione uma escola"
                                    style={styles.dropdown}
                                    dropDownContainerStyle={styles.dropdownContainer}
                                    zIndex={2000}
                                    zIndexInverse={2000}
                                />

                                <Button
                                mode="contained"
                                style={styles.confirmButton}
                                disabled={isLoadingCreateSchedule}
                                onPress={() => {
                                    if (selectedCar && selectedSchool) {
                                    handleCreateSchedule();
                                    } else {
                                    alert('Por favor, selecione o carro e a escola.');
                                    }
                                }}
                                >
                                {isLoadingCreateSchedule ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" style={{alignSelf:'center'}}/>
                                ) : (
                                    <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>CONFIRMAR</Text>
                                )}
                                </Button>
                            </View>
                        </View>
                    )}

                    {/* Show destination selection for return trip */}
                    {showDestinationSelection && (
                        <View style={styles.startButtonPos}>
                            <View style={styles.startDropdown}>
                                <Text style={styles.dropdownLabel}>Escolha o destino:</Text>
                                <DropDownPicker
                                    open={destinationOpen}
                                    value={selectedDestination}
                                    items={destinationOptions.map(option => ({
                                        label: option.name,
                                        value: option.id,
                                        description: option.description
                                    }))}
                                    setOpen={setDestinationOpen}
                                    setValue={(callback) => {
                                        const value = callback(selectedDestination);
                                        setSelectedDestination(value);
                                        const selectedOption = destinationOptions.find(option => option.id === value);
                                        setSelectedDestinationPoint(selectedOption);
                                    }}
                                    placeholder="Selecione um destino"
                                    style={styles.dropdown}
                                    dropDownContainerStyle={styles.dropdownContainer}
                                />
                                <Button
                                    mode="contained"
                                    style={styles.confirmButton}
                                    onPress={() => {
                                        if (selectedDestinationPoint) {
                                            setShowDestinationSelection(false);
                                            setShowStudentList(true);
                                        } else {
                                            Alert.alert("Por favor, selecione um destino.");
                                        }
                                    }}
                                    >
                                    <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>CONFIRMAR</Text>
                                </Button>
                            </View>
                        </View>
                    )}

                    {/* Show student list after selecting destination for return trip */}
                    {showStudentList && routeType === 2 && (
                        <View style={styles.startButtonPos}>
                            <View style={styles.startDropdown}>
                                <Text style={styles.dropdownLabel}>Selecione os alunos:</Text>
                                <FlatList style={{ width: '60%' }}
                                    data={waypoints.reduce((acc, point) => acc.concat(point.student), [])}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.card}>
                                            <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                                                <View style={{alignItems:'flex-start', width:'50%', marginLeft:10}}>
                                                    <Text style={styles.studentName}>{item.name}</Text>
                                                    <Text style={{alignSelf:'flex-start'}}>Idade: {item.year}</Text>
                                                </View>

                                                {/* Checkbox to select/deselect the student */}
                                                <View style={{borderColor:'#C0C0C0', borderWidth:1, borderRadius:20}}>
                                                    <Checkbox
                                                        status={selectedStudents.includes(item.point_id) ? 'checked' : 'unchecked'}
                                                        onPress={() => handleStudentSelect(item.point_id)}
                                                        color="#C36005"
                                                        style={styles.checkbox}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                />
                                <Button
                                    mode="contained"
                                    style={styles.confirmButton}
                                    onPress={() => {
                                        if (selectedStudents.length > 0) {
                                            startRoute();
                                        } else {
                                            Alert.alert('Aviso', 'Por favor, selecione pelo menos um aluno.');
                                        }
                                    }}
                                >
                                    {isLoadingStartRoute ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" style={{alignSelf:'center'}}/>
                                    ) : (
                                        <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>CONFIRMAR</Text>
                                    )}
                                </Button>
                            </View>
                        </View>
                    )}

                    {/* For routeType === 1 (Ida), show student list directly */}
                    {showStudentList && routeType === 1 && (
                        <View style={styles.startButtonPos}>
                            <View style={styles.startDropdown}>
                                <Text style={styles.dropdownLabel}>Alunos da rota:</Text>
                                <FlatList style={{ width: '60%' }}
                                    data={waypoints.reduce((acc, point) => acc.concat(point.student), [])}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.card}>
                                            <Text style={styles.studentName2}>{item.name}</Text>
                                            <Text style={{alignSelf:'center'}}>Idade: {item.year}</Text>
                                        </View>
                                    )}
                                />
                                <Button
                                    mode="contained"
                                    style={styles.confirmButton}
                                    onPress={startRoute}
                                >
                                    {isLoadingStartRoute ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" style={{alignSelf:'center'}}/>
                                    ) : (
                                        <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>CONFIRMAR</Text>
                                    )}
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
                                <Text style={styles.infoCardText}>{nextWaypointDistance ? formatDistance(nextWaypointDistance) : ''}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
            }

            {/* ---------- CARD ALUNO ENTREGUE ---------- */}
            {currentStudentIndex < optimizedWaypoints.length && (
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
                                <Text style={{color:'white', fontSize:13, fontWeight:'bold'}}>
                                    SIM
                                </Text>
                            </Button>
                            <Button style={styles.deliveredCardButtonNo} mode="contained" onPress={() => handleEntrega(false)}>
                                <Text style={{color:'white', fontSize:13, fontWeight:'bold'}}>
                                    NÃO
                                </Text>
                            </Button>
                        </View>
                    </View>
                </View>
            )}

            {showEndRouteButton && (
                <View style={styles.endRouteButtonContainer}>
                    <Button
                        // mode="contained"
                        onPress={() => endRoute(routeType)}
                        style={styles.endRouteButton}
                    >
                        {isLoadingEndRoute ? (
                            <ActivityIndicator size="small" color="#FFFFFF" style={{alignSelf:'center'}}/>
                        ): (

                            <Text style={{color:'white', fontSize:13, fontWeight:'bold', alignSelf:'center'}}>
                                ENCERRAR ROTA
                            </Text>
                        )}
                    </Button>
                </View>
            )}


        </View>
    );
}

export default MapaMotorista