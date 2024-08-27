import { useContext, useEffect, useState } from "react";
import { StyleSheet} from "react-native";
import { disassociateDriverToSchool, getSchoolAssociatedByDriver, getSchoolByDriver } from "../../data/pointServices";
import { AuthContext } from "../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import PageDefault from "../../components/pageDefault/PageDefault";
import { getVehicleListByUser } from "../../data/vehicleServices";
import SchoolVehicleList from "./components/SchoolVehicleList";

const DriverSchools = ({navigation}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [actualSchool, setActualSchool] = useState(null);
    const {userData} = useContext(AuthContext);

    const handleListVehicles = async() => {
        setIsLoading(true);

        const vehicles = await getSchoolAssociatedByDriver(userData.id);

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

            const hasSchool = await getSchoolAssociatedByDriver(userData.id);

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

    return <PageDefault headerTitle="Minha Escola" loading={isLoading} navigation={navigation}>
        <SchoolVehicleList
            list={actualSchool}
            loading={isLoading}
            navigation={navigation}
        />
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