import { FontAwesome5 } from "@expo/vector-icons";
import { useCallback, useContext, useState } from "react";
import { Linking } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button, Card } from "react-native-paper";
import { associateDriverToSchool } from "../../../data/pointServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";

const ConfirmDriverSchool = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(false);

    const {schoolData} = route.params;
    const {userData} = useContext(AuthContext);

    const handleAssociateDriverToSchool = async() => {
        setIsLoading(true);

        const body = {
            user_id: userData.id,
            point_id: schoolData.id
        };

        const associate = await associateDriverToSchool(body)

        if(associate.status === 201){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Escola associada com sucesso!',
                visibilityTime: 3000,
            });

            navigation.navigate("Perfil")
        }
        else{   
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao associar à escola',
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

    return <View style={styles.view}>
        <View style={styles.header}>
            <Button
                onPress={() => navigation.goBack()}
                style={styles.buttonBack}
                labelStyle={styles.buttonLabel}
            >
                <Text>Voltar</Text>
            </Button>
        </View>
        <View style={styles.content}>
            <Text style={styles.text}>Detalhes da escola</Text>
            <View style={styles.scrollContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.cardTitle}>{schoolData.name}</Text>
                    <Text style={styles.cardText}>{schoolData.address}</Text>
                    <Text style={styles.cardText}>{schoolData.neighborhood}</Text>
                    <Text style={styles.codeText}>{schoolData.city} / {schoolData.state}</Text>
                    <OpenURLButton url={`https://www.google.com/maps?q=${schoolData.lat},${schoolData.lng}`}>Veja no Google Maps</OpenURLButton>
                </ScrollView>
            </View>
            <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleAssociateDriverToSchool}
                        style={styles.addButton}
                    >
                        Associar
                    </Button>
            </View>
        </View>
        {isLoading && (
            <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#C36005" />
            </View>
        )}
    </View>
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
        marginTop: 30,
        alignItems: 'center',
    },
    scrollContainer: {
        width: '90%',
        height: "inherit",
        maxHeight: 400,
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