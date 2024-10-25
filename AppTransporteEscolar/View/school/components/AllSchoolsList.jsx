import { useEffect, useState } from "react";
import PageDefault from "../../../components/pageDefault/PageDefault";
import { getAllSchoolList } from "../../../data/pointServices";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, ActivityIndicator, Text } from 'react-native-paper';
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';

const AllSchoolsList = ({route}) => {

    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [schools, setSchools] = useState([]);

    const {schoolsIds} = route.params;

    useEffect(() => {
        const requestData = async() => {
            setIsLoading(true);

            const list = await getAllSchoolList();
            
            if(list.status === 200){
                const schoolsResponse = list.data.map(item => {
                    if(schoolsIds?.includes(item.id)){
                        return {...item, checked: true}
                    }   
                    return {...item, checked: false}
                });

                setSchools(schoolsResponse);
            }
            else{
                setSchools([]);
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'Erro ao exibir escolas',
                    visibilityTime: 3000,
                });
                navigation.goBack();
            }

            setIsLoading(false);
        };

        requestData();
    }, []);

    const handleGoToSchoolDetails = (item) => {
        navigation.navigate("SchoolsDetails", {schoolData: item, isAssociation: true});
    };

    return <PageDefault headerTitle="Todas Escolas" loading={isLoading}>
        <View style={styles.content}>
            <View style={styles.scrollContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {schools.map((school, index) => {
                        return school.checked ? <Card key={index} style={styles.card}>
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.cardDetails}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="school" size={25} color="black" />
                                        <Text style={[styles.cardText, {marginTop:1, fontWeight: "bold"}]}>{school.name}</Text>
                                    </View>
                                    <Text style={styles.cardText}>{school.address}</Text>
                                    <View style={styles.subtitleCardContainer}>
                                        <Text style={styles.subtitleCardText}>Já adicionado</Text>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                        :
                        <Card key={index} style={styles.card} onPress={() => handleGoToSchoolDetails(school)}>
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.cardDetails}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="school" size={25} color="black" />
                                        <Text style={[styles.cardText, {marginTop:1, fontWeight: "bold"}]}>{school.name}</Text>
                                    </View>
                                    <Text style={styles.cardText}>{school.address}</Text>
                                </View>
                                <AntDesign name="rightcircle" size={24} color="black"/>
                            </Card.Content>
                        </Card>
                    })}
                </ScrollView>
            </View>
        </View>
    </PageDefault>
};

const styles = StyleSheet.create({
    withoutStudent: {
        textAlign: "center",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        rowGap: 25,
        width: "100%"
    },
    withoutStudentTitle: {
        color: "#fff",
        fontSize: 20,
        width: "80%",
        textAlign: "center",
        fontWeight: "bold"
    },
    initialButtonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        columnGap: 15,
        width: "100%"
    },  
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
        flexWrap: "wrap",
        maxWidth: "90%",
        fontSize: 18,
        marginBottom: 5,
    },
    subtitleCardContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    subtitleCardText: {
        color: '#fff',
        fontSize: 12,
        width: 100,
        textAlign: "center",
        padding: 2,
        marginBottom: 5,
        backgroundColor: "#090833",
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    cardDetails: {
        flex: 1,
        display: "flex",
        gap: 10
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5
    },
});

export default AllSchoolsList;