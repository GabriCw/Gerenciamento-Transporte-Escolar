import { FontAwesome5 } from "@expo/vector-icons";
import { useCallback, useContext, useState } from "react";
import { Linking } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button, Card } from "react-native-paper";
import { associateDriverToSchool } from "../../../data/pointServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import Header from "../../../components/header/Header";
import PageDefault from "../../../components/pageDefault/PageDefault";
import { associateVehicleToPoint } from "../../../data/vehicleServices";

const ConfirmDriverSchool = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(false);

    const {school, vehicle} = route.params;
    const {userData} = useContext(AuthContext);

    const handleAssociateVehicleToSchool = async() => {
        setIsLoading(true);

        const body = {
            vehicle_id: vehicle.id,
            point_id: school.id
        };

        const associate = await associateVehicleToPoint(body);

        console.log(associate.data)

        if(associate.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Escola e veículo associados com sucesso!',
                visibilityTime: 3000,
            });

            navigation.navigate("Perfil")
        }
        else{   
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao associar veículo à escola',
                visibilityTime: 3000,
            });
        }

        setIsLoading(false);
    };

    const OpenURLButton = ({url, children}) => {
        const handlePress = useCallback(async () => {
          const supported = await Linking.canOpenURL(url);
      
          if (supported) {
            await Linking.openURL(url);
          } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
          }
        }, [url]);
      
        return <Button onPress={handlePress}>{children}</Button>;
    };

    return <PageDefault headerTitle="Detalhes da escola" loading={isLoading} navigation={navigation}>
        <View style={styles.content}>
            <View style={styles.scrollContainer}>
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.cardDetails}>                                            
                            <Text style={[styles.cardText, {marginTop:1, fontWeight: "bold"}]}>{vehicle.plate}</Text>
                            <Text style={styles.cardText}>{vehicle.model} - {vehicle.color}</Text>
                            <Text style={styles.cardText}>{vehicle.year}</Text>
                            {
                                vehicle.code !== "" && <Text style={styles.codeText}>{vehicle.code}</Text>
                            }
                        </View>
                    </Card.Content>
                </Card>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.cardTitle}>{school.name}</Text>
                    <Text style={styles.cardText}>{school.address}</Text>
                    <Text style={styles.cardText}>{school.neighborhood}</Text>
                    <Text style={styles.codeText}>{school.city} / {school.state}</Text>
                    <OpenURLButton url={`https://www.google.com/maps?q=${school.lat},${school.lng}`}>Veja no Google Maps</OpenURLButton>
                </ScrollView>
            </View>
            <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleAssociateVehicleToSchool}
                        style={styles.addButton}
                    >
                        Associar
                    </Button>
            </View>
        </View>
    </PageDefault>
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
    },
    text: {
        fontSize: 25,
        color: '#FFF',
        margin: 20,
        marginBottom: 40,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        width: "100%",
        justifyContent: "center"
    },
    scrollContainer: {
        width: '90%',
        height: "inherit",
        backgroundColor: '#f0f0f0',
        borderColor: '#d0d0d0',
        borderWidth: 4,
        borderRadius: 10,
        padding: 10,
        overflow: 'hidden',
    },
    scrollContent: {
        alignItems: 'center',
    },
    card: {
        width: '95%',
        marginVertical: 8,
    },
    icon: {
        marginRight: 10,
        marginBottom: 8,
    },
    modalContainer: {
        backgroundColor: '#090833',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    input: {
        marginBottom: 10,
        fontSize: 20,
        color: '#FFF',
    },
    saveButton: {
        backgroundColor: '#C36005',
        marginTop: 20,
    },
    addButton: {
        backgroundColor: '#C36005',
    },
    cardText: {
        color: '#000',
        fontSize: 18,
        marginBottom: 5,
    },
    codeText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
        backgroundColor: "#090833",
        textAlign: "center",
        width: "70%"
    },
    cardTitle: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    header: {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        marginLeft: 20,
        marginTop: 50,
        backgroundColor: '#090833',
    },
    buttonBack: {
        width: 90,
        backgroundColor: '#C36005',
        marginVertical: 10,
    },
    buttonLabel: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalTitle: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        alignItems: 'center',
    },
    cardDetails: {
        flex: 1,
    },
    iconActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 20,
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        display: "flex",
        flexDirection: "row"
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ConfirmDriverSchool;