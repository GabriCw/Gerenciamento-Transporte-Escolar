import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, Image, Text} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, { Marker, Polyline, AnimatedRegion, Animated } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { styles } from './Style/mapaResponsavelStyle';
import { Button } from 'react-native-paper';
import { formatTime, formatDistance } from '../../utils/formatUtils';
import { FontAwesome5 } from '@expo/vector-icons';
import { getDriverLocation, getDriversLastPosition, getStudentPosition, getCurrentSchedules, getScheduleMapsInfos, getByStudent } from '../../data/locationServices';
import { getStudentByResponsible, getStudentDetails} from '../../data/studentServices';
import { getPointByID } from '../../data/pointServices';
import { AuthContext } from '../../providers/AuthProvider';

// Camera que nem a do uber (rota inteira, aumentando o zoom conforme diminuindo o tamanho)

const MapaResponsavel = ({ navigation }) => {

    const {userData} = useContext(AuthContext);
    const scheduleInfoRef = useRef(null);
    const studentsData = useRef(null);
    const [scheduleId, setScheduleId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [residenciaAtiva, setResidenciaAtiva] = useState(null);
    const [escola, setEscola] = useState(
        { name: 'Mauá', latitude: -23.647438, longitude: -46.575321 }
    )
    
    const [heading, setHeading] = useState(0);
    const [motoristaLoc, setMotoristaLoc] = useState(null);

    const [nextWaypointDuration, setNextWaypointDuration] = useState(300);
    const [nextWaypointDistance, setNextWaypointDistance] = useState(500);

    const [mapsInfos, setMapsInfos] = useState(null);
    const [studentPosition, setStudentPosition] = useState(null);

    const mapRef = useRef(null);
    const [clock, setClock] = useState(true);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(null);

    const [routeCoordinates, setRouteCoordinates] = useState([]);

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

    const handleGetScheduleInfo = async(user_id) => {
        const getSchedules = await getCurrentSchedules(user_id)

        if(getSchedules.status === 200){
            console.log('Sucesso ao receber informações da viagem')
            console.log('Schedules.data: ', getSchedules.data)
            return getSchedules.data
        }
        else{   
            console.log('Erro ao receber informações da viagem')
        }
    }

    const handleGetStudentByResponsible = async(user_id) => {
        const getByResponsible = await getStudentByResponsible(user_id)

        if(getByResponsible.status === 200){
            console.log('Sucesso ao receber informações dos alunos pro Responsável')
            console.log('Students by responsible: ', getByResponsible.data)
            return getByResponsible.data
        }
        else{   
            console.log('Erro ao receber informações dos alunos pro Responsável')
        }
    }
    
    const handleGetDriverLocation = async(schedule_id, user_id) => {
        const getLocation = await getDriversLastPosition(parseInt(schedule_id), parseInt(user_id))

        if(getLocation.status === 200){
            console.log('Sucesso ao receber localização do motorista')
            return getLocation.data
        }
        else{   
            console.log('Erro ao receber localização do motorista')
        }
        console.log('Localização Status:', getLocation.status)
    }

    const handleGetMapsInfos = async(schedule_id, user_id) => {
        const getMapInfos = await getScheduleMapsInfos(schedule_id.toString(), user_id.toString());
    
        if(getMapInfos.status === 200){
            console.log('Sucesso ao receber informações da rota');
            const mapsData = getMapInfos.data;
    
            // Decodificar o encoded_points
            const decodedPoints = polyline.decode(mapsData.encoded_points).map(point => ({
                latitude: point[0],
                longitude: point[1],
            }));
    
            // Armazenar os pontos decodificados no estado
            setRouteCoordinates(decodedPoints);
    
            // Você também pode armazenar outras informações, se necessário
            setMapsInfos(mapsData);
        } else {   
            console.log('Erro ao receber informações da rota');
            console.log('STATUS:', getMapInfos.status);
        }
    }

    const handleGetStudentPosition = async(schedule_id, user_id) => {
        const studentPositionResponse = await getStudentPosition(schedule_id, user_id)

        if(studentPositionResponse.status === 200){
            console.log('Sucesso ao receber a posição na fila do aluno')
            return studentPositionResponse.data
        }
        else{   
            console.log('Erro ao receber a posição na fila do aluno')
        }
    }

    const handleGetByStudent = async(student_id, user_id) => {
        const studentSchedules = await getByStudent(student_id, user_id)

        if(studentSchedules.status === 200){
            console.log('Sucesso ao receber as viagens do aluno')
            return studentSchedules.data
        }
        else{   
            console.log('Erro ao receber as viagens do aluno')
        }
    }


    // ----------------------------------------------
    // ---------- Pega info das Schedules -----------
    // ----------------------------------------------

    // useEffect(() => {
    //     const fetchScheduleInfo = async () => {
    //         const scheduleInfoData = await handleGetScheduleInfo(userData.id);
    //         scheduleInfoRef.current = scheduleInfoData;

    //         setItems(scheduleInfoRef.current.map(schedule => ({
    //             label: `Schedule ${schedule.id}`,
    //             value: schedule.id
    //         })))
    //     };

    //     fetchScheduleInfo();
    // }, []);


    // ------------------------------------------------------------------
    // ---------- Pega info dos Alunos com base no user_id --------------
    // ------------------------------------------------------------------
    useEffect(() => {
        
        const fetchStudentInfo = async () => {
            const studentsDataResponse = await handleGetStudentByResponsible(userData.id);
            studentsData.current = studentsDataResponse;

            setItems(studentsData.current.map(student => ({
                label: `Aluno ${student.name}`,
                value: {id: student.id, point_id: student.point_id}, 
            })))
        };

        fetchStudentInfo();
    }, []);

    
    // ---------------------------------------------------------------------
    // ---------- Pega info das Schedules com base no student_id -----------
    // ---------------------------------------------------------------------
    useEffect(() => {
        
        const fetchScheduleInfo = async () => {
            const studentsDataResponse = await handleGetByStudent(selectedStudent.id ,userData.id);
            setScheduleId(studentsDataResponse.id) // VERIFICA SE É ID MESMO NA RESPONSE
        };

        if (selectedStudent) {
            fetchScheduleInfo();
        }
    }, [selectedStudent]);


    const handlePickerChange = (itemValue) => {
        setSelectedStudent(itemValue);
        // console.log('selectedStudent', selectedStudent)
        // console.log('itemValue', itemValue)
    };


    // ------------------------------------------
    // ----------- Definindo o Clock  -----------
    // ------------------------------------------
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


    // ------------------------------------------
    // ---------- Pegando info da rota ----------
    // ------------------------------------------

    useEffect(() => {
        const requestLocation = async () => {
            const lastCoordinate = await handleGetDriverLocation(scheduleId, userData.id);
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


    // ------------------------------------------
    // ---------- Pegando info da rota ----------
    // ------------------------------------------
    // useEffect(() => {
    //     const requestMapsInfos = async () => {
    //         const mapsInfosData = await handleGetMapsInfos(scheduleId, userData.id);
    //         setMapsInfos(mapsInfosData);
    //         console.log('MAPS INFOS:', mapsInfosData);
    //     };
    
    //     requestMapsInfos();  // Chama a função assíncrona e espera seu término
    
    // }, [clock]);
    useEffect(() => {
        if (scheduleId && userData.id) {
            const requestMapsInfos = async () => {
                await handleGetMapsInfos(scheduleId, userData.id);
            };
    
            requestMapsInfos();
        }
    }, [clock, scheduleId, userData.id]);

    
    // ------------------------------------------------------
    // ---------- Pegando posição na fila do aluno ----------
    // ------------------------------------------------------
    // useEffect(() => {
    //     const requestStudentPosition = async () => {
    //         const studentPositionRes = await handleGetStudentPosition(scheduleId, userData.id);
    //         console.log('Posição na fila:',studentPositionRes)
    //         return studentPositionRes;
    //     };
        
    //     const studentPositionData = requestStudentPosition();
    //     setStudentPosition(studentPositionData);
    // }, [clock]);
    useEffect(() => {
        const requestStudentPosition = async () => {
            const studentPositionRes = await handleGetStudentPosition(scheduleId, userData.id);
            console.log('Posição na fila:', studentPositionRes);
            setStudentPosition(studentPositionRes);
        };
    
        if (scheduleId && userData.id) {
            requestStudentPosition();
        }
    }, [clock, scheduleId, userData.id]);


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

    // Atualiza a casa do aluno no mapa
    useEffect(() => {
        if (selectedStudent && selectedStudent.point_id) {
          const fetchPointInfo = async () => {
            try {
              const pointResponse = await getPointByID(selectedStudent.point_id);
              if (pointResponse.status === 200) {
                const pointData = pointResponse.data;
                // Atualize residenciaAtiva com os dados obtidos
                setResidenciaAtiva({
                  name: pointData.name || 'Residência',
                  latitude: pointData.lat,
                  longitude: pointData.lng
                });
              } else {
                console.log('Erro ao obter informações do ponto:', pointResponse.status);
              }
            } catch (error) {
              console.error('Erro ao obter informações do ponto:', error);
            }
          };
      
          fetchPointInfo();
        }
      }, [selectedStudent]);
      
    //Atualiza a região do mapa para mostrar a rota inteira
    useEffect(() => {
        if (routeCoordinates.length > 0 && mapRef.current) {
            mapRef.current.fitToCoordinates(routeCoordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [routeCoordinates]);

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

                        {routeCoordinates.length > 0 && (
                            <Polyline
                                coordinates={routeCoordinates}
                                strokeWidth={10}
                                strokeColor="orange"
                            />
                        )}
                    </MapView>
                )}
            {studentsData.current && (
                <View style={styles.pickerWrapper}>
                    <DropDownPicker
                        style={styles.pickerStyle}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        onChangeValue={(value) => handlePickerChange(value)}
                        placeholder="Escolha um aluno"
                        ListEmptyComponent={() => <Text>Nenhum aluno disponível</Text>} // Mensagem personalizada
                    />
                </View>
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
                                    {studentPosition !== null ? (
                                        <>
                                            <Text style={styles.infoCardTitle2}>
                                                {`${studentPosition} aluno(s) até a entrega`}
                                            </Text>
                                            {/* Se quiser, pode adicionar mais informações aqui */}
                                        </>
                                    ) : (
                                        <Text style={styles.infoCardTitle}>
                                            Carregando posição na fila...
                                        </Text>
                                    )}
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