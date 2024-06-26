import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const TelaHome = () => {
    const [region, setRegion] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        })();
    }, []);

    if (!region) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Você Logou com Sucesso!</Text>
                        <MapView
                            style={styles.map}
                            region={region}
                            onRegionChangeComplete={(region) => setRegion(region)}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                        >
                            <Marker coordinate={region} />
                        </MapView>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        marginLeft: 20,
        marginTop: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '15%',
    },
    map: {
        width: '100%',
        height: 400,
    },
});

export default TelaHome;
