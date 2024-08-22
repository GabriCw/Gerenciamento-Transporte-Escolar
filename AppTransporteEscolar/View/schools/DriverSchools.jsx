import { useCallback, useContext, useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button, Card, IconButton } from "react-native-paper";
import { disassociateDriverToSchool, getAllSchoolList, getSchoolByDriver, getSchoolByUser } from "../../data/pointServices";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { AuthContext } from "../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import Header from "../../components/header/Header";
import PageDefault from "../../components/pageDefault/PageDefault";
import { getVehicleListByUser } from "../../data/vehicleServices";

const DriverSchools = ({navigation}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [actualSchool, setActualSchool] = useState(null);
    const {userData} = useContext(AuthContext);

    const handleListVehicles = async() => {
        setIsLoading(true);

        const vehicles = await getVehicleListByUser(userData.id);

        if(vehicles.status === 200){
            navigation.navigate("VehiclesList", {vehicleList: vehicles.data})
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao listar veículos',
                visibilityTime: 3000,
            });
            navigation.goBack();
        }

        setIsLoading(false);
    };

    const handleDisassociate = async() => {
        setIsLoading(true);

        const body = {
            user_id: userData.id,
            point_id: actualSchool?.id
        };  

        const disassociate = await disassociateDriverToSchool(body)

        if(disassociate.status === 200){
            await handleListVehicles();

            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Escola desassociada com sucesso!',
                visibilityTime: 3000,
            });
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao desassociar da escola',
                visibilityTime: 3000,
            });
        }

        setIsLoading(false);
    };

    useEffect(() => {
        const requestData = async() => {
            setIsLoading(true);

            const hasSchool = await getSchoolByDriver(userData.id);

            if(hasSchool.status === 200){
                if(hasSchool.data !== null){
                    setActualSchool(hasSchool.data);
                }
                else{
                    await handleListVehicles();
                }
            }
            else{
                await handleListVehicles();
            }

            setIsLoading(false);
        };

        requestData();
    }, []);

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

    return <PageDefault headerTitle={actualSchool !== null ? "Minha Escola" : "Selecione sua escola"} loading={isLoading} navigation={navigation}>
        <View style={styles.content}>
            <View style={[styles.scrollContainer, {height: "inherit"}]}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.cardTitle}>{actualSchool?.name}</Text>
                    <Text style={styles.cardText}>{actualSchool?.address}</Text>
                    <Text style={styles.cardText}>{actualSchool?.neighborhood}</Text>
                    <Text style={styles.codeText}>{actualSchool?.city} / {actualSchool?.state}</Text>
                    <OpenURLButton url={`https://www.google.com/maps?q=${actualSchool?.lat},${actualSchool?.lng}`}>Veja no Google Maps</OpenURLButton>
                </ScrollView>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleDisassociate}
                    style={styles.addButton}
                >
                    Desassociar
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
        height: "100%",
        width: "100%",
        alignItems: 'center',
        justifyContent: "center",
    },
    scrollContainer: {
        width: '90%',
        height: "90%",
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

export default DriverSchools;