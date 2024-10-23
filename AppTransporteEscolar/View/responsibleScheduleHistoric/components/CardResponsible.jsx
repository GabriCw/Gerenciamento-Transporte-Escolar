import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { getHistoricDriverDetail } from "../../../data/scheduleServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";

const CardResponsible = ({data, index, setLoading}) => {
    const mapRef = useRef(null);
    const { userData } = useContext(AuthContext);
    const navigation = useNavigation(); 
    const [coordinates, setCoordinates] = useState([]);
    const [loraCoordinates, setLoraCoordinates] = useState([]);

    const handleScheduleDetails = async() => {
        setLoading(true);

        const response = await getHistoricDriverDetail(data.schedule.id, userData.id);

        if(response.status === 200){
            navigation.navigate("DriverScheduleHistoricDetails", {coordinates: coordinates, details: response.data, loraCoordinates: loraCoordinates});
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: "Erro ao trazer os detalhes",
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    useEffect(() => {
        const formatCoordinates = data?.coordinates?.map(item => ({
            latitude: item.lat,
            longitude: item.lng
        }));

        setCoordinates(formatCoordinates);    
        
        const formatLoraCoordinates = data?.coordinates_lora?.map(item => ({
            latitude: item.lat,
            longitude: item.lng
        }));

        setLoraCoordinates(formatLoraCoordinates);
    }, [data]);

    useEffect(() => {
        setTimeout(() => {
            if (mapRef.current && coordinates.length > 0) {
                mapRef.current.fitToCoordinates(coordinates, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, // Ajuste de espaçamento
                    animated: false
                });
            }
        }, 100);
    }, [coordinates]);

    return <View style={styles.content} key={index}>
        <View style={styles.mapContainer}>
            {
                coordinates.length > 0 ? <MapView
                    style={styles.map}
                    ref={mapRef}
                    initialRegion={{
                        latitude: coordinates[0]?.latitude,
                        longitude: coordinates[0]?.longitude,
                        latitudeDelta: 0.2,
                        longitudeDelta: 0.2,
                    }}
                >
                    <Polyline
                        coordinates={coordinates}
                        strokeColor="#090833"
                        strokeWidth={5}
                    />
                </MapView>
                :
                null
            }
            </View>
        <Pressable style={styles.infosContainer} onPress={handleScheduleDetails}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{data.schedule.name}</Text>
                <AntDesign name="rightcircle" size={24} color="black"/>
            </View>
            
            <View style={styles.datesContainer}>
                <View>
                    <Text style={styles.label}>Início</Text>
                    <Text>{moment(data.schedule.initial_date).format("DD/MM/YY HH:mm")}</Text>
                </View>

                <View>
                    <Text style={styles.label}>Final</Text>
                    <Text>{moment(data.schedule.real_end_date).format("DD/MM/YY HH:mm")}</Text>
                </View>
            </View>
        </Pressable>
    </View>
};

const styles = StyleSheet.create({
    content: {
        backgroundColor: "white",
        justifyContent: "center",
        height: 120,
        display: "flex",
        flexDirection: "row",
        width: "95%",
        borderRadius: 10
    },
    mapContainer: {
        flex: 1.4,
        backgroundColor: "#ddd",
        borderRadius: 10,
        overflow: "hidden", // Para garantir que o mapa respeite os cantos arredondados
    },
    map: {
        width: "100%",
        height: "100%",
    },
    infosContainer: {
        flex: 3,
        paddingLeft: 10,
        paddingRight: 5,
        paddingVertical: 5,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center"
    },  
    title: {
        fontSize: 16,
        fontWeight: "bold",
        flex: .95,
        flexWrap: "wrap"
    },
    datesContainer: {
        flex: 1,
        alignItems: "flex-end",
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 5,
    },
    label: {
        color: "#090833",
        fontWeight: "bold"
    }
});

export default CardResponsible;