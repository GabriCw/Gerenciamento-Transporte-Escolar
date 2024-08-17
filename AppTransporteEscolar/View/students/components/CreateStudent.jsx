import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import Header from "../../../components/header/Header";
import Toast from "react-native-toast-message";
import { getDriverDetailsByCode } from "../../../data/userServices";

const CreateStudent = ({navigation}) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVerifyDriverCode = async() => {
        console.log(student)
        if(!(student?.name !== null && student?.year !== null && student?.driverCode !== null)){
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Preencha todos os campos',
                visibilityTime: 3000,
            });

            return;
        }

        setLoading(true);

        const verifyCode = await getDriverDetailsByCode(student?.driverCode);

        if(verifyCode.status === 200){
            navigation.navigate("ConfirmDriverAndSchool", {studentData: student, driverData: verifyCode.data});
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Preencha todos os campos',
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    return <View style={styles.view}>
        <Header title="Criar Aluno" navigation={navigation}/>
        <View style={styles.container}>
            <TextInput
                label="Nome"
                value={student?.name}
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                onChangeText={(text) => setStudent({ ...student, name: text })}
                style={styles.input}
            />
            <TextInput
                label="Idade"
                value={student?.year}
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                keyboardType="numeric"
                onChangeText={(text) => setStudent({ ...student, year: text })}
                style={styles.input}
            />
            <TextInput
                label="Código Motorista"
                value={student?.driverCode}
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                keyboardType="numeric"
                onChangeText={(text) => setStudent({ ...student, driverCode: text })}
                style={styles.input}
            />
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleVerifyDriverCode}
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
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        display: "flex",
        flex: 1,
        justifyContent: "center"
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
    buttonContainer: {
        marginTop: 10,
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        display: "flex",
        flexDirection: "row"
    },
    button: {
        backgroundColor: '#C36005',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CreateStudent;