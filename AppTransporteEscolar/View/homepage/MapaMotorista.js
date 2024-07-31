import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapaMotorista = ({ navigation }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [heading, setHeading] = useState(0);

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
                    setUserLocation(location.coords);
                    setHeading(location.coords.heading || 0);
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
                    timeInterval: 1000, // Atualiza a cada 5 segundos
                    distanceInterval: 1, // Ou a cada 1 metros
                },
                (location) => {
                    if (location) {
                        setUserLocation(location.coords);
                        setHeading(location.coords.heading || 0);
                    } else {
                        console.log('Location update failed');
                    }
                }
            );
        };

        if (userLocation) {
            startLocationUpdates();
        }

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [userLocation]);

    return (
        <View style={styles.view}>
            <View style={styles.content}>
                {userLocation && (
                    <MapView
                        style={styles.map}
                        showsUserLocation={false}
                        showsMyLocationButton={false}
                        showsCompass={false}
                        showsTraffic={true}
                        showsBuildings={false}
                        pitchEnabled={false}
                        initialRegion={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                            latitudeDelta: 0.0122,
                            longitudeDelta: 0.0121,
                        }}
                    >
                        <Marker
                            coordinate={userLocation}
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
