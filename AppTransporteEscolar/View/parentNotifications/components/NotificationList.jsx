import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";

const NotificationsList = ({activeList, pastList}) => {

    const navigation = useNavigation();

    const handleCancelNotification = (item) => {
        Alert.alert('Cancelar ocorrência', 'Confirma o cancelamento desta ocorrência?', [
            {
              text: 'Voltar',
              style: 'cancel',
            },
            {text: 'Confirmar', onPress: () => handleCancelNotificationConfirm(item)},
        ]);
    };

    const handleCancelNotificationConfirm = (item) => {
        alert("cancelei")
    };

    const handleGoToCreateNotification = () => {
        navigation.navigate("CreateNotification");
    };

    return <View style={styles.content}>
        <View style={styles.scrollContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {activeList?.map((item, index) => (
                    <Card key={index} style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.cardDetails}>
                                <Text style={[styles.cardText, {marginTop:1, fontWeight: "bold"}]}>{item.student.name}</Text>
                                <Text style={styles.cardText}>{moment(item.inative_day).format("DD/MM/YY HH:mm")}</Text>
                                <Text style={styles.cardText}>{item.period}</Text>
                            </View>
                            <Pressable
                                onPress={() => handleCancelNotification(item)}
                                style={styles.changeButtonContainer}
                            >
                                <Text style={styles.changeButtonText}>Cancelar</Text>
                            </Pressable>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
            <Button
                mode="contained"
                onPress={handleGoToCreateNotification}
                style={styles.addButton}
            >
                Criar Ocorrência
            </Button>
        </View>

        <Pressable hitSlop={20} style={{position: "absolute", bottom: "5%"}} onPress={() => handleAssociationModalToggle()}>
            <Text style={styles.textAssociation}>Ver histórico de ocorrências ({pastList?.length})</Text>
        </Pressable>
</View>
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        width: "100%",
        alignItems: 'center',
        zIndex: 1,
        position: "relative"
    },
    scrollContainer: {
        width: '90%',
        marginTop: 10,
        flex: 3,
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
        position: "absolute",
        marginLeft: 20,
        backgroundColor: '#090833',
        top: 50
    },
    buttonBack: {
        backgroundColor: '#C36005',
        zIndex: 2
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
        flex: 1,
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        display: "flex",
        flexDirection: "row"
    },
    textAssociation: {
        color: "#C36005",
        fontWeight: "bold",
        fontSize: 14,
        textDecorationLine: "underline"
    },
    changeButtonContainer: {
        backgroundColor: '#C36005',
        borderRadius: 5,
        paddingVertical: "1.5%",
        paddingHorizontal: "3%",
    },
    changeButtonContainer: {
        backgroundColor: '#D13A1D',
        borderRadius: 5,
        paddingVertical: "1.5%",
        paddingHorizontal: "3%",
    },
    changeButtonText: {
        fontSize: 15,
        color: "#fff"
    },
});

export default NotificationsList;