import moment from "moment";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "react-native-paper";
import PageDefault from "../../../components/pageDefault/PageDefault";

const PastNotificationsList = ({route}) => {

    const {pastList} = route.params;

    return <PageDefault headerTitle="Histórico de Ocorrências">
        <View style={styles.content}>
            <View style={styles.scrollContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {pastList?.map((item, index) => (
                        <Card key={index} style={styles.card}>
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.cardDetails}>
                                    <Text style={[styles.cardText, {marginTop:1, fontWeight: "bold"}]}>{item.student.name}</Text>
                                    <Text style={styles.cardText}>{moment(item.inative_day).format("DD/MM/YY HH:mm")}</Text>
                                    <Text style={styles.cardText}>{item.period}</Text>
                                </View>
                                {
                                    item.canceled && <View style={styles.changeButtonContainer}>
                                        <Text style={styles.changeButtonText}>Cancelado</Text>
                                    </View>
                                }
                            </Card.Content>
                        </Card>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.textAssociationContainer}>
                <Text style={styles.textAssociation}>Total de {pastList?.length} ocorrência(s)</Text>
            </View>
        </View>
    </PageDefault>
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
        maxHeight: "85%",
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
    textAssociationContainer: {
        position: "absolute",
        bottom: "5%",
        backgroundColor: "#C36005",
        borderRadius: "50%"
    },
    textAssociation: {
        color: "#fff",
        paddingVertical: "2%",
        paddingHorizontal: "5%",
        fontWeight: "bold",
        fontSize: 14,
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

export default PastNotificationsList;