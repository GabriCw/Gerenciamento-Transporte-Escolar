import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

const DeliveredCard = ({ child, onDeliver }) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: child.photo }} style={styles.photo} />
            <Text style={styles.name}>{child.name}</Text>
            <Button title="Entregue" onPress={onDeliver} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFFDD',
        width: '95%',
        padding: 20,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        marginBottom: 20,
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default DeliveredCard;
