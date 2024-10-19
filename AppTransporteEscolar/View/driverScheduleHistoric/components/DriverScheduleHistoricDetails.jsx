import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import PageDefault from "../../../components/pageDefault/PageDefault";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Button } from "react-native-paper";

const DriverScheduleHistoricDetails = ({route}) => {
    
    const mapRef = useRef(null);
    const { coordinates, loraCoordinates, details } = route.params;

    const [detailsId, setDetailsId] = useState(null);
    const [actualCoordinate, setActualCoordinate] = useState(coordinates);
    const [hasChangedCoord, setHasChangedCoord] = useState(false);
    const [stops, setStops] = useState([]);

    const handleShowDetails = (value) => {
        if(detailsId){
            setDetailsId(null);
            return;
        }

        setDetailsId(value.id);
    };

    useEffect(() => {

    }, [details]);

    const handleChangeCoordinate = () => {
        if(!hasChangedCoord){
            setActualCoordinate(loraCoordinates);
            setHasChangedCoord(true);
        }
        else{
            setActualCoordinate(coordinates);
            setHasChangedCoord(false);
        }
    };

    return <PageDefault headerTitle="Detalhe da Viagem" withoutCentering={true}>
        <View style={styles.content}>
            <View style={styles.mapContainer}> 
                {
                    actualCoordinate.length > 0 ? 
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

                        {
                            details?.points?.map(item => (<Marker
                                coordinate={{latitude: item.point.lat, longitude: item.point.lng}}
                            />))
                        }
                        
                    </MapView>
                    :
                    null
                }
            </View>
            <View style={styles.infosContainer}>
                <View style={styles.resumeInfosContainer}>
                    <View style={styles.resumeInfosContent}>
                        <Text style={styles.resumeTitle}>Início</Text>
                        <Text style={styles.resumeText}>{moment(details.initial_date).format("DD/MM/YY")}</Text>
                        <Text style={styles.resumeText}>{moment(details.initial_date).format("HH:mm")}</Text>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.resumeInfosContent}>
                        <Text style={styles.resumeTitle}>Fim</Text>
                        <Text style={styles.resumeText}>{moment(details.real_end_date).format("DD/MM/YY")}</Text>
                        <Text style={styles.resumeText}>{moment(details.real_end_date).format("HH:mm")}</Text>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.resumeInfosContent}>
                        <Text style={styles.resumeTitle}>Duração</Text>
                        <Text style={styles.resumeText}>{moment(details.real_duration).format("HH:mm")}</Text>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.resumeInfosContent}>
                        <Text style={styles.resumeTitle}>Duração Planejada</Text>
                        <Text style={styles.resumeText}>{moment(details.planned_duration).format("HH:mm")}</Text>
                    </View>
                </View>
                <Pressable onPress={handleChangeCoordinate}><Text style={{color: "#fff"}}>trocar coordenadas</Text></Pressable>

                <ScrollView style={styles.pointContainer}>
                    {
                        details?.points.map((item, index) => (
                            <View key={item.id}>
                                <Pressable style={[styles.pointContent, detailsId === item.id ? {borderBottomLeftRadius: 0, borderBottomRightRadius: 0, backgroundColor: "#C36005"} : {borderRadius: 10}]} onPress={() => handleShowDetails(item)}>
                                    <View>
                                        <View style={styles.pointItem}>
                                            <Text style={[styles.pointTitle, detailsId === item.id ? {color: "#fff"} : null]}>{index + 1}. </Text>
                                            <Text style={[styles.pointTitle, detailsId === item.id ? {color: "#fff"} : null]}>{item.point.name}</Text>
                                        </View>
                                        <View style={styles.pointItem}>
                                            <Text style={[styles.pointText, detailsId === item.id ? {color: "#fff"} : null]}>{item.point.address}</Text>
                                        </View>
                                    </View>
                                    {
                                        detailsId === item.id ? 
                                        <FontAwesome name="angle-up" size={20} color="#fff" />
                                        :
                                        <FontAwesome name="angle-down" size={20} color="#000" />
                                    }
                                </Pressable>
                                {
                                    detailsId === item.id ? <View style={styles.details}>
                                        <View style={styles.detailsContent}>
                                            <Text style={styles.detailsTitle}>Data de Embarque</Text>
                                            <Text style={styles.detailsText}>{moment(item.real_date).format("DD/MM/YY")}</Text>
                                            <Text style={styles.detailsText}>{moment(item.real_date).format("HH:mm")}</Text>
                                        </View>
                                        <View style={styles.detailsContent}>
                                            <Text style={styles.detailsTitle}>Data Planejada</Text>
                                            <Text style={styles.detailsText}>Em breve</Text>
                                        </View>
                                        <View style={styles.detailsContent}>
                                            <Text style={styles.detailsTitle}>Embarque</Text>
                                            {
                                                item.hasEmbarked ? 
                                                <FontAwesome name="check-circle" size={20} color="#090833" />
                                                :
                                                <FontAwesome name="times-circle" size={20} color="#090833" />
                                            }
                                        </View>
                                    </View>
                                    : 
                                    null
                                }
                            </View>
                        ))
                    }
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
        alignItems: "center",
        rowGap: 2
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
        width: "95%",
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
});

export default DriverScheduleHistoricDetails;