import { ScrollView, StyleSheet, View } from "react-native";
import PageDefault from "../../../components/pageDefault/PageDefault";
import { Card, Text } from "react-native-paper";

const SchoolsList = ({navigation, loading, route}) => {

    const {schoolList, vehicle} = route.params;

    const handleSelectSchool = (school) => {
        navigation.navigate("ConfirmDriverSchool", {school, vehicle});
    };

    return <PageDefault headerTitle="Selecione sua escola" navigation={navigation} loading={loading}>
        <View style={styles.scrollContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {schoolList?.map((school, index) => (
                    <Card key={index} style={styles.card} onPress={() => handleSelectSchool(school)}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.cardDetails}>                                            
                                <Text style={[styles.cardText, {marginTop:1, fontWeight: "bold"}]}>{school.name}</Text>
                                <Text style={styles.cardText}>{school.address}</Text>
                                <Text style={styles.cardText}>{school.neighborhood}</Text>
                                <Text style={styles.codeText}>{school.city} / {school.state}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
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

export default SchoolsList;

