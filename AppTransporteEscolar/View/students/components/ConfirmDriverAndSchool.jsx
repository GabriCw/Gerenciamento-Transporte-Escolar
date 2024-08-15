import { StyleSheet, Text, View } from "react-native";
import Header from "../../../components/header/Header";
import { useContext, useState } from "react";
import { ActivityIndicator, Button } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { AuthContext } from "../../../providers/AuthProvider";
import { createStudent } from "../../../data/studentServices";
import Toast from "react-native-toast-message";

const ConfirmDriverAndSchool = ({navigation, route}) => {
    const {studentData} = route.params;
    const {userData} = useContext(AuthContext);
    
    const [loading, setLoading] = useState(false);

    const handleCreateStudent = async() => {
        setLoading(true);

        const body = {
            name: studentData.name,
            year: studentData.year,
            responsible_id: userData.id
        };

        const response = await createStudent(body);

        if(response.status === 201){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Cadastro realizado com sucesso!',
                visibilityTime: 3000,
            });

            navigation.goBack();
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao cadastrar',
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    return <View style={styles.view}>
        <Header navigation={navigation} title="Criar Aluno"/>
        <View style={styles.viewContainter}>
            <View style={styles.cardContainer}>
                <View style={styles.mainInfosContainer}>
                    <View style={styles.iconContent}>
                        <FontAwesome name="child" color="black" style={styles.childIcon} />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.nameYearContent}>
                            <Text style={styles.title}>{studentData.name}</Text>
                        </View>
                        <Text style={styles.text}>{studentData.year} anos</Text>
                    </View>
                </View>

                <View style={styles.lineSeparator}/>

                <View style={styles.schoolContainer}>
                    <View style={styles.schoolContent}>
                        <Text style={styles.colorBox}>Escola</Text>
                        <Text style={styles.text}>Jean Piaget</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>Avenida Presidente Wilson, 64</Text>
                        <Text style={styles.text}>Gonzaga - Santos/SP</Text>
                    </View>
                </View>

                <View style={styles.lineSeparator}/>

                <View style={styles.driverContainer}>
                    <View style={styles.driverContent}>
                        <Text style={styles.colorBox}>Motorista</Text>
                        <Text style={styles.text}>Carlos</Text>
                    </View>
                    <View>
                        <View style={styles.driverContent}>
                            <FontAwesome name="phone" size={24} color="black" />
                            <Text style={styles.text}>(13) 98119-3075</Text>
                        </View>
                        <View>
                            <Text>Código: asjsjkhas</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleCreateStudent}
                    style={styles.button}
                >
                    Confirmar
                </Button>
            </View>
        </View>

        {
            loading && <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#C36005" />
            </View>
        }
    </View>
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
        display: "flex",
    },
    schoolContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10
    },
    driverContainer:{
        paddingVertical: 10,
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

export default ConfirmDriverAndSchool;