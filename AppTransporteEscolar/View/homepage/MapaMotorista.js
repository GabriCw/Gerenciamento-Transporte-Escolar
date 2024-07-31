import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapaMotorista = ({ navigation }) => {
    const [region, setRegion] = useState(null);
    const [heading, setHeading] = useState(0);
    const mapRef = useRef(null);
    const inactivityTimeout = useRef(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

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
                    if (location) {
                        const { latitude, longitude, heading } = location.coords;
                        if (!isUserInteracting) {
                            setRegion({
                                latitude,
                                longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            });
                        }
                        setHeading(heading || 0);
                    } else {
                        console.log('Location update failed');
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
    }, [isUserInteracting]);

    const recenterMap = () => {
        if (region) {
            setIsUserInteracting(false);
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
    };

    const handleUserInteraction = () => {
        setIsUserInteracting(true);
        if (inactivityTimeout.current) {
            clearTimeout(inactivityTimeout.current);
        }
        inactivityTimeout.current = setTimeout(recenterMap, 5000); // 5 segundos de inatividade
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
                            zoom: 18, // Ajuste o zoom conforme necessário
                        }}
                    >
                        <Marker
                            coordinate={region}
                            title="Sua localização"
                            anchor={{ x: 0.5, y: 0.5 }}
                            rotation={heading} // Define a rotação do marcador
                        >
                            <Image
                                source={require('../../assets/icons/van.png')}
                                style={styles.vanImage}
                            />
                        </Marker>
                    </MapView>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%'
    },
    vanImage: {
        width: 30,
        height: 60,
    },
});

export default MapaMotorista;
