import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, Image, Text} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, { Marker, Polyline, AnimatedRegion, Animated } from 'react-native-maps';
import polyline from '@mapbox/polyline';
import { styles } from './Style/mapaResponsavelStyle';
import { FontAwesome5 } from '@expo/vector-icons';
import { getDriversLastPosition, getStudentPosition, getCurrentSchedules, getScheduleMapsInfos, getByStudent } from '../../data/locationServices';
import { getStudentByResponsible } from '../../data/studentServices';
import { getPointByID } from '../../data/pointServices';
import { AuthContext } from '../../providers/AuthProvider';
import { getDistance } from 'geolib';

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

    const [mapsInfos, setMapsInfos] = useState(null);
    const [studentPosition, setStudentPosition] = useState(null);

    const mapRef = useRef(null);
    const [clock, setClock] = useState(true);

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(null);

    const [routeCoordinates, setRouteCoordinates] = useState([]);

    const [legsInfo, setLegsInfo] = useState([]);
    const [relevantRouteCoordinates, setRelevantRouteCoordinates] = useState([]);
    
    const [studentDelivered, setStudentDelivered] = useState(false);
    const [totalDurationToStudent, setTotalDurationToStudent] = useState(0);
    const [etaToStudent, setEtaToStudent] = useState(null);
    const [totalDurationToSchool, setTotalDurationToSchool] = useState(0);
    const [etaToSchool, setEtaToSchool] = useState(null);

    const lastValidStudentPosition = useRef(null);


    // Determinar se o aluno já foi embarcado
    useEffect(() => {
        if (studentPosition !== null && studentPosition !== undefined) {
          if (studentPosition >= 0) {
            // Aluno ainda não foi embarcado
            setStudentDelivered(false);
          } else {
            // Aluno já foi embarcado
            setStudentDelivered(true);
          }
        }
    }, [studentPosition]);

    // Calcular totalDurationToStudent e etaToStudent
    useEffect(() => {
        if (legsInfo.length > 0 && studentPosition !== null && studentPosition !== undefined && studentPosition >= 0) {
        let durationSum = 0;
        for (let i = 0; i <= studentPosition && i < legsInfo.length; i++) {
            durationSum += legsInfo[i].duration.value;
        }
        setTotalDurationToStudent(durationSum);
    
        const now = new Date();
        const etaDate = new Date(now.getTime() + durationSum * 1000);
        setEtaToStudent(etaDate);
        }
    }, [legsInfo, studentPosition]);

    useEffect(() => {
    if (legsInfo.length > 0 && studentPosition !== null && studentPosition !== undefined && studentPosition >= 0) {
        let studentLegIndex = legsInfo.findIndex(leg => leg.point_id === selectedStudent.point_id);
        let durationSum = 0;
        for (let i = studentLegIndex + 1; i < legsInfo.length; i++) {
        durationSum += legsInfo[i].duration.value; // em segundos
        }
        setTotalDurationToSchool(durationSum);
    }
    }, [legsInfo, studentPosition, selectedStudent]);

    
    useEffect(() => {
    if (totalDurationToSchool > 0) {
        const now = new Date();
        const etaDate = new Date(now.getTime() + totalDurationToSchool * 1000);
        setEtaToSchool(etaDate);
    }
    }, [totalDurationToSchool]);


    const findClosestIndex = (coordinate, coordinatesArray) => {
        let minDistance = Infinity;
        let closestIndex = -1;
        for (let i = 0; i < coordinatesArray.length; i++) {
            const distance = getDistance(coordinate, coordinatesArray[i]);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }
        return closestIndex;
    };


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

    const handleGetMapsInfos = async (schedule_id, user_id) => {
        const getMapInfos = await getScheduleMapsInfos(schedule_id.toString(), user_id.toString());
    
        if (getMapInfos.status === 200) {
            console.log('Sucesso ao receber informações da rota');
            const mapsData = getMapInfos.data;
            // console.log(mapsData)
    
            // Decodificar o encoded_points
            const decodedPoints = polyline.decode(mapsData.encoded_points).map(point => ({
                latitude: point[0],
                longitude: point[1],
            }));
    
            // Armazenar os pontos decodificados no estado
            setRouteCoordinates(decodedPoints);
    
            // Parse do legs_info e armazenamento
            const parsedLegsInfo = JSON.parse(mapsData.legs_info);
            setLegsInfo(parsedLegsInfo);
    
            // Armazenar outras informações, se necessário
            setMapsInfos(mapsData);
        } else {
            console.log('Erro ao receber informações da rota');
            console.log('STATUS:', getMapInfos.status);
        }
    };

    const handleGetStudentPosition = async (schedule_id, user_id) => {
        const studentPositionResponse = await getStudentPosition(schedule_id, user_id);
      
        if (studentPositionResponse && studentPositionResponse.status === 200) {
          console.log('Sucesso ao receber a posição na fila do aluno');
          return studentPositionResponse.data;
        } 
        else {
          console.log('Erro ao receber a posição na fila do aluno');
          return null; // Retorna null em caso de erro
        }
    };

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
    };


    // ------------------------------------------
    // ----------- Definindo o Clock  -----------
    // ------------------------------------------
    // useEffect(() => {
    //     let isMounted = true;

    //     const intervalFunc = () => {
    //         if (isMounted) {
    //             setClock(prevClock => !prevClock);
    //             setTimeout(intervalFunc, 10000); // Repetir a cada 10 segundos

    //         }
    //     };

    //     intervalFunc(); // Inicializar a primeira execução

    //     return () => {
    //         isMounted = false; // Limpar na desmontagem do componente
    //     };
    // }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setClock((prevClock) => !prevClock);
        }, 10000); // Repeats every 10 seconds
        
        return () => clearInterval(intervalId); // Clear interval on component unmount
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
            // console.log('------ MOTORISTA LOC:', lastCoord)
        };
    
        updateLocation();
        handleGetScheduleInfo(userData.id);
    }, [clock]);


    // ------------------------------------------
    // ---------- Pegando info da rota ----------
    // ------------------------------------------
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

    useEffect(() => {
        const requestStudentPosition = async () => {
          const studentPositionRes = await handleGetStudentPosition(scheduleId, userData.id);
        //   console.log('Posição na fila:', studentPositionRes);
      
          if (studentPositionRes !== null && studentPositionRes !== undefined) {
            setStudentPosition(studentPositionRes);
            lastValidStudentPosition.current = studentPositionRes; // Atualiza o último valor válido
          } else if (lastValidStudentPosition.current !== null) {
            // Mantém o último valor válido
            setStudentPosition(lastValidStudentPosition.current);
          }
          // Caso contrário, não atualiza o estado
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


    // ------------------------------------------------------------
    // Encontrar o Leg Correspondente ao Aluno
    // ------------------------------------------------------------
    
    useEffect(() => {
        if (legsInfo.length > 0 && selectedStudent && routeCoordinates.length > 0) {
            // Filtrar os legs até o aluno selecionado
            const relevantLegs = [];
            for (let i = 0; i < legsInfo.length; i++) {
                const leg = legsInfo[i];
                relevantLegs.push(leg);
    
                if (leg.point_id === selectedStudent.point_id) {
                    // Encontramos o leg do aluno, podemos parar aqui
                    break;
                }
            }
    
            // Mapear os legs relevantes para coordenadas
            const relevantCoords = [];
            for (const leg of relevantLegs) {
                const startCoord = { latitude: leg.start_location.lat, longitude: leg.start_location.lng };
                const endCoord = { latitude: leg.end_location.lat, longitude: leg.end_location.lng };
    
                const startIndex = findClosestIndex(startCoord, routeCoordinates);
                const endIndex = findClosestIndex(endCoord, routeCoordinates);
    
                if (startIndex >= 0 && endIndex >= 0 && endIndex >= startIndex) {
                    const legCoords = routeCoordinates.slice(startIndex, endIndex + 1);
                    relevantCoords.push(...legCoords);
                }
            }
    
            setRelevantRouteCoordinates(relevantCoords);
        }
    }, [legsInfo, selectedStudent, routeCoordinates]);

    // ------------------------------------
    // Extrai coordenadas das legs
    // ------------------------------------
    const extractCoordinatesFromLegs = (legsArray) => {
        const relevantCoords = [];
        for (const leg of legsArray) {
          const startCoord = { latitude: leg.start_location.lat, longitude: leg.start_location.lng };
          const endCoord = { latitude: leg.end_location.lat, longitude: leg.end_location.lng };
          const startIndex = findClosestIndex(startCoord, routeCoordinates);
          const endIndex = findClosestIndex(endCoord, routeCoordinates);
          if (startIndex >= 0 && endIndex >= 0 && endIndex >= startIndex) {
            const legCoords = routeCoordinates.slice(startIndex, endIndex + 1);
            relevantCoords.push(...legCoords);
          }
        }
        return relevantCoords;
    };


    // ------------------------------------
    // Antes do Embarque
    // ------------------------------------
    useEffect(() => {
        if (legsInfo.length > 0 && selectedStudent && studentPosition !== null && studentPosition >= 0 && routeCoordinates.length > 0) {
          const legsToStudent = legsInfo.slice(0, studentPosition + 1);
          const relevantCoords = extractCoordinatesFromLegs(legsToStudent);
          setRelevantRouteCoordinates(relevantCoords);
        }
    }, [legsInfo, selectedStudent, studentPosition, routeCoordinates]);


    // ------------------------------------
    // Depois do Embarque
    // ------------------------------------
    useEffect(() => {
        if (legsInfo.length > 0 && selectedStudent && studentPosition !== null && studentPosition < 0 && routeCoordinates.length > 0) {
          let studentLegIndex = legsInfo.findIndex(leg => leg.point_id === selectedStudent.point_id);
          const legsToSchool = legsInfo.slice(studentLegIndex + 1);
          const relevantCoords = extractCoordinatesFromLegs(legsToSchool);
          setRelevantRouteCoordinates(relevantCoords);
        }
    }, [legsInfo, selectedStudent, studentPosition, routeCoordinates]);


    // ------------------------------------
    // Ajustar Enquadramento no Mapa
    // ------------------------------------
    useEffect(() => {
        if (relevantRouteCoordinates.length > 0 && mapRef.current) {
          mapRef.current.fitToCoordinates(relevantRouteCoordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
    }, [relevantRouteCoordinates]);



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

                        {relevantRouteCoordinates.length > 0 && (
                            <Polyline
                                coordinates={relevantRouteCoordinates}
                                strokeWidth={10}
                                strokeColor="orange"
                            />
                        )}

                        {/* {routeCoordinates.length > 0 && (
                            <Polyline
                                coordinates={routeCoordinates}
                                strokeWidth={10}
                                strokeColor="orange"
                            />
                        )} */}

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
            {studentsData.current && (
                <View style={styles.pickerWrapper}>
                    <DropDownPicker
                        style={styles.pickerStyle}
                        open={open}
                        value={selectedStudent}
                        items={items}
                        setOpen={setOpen}
                        setValue={setSelectedStudent}
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
                        {studentPosition !== null && studentPosition >= 0 && (
                            // Aluno ainda não embarcado
                            <>
                            <Text style={styles.infoCardTitle}>Chegada na residência:</Text>
                            {etaToStudent && (
                                <Text style={styles.infoCardText}>
                                {etaToStudent.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            )}
                            <Text style={styles.infoCardTitle2}>
                                {`${studentPosition} aluno(s) até a chegada`}
                            </Text>
                            </>
                        )}
                        {studentPosition !== null && studentPosition < 0 && (
                            // Aluno já embarcado
                            <>
                            <Text style={styles.infoCardTitle}>Chegada na escola:</Text>
                            {etaToSchool && (
                                <Text style={styles.infoCardText}>
                                {etaToSchool.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            )}
                        </>
                        )}
                        {(studentPosition === null || studentPosition === undefined) && (
                            // Quando studentPosition é undefined ou null
                            <Text style={styles.infoCardTitle}>Carregando informações...</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}

export default MapaResponsavel;