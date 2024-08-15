import { FontAwesome } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button, Card, Portal, Provider } from "react-native-paper";
import { associationStudent } from "../../../data/studentServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import Header from "../../../components/header/Header";

const ConfirmStudentAssociation = ({route, navigation}) => {
    const [isLoading, setIsLoading] = useState(false);

    const {studentData} = route.params;
    const {userData} = useContext(AuthContext);
    
    const handleCancel = () => {
        navigation.goBack();
    };

    const handleConfirmAssociation = async() => {
        setIsLoading(true);

        const associationBody = {
            responsible_id: userData.id,
            student_id: studentData.id
        };

        const association = await associationStudent(associationBody);

        if(association.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Associação realizada com sucesso!',
                visibilityTime: 3000,
            });

            navigation.navigate("Alunos");
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: association.data.detail,
                visibilityTime: 3000,
            });
        }

        setIsLoading(false);
    };

    return <Provider>
    <Portal.Host>
        <View style={styles.view}>
            <Header title="Aluno identificado!" navigation={navigation}/>
            <View style={styles.content}>
                <Text style={styles.subtext}>Para se associar, confirme abaixo</Text>
                <View style={styles.scrollContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <Card style={styles.card}>
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome name="child" size={45} color="black" style={styles.icon} />
                                </View>
                                <View style={styles.cardDetails}>
                                    <Text style={[styles.cardText, {marginTop:1, fontWeight: "bold"}]}>{studentData.name}</Text>
                                    <Text style={styles.cardText}>{studentData.year} anos</Text>
                                    <Text style={styles.codeText}>{studentData.code}</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </ScrollView>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleConfirmAssociation}
                        style={styles.addButton}
                    >
                        Confirmar
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleCancel}
                        style={styles.addButton}
                    >
                        Cancelar
                    </Button>
                </View>
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#C36005" />
                    </View>
                )}
            </View>
        </View>
    </Portal.Host>
</Provider>
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
    },
    text: {
        fontSize: 25,
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subtext: {
        fontSize: 20,
        color: '#FFF',
        margin: 30,
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
        height: "50%",
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
        marginTop: 10,
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


export default ConfirmStudentAssociation;