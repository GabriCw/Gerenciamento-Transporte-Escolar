import { Pressable, ScrollView, StyleSheet, Text, View,Image } from "react-native";
import PageDefault from "../../../components/pageDefault/PageDefault";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { getPinImage } from "../../../utils/getPinImage";

const ResponsibleScheduleHistoricDetails = ({route}) => {
    
    const mapRef = useRef(null);
    const { coordinates, loraCoordinates, details } = route.params;

    const [detailsId, setDetailsId] = useState(null);
    const [actualCoordinate, setActualCoordinate] = useState(coordinates);
    const [hasChangedCoord, setHasChangedCoord] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("Visualizar Rastreio LoRa");
    const [stops, setStops] = useState([]);

    const handleShowDetails = (value) => {
        if(detailsId){
            setDetailsId(null);
            return;
        }

        setDetailsId(value.id);
    };

    const handleChangeCoordinate = () => {
        if(!hasChangedCoord){
            setActualCoordinate(loraCoordinates);
            setHasChangedCoord(true);
            setButtonLabel("Visualizar Rastreio LoRa");
        }
        else{
            setActualCoordinate(coordinates);
            setHasChangedCoord(false);
            setButtonLabel("Visualizar Rastreio Celular");
        }
    };

    return <PageDefault headerTitle={`Detalhe da Viagem - ${details?.name.split(" ")[0]} (${moment(details?.initial_date).format("DD/MM")})`} withoutCentering={true} titleSize={16}>
        <View style={styles.content}>
            <View style={styles.mapContainer}> 
                {
                    actualCoordinate?.length > 0 ? 
                    <MapView
                        style={styles.map}
                        ref={mapRef}
                        initialRegion={{
                            latitude: actualCoordinate[0]?.latitude,
                            longitude: actualCoordinate[0]?.longitude,
                            latitudeDelta: 0.2,
                            longitudeDelta: 0.2,
                        }}
                        zoomTapEnabled={true}
                        onLayout={() => {
                            if (details?.points?.length > 0) {
                                const coordinates = details.points.map(item => ({
                                    latitude: item.point.lat,
                                    longitude: item.point.lng,
                                }));
                                mapRef.current?.fitToCoordinates(coordinates, {
                                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                                    animated: true,
                                });
                            }
                        }}
                    >
                        <Polyline
                            coordinates={actualCoordinate}
                            strokeColor="#090833"
                            strokeWidth={5}
                        />

                        <Marker coordinate={{latitude: details.point.point.lat, longitude: details.point.point.lng}}>
                            <Image
                                source={getPinImage(0)}
                                style={{ width: 30, height: 30 }}
                            />
                        </Marker>
                    </MapView>
                    :
                    null
                }
            </View>
            <View style={styles.infosContainer}>
                <View style={styles.resumeInfosContainer}>
                    <View style={styles.initialAndStopContent}>
                        <View style={styles.resumeInfosContent}>
                            <FontAwesome name="play-circle" size={16} color="#fff" />
                            <Text style={styles.resumeTitle}>Início: </Text>
                            <Text style={styles.resumeText}>{moment(details.initial_date).format("HH:mm")}</Text>
                        </View>
                        <View style={styles.resumeInfosContent}>
                            <FontAwesome name="stop-circle" size={16} color="#fff" />
                            <Text style={styles.resumeTitle}>Término: </Text>
                            <Text style={styles.resumeText}>{moment(details.real_end_date).format("HH:mm")}</Text>
                        </View>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.initialAndStopContent}>
                        <View style={styles.resumeInfosContent}>
                            <MaterialCommunityIcons name="timer-sand-complete" size={16} color="#fff" />
                            <Text style={styles.resumeTitle}>Duração: </Text>
                            <Text style={styles.resumeText}>{moment(details.real_duration).format("HH:mm")}</Text>
                        </View>
                        <View style={styles.resumeInfosContent}>
                            <MaterialCommunityIcons name="timer-sand" size={16} color="#fff" />
                            <Text style={styles.resumeTitle}>Duração Planejada: </Text>
                            <Text style={styles.resumeText}>{moment(details.planned_duration).format("HH:mm")}</Text>
                        </View> 
                    </View>
                </View>

                {
                    loraCoordinates?.length > 0 ? 
                        <Pressable style={styles.buttonLora} onPress={handleChangeCoordinate}>
                            <MaterialCommunityIcons name="crosshairs-gps" size={16} color="#fff" />
                            <Text style={{color: "#fff"}}>{buttonLabel}</Text>
                        </Pressable>
                    : 
                    null
                }
                
                <ScrollView style={styles.pointContainer}>
                    <View key={details?.point.id}>
                        <Pressable style={[styles.pointContent, detailsId === details?.point.id ? {borderBottomLeftRadius: 0, borderBottomRightRadius: 0, backgroundColor: "#eee"} : {borderRadius: 10}]} onPress={() => handleShowDetails(details?.point)}>
                            <View>
                                <View style={styles.pointItem}>
                                    <Text style={[styles.pointTitle, detailsId === details?.point.id ? {color: "#000"} : null]}>1. </Text>
                                    <Text style={[styles.pointTitle, detailsId === details?.point.id ? {color: "#000"} : null]}>{details?.point.point.name}</Text>
                                </View>
                                <View style={styles.pointItem}>
                                    <Text style={[styles.pointText, detailsId === details?.point.id ? {color: "#000"} : null]}>{details?.point.point.address}</Text>
                                </View>
                            </View>
                            {
                                detailsId === details?.point.id ? 
                                <FontAwesome name="angle-up" size={20} color="#000" />
                                :
                                <FontAwesome name="angle-down" size={20} color="#000" />
                            }
                        </Pressable>
                        {
                            detailsId === details?.point.id ? <View style={styles.details}>
                                <View style={styles.detailsContent}>
                                    <Text style={styles.detailsTitle}>Horário de Chegada</Text>
                                    <Text style={styles.detailsText}>{moment(details?.point.real_date).format("HH:mm")}</Text>
                                </View>
                                <View style={styles.detailsContent}>
                                    <Text style={styles.detailsTitle}>Embarque</Text>
                                    {
                                        details?.point.has_embarked ? 
                                        <FontAwesome name="check-circle" size={20} color="green" />
                                        :
                                        <FontAwesome name="times-circle" size={20} color="red" />
                                    }
                                </View>
                            </View>
                            : 
                            null
                        }
                    </View>
                </ScrollView>
            </View>
        </View>
    </PageDefault>
};

const styles = StyleSheet.create({
    content: {
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%"
    },
    mapContainer: {
        flex: 1.4,
        width: "100%",
        backgroundColor: "#ddd",
        overflow: "hidden",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    infosContainer: {
        flex: 1.8,
    },
    resumeInfosContainer: {
        backgroundColor: "#C36005",
        flex: .2,
        flexDirection: "row",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    line: {
        width: .5,
        alignItems: "center",
        height: "80%",
        marginVertical: "auto",
        flexDirection: "column",
        backgroundColor: "#fff",
    },
    resumeInfosContent: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 2
    },  
    initialAndStopContent: {
        flex: 1,
    },
    resumeTitle: {
        fontSize: 12,
        fontWeight: "bold",
        flexWrap: "wrap",
        textAlign: "center",
        color: "#fff"
    },
    resumeText: {
        color: "#fff",
        fontSize: 11
    },
    pointContainer: {
        width: "98%",
        flex: 1,
        height: "auto",
        display: "flex",
        margin: "auto",
        flexDirection: "column",
    },
    pointContent: {
        backgroundColor: "#fff",
        borderWidth: 1,
        marginTop: 10,
        height: 60,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    pointItem: {
        display: "flex",
        flexDirection: "row"
    },
    pointTitle: {
        color: "#090833",
        fontSize: 15,
        fontWeight: "bold"
    },
    pointText: {
        color: "#090833",
        fontSize: 13
    },
    details: {
        width: "99.5%",
        top: -1,
        margin: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        height: 60,
        paddingLeft: 10,
        backgroundColor: "#fff",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    detailsContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        rowGap: 2
    },  
    detailsTitle: {
        fontSize: 12,
        fontWeight: "bold",
        flexWrap: "wrap",
        textAlign: "center",
        color: "#000"
    },
    detailsText: {
        color: "#000",
        fontSize: 11
    },
    buttonLora: {
        borderColor: "#fff",
        borderWidth: 1,
        width: "90%",
        margin: "auto",
        borderRadius: 10,
        display: "flex",
        justifyContent:"center",
        alignItems: "center",
        flexDirection: "row",
        columnGap: 5,
        marginTop: 5,
        paddingVertical: 5
    }
});

export default ResponsibleScheduleHistoricDetails;