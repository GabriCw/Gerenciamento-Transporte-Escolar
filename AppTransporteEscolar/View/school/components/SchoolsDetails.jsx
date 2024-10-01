import { StyleSheet, View } from "react-native";
import PageDefault from "../../../components/pageDefault/PageDefault";
import { Button, Text } from "react-native-paper";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { associateDriverToSchool, disassociateDriverToSchool } from "../../../data/pointServices";
import { AuthContext } from "../../../providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const SchoolsDetails = ({route}) => {

    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const {userData} = useContext(AuthContext);
    const {schoolData, isAssociation} = route.params;

    const handleAssociation = async() => {
        const body = {
            user_id: userData?.id,
            point_id: schoolData?.id
        };

        setLoading(true);

        const associate = await associateDriverToSchool(body);

        if(associate.status === 201){
            Toast.show({
                type: 'success',
                text1: 'Sucesso!',
                text2: "Associação feita com sucesso!",
                visibilityTime: 3000,
            });

            navigation.navigate("Perfil");
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: associate.data.detail,
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    const handleDisassociation = async() => {
        const body = {
            user_id: userData?.id,
            point_id: schoolData?.id
        };

        setLoading(true);

        const disassociate = await disassociateDriverToSchool(body);

        if(disassociate.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso!',
                text2: "Desassociação feita com sucesso!",
                visibilityTime: 3000,
            });

            navigation.navigate("Perfil");
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: disassociate.data.detail,
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    return <PageDefault headerTitle="Detalhes da Escola" loading={loading}>
        <View style={styles.viewContainter}>
            <View style={styles.cardContainer}>
                <View style={styles.schoolContainer}>
                    <View style={styles.nameYearContent}>
                        <View style={{display: "flex", flexDirection: "row", flex: 1, gap: 15, alignItems: "center"}}>
                            <Ionicons name="school" size={24} color="black" />
                            <Text style={styles.title}>{schoolData?.name}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.text}>{schoolData?.address}</Text>
                        <Text style={styles.text}>{schoolData?.neighborhood} - {schoolData?.city}/{schoolData?.state}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                {
                    isAssociation ? 
                        <Button
                        mode="contained"
                        onPress={handleAssociation}
                        style={styles.button}
                        >
                            Associar
                        </Button>
                        :
                        <Button
                            mode="contained"
                            onPress={handleDisassociation}
                            style={styles.button}
                        >
                            Desassociar
                        </Button>
                }
            </View>
        </View>
    </PageDefault>
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
    },
    viewContainter: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        marginBottom: "12%",
        width: "100%",
        alignItems: "center",
        rowGap: 20,
        padding: "5%"
    },
    cardContainer: {
        width: '100%',
        height: "auto",
        marginHorizontal: "auto",
        maxHeight: 400,
        backgroundColor: '#f0f0f0',
        borderColor: '#d0d0d0',
        borderWidth: 4,
        borderRadius: 10,
        padding: 10,
        overflow: 'hidden',
    },
    mainInfosContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingBottom: 10
    },
    iconContent: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingLeft: 1,
    },
    childIcon: {
        marginRight: 10,
        marginBottom: 8,
        fontSize: 60
    },
    nameYearContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    content: {
        flex: 1,
        paddingHorizontal: 5,
        display: "flex",
        rowGap: 5
    },
    nameYearContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    title: {
        color: '#000',
        fontSize: 22,
        marginBottom: 5,
        fontWeight: "bold",
        maxWidth: "70%",
    },  
    text: {
        color: '#000',
        fontSize: 18,
        marginBottom: 5,
    },
    codeContent: {
        display: "flex",
        flexDirection: "row",
        columnGap: 5,
        alignItems: "center"
    },
    colorBox: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
        backgroundColor: "#090833",
        textAlign: "center",
        paddingVertical: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontWeight: "bold"
    },
    codeText: {
        color: '#000',
        fontSize: 16,
        marginBottom: 5,
    },
    lineSeparator: {
        height: 1,
        backgroundColor: "#d0d0d0"
    },
    schoolContainer:{
        paddingVertical: 10,
        rowGap: 3,
        display: "flex",
    },
    schoolContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10
    },
    driverContainer:{
        paddingTop: 10,
        rowGap: 3,
        display: "flex",
    },
    driverContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10
    },
    buttonContainer: {
        display : "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%"
    },
    button: {
        backgroundColor: '#C36005',
        width: "40%",
        display: "flex"
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SchoolsDetails;