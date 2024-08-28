import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View} from "react-native";
import { disassociateDriverToSchool, getSchoolAssociatedByDriver, getSchoolByDriver } from "../../data/pointServices";
import { AuthContext } from "../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import PageDefault from "../../components/pageDefault/PageDefault";
import { getVehicleListByUser } from "../../data/vehicleServices";
import SchoolVehicleList from "./components/SchoolVehicleList";
import { getAssociationsByUser } from "../../data/vehiclePointServices";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const DriverSchools = () => {

    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [associationList, setAssociationList] = useState(null);
    const {userData} = useContext(AuthContext);

    const handleGoToSchoolVehicleDetails = (item) => {
        navigation.navigate("SchoolVehicleDetails", {schoolVehicleData: item});
    };

    useEffect(() => {
        const requestData = async() => {
            setIsLoading(true);

            const associations = await getAssociationsByUser(userData.id);

            if(associations.status === 200){
                setAssociationList(associations.data);
            }
            else{
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: "Erro ao listar associações",
                    visibilityTime: 3000,
                });

                navigation.goBack();
            }

            setIsLoading(false);
        };

        requestData();
    }, []);

    return <PageDefault headerTitle="Escolas e Veículos" loading={isLoading} navigation={navigation} backNavigation={"Perfil"}>
        {
            associationList?.length > 0 ?
            <SchoolVehicleList
                list={associationList}
                loading={isLoading}
                navigation={navigation}
            />
            :
            <>
                <View style={styles.withoutAssociation}>
                    <Text style={styles.withoutAssociationTitle}>Crie uma associação entre suas escolas e veículos</Text>
                    <View style={styles.initialButtonContainer}>
                        <Button
                            mode="contained"
                            onPress={handleGoToSchoolVehicleDetails}
                            style={styles.addButton}
                        >
                            Criar Aluno
                        </Button>
                    </View>
                </View>
            </>
        }
        
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
    withoutAssociation: {
        textAlign: "center",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        rowGap: 25,
        width: "100%"
    },
    withoutAssociationTitle: {
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DriverSchools;