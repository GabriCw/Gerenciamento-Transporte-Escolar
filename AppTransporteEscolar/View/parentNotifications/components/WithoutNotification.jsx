import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

const WithoutNotification = () => {

    const navigation = useNavigation();

    const handleGoToCreateNotification = () => {
        navigation.navigate("CreateNotification");
    };

    return <View style={styles.container}>
        <Text style={styles.title}>Crie uma ocorrência para seu aluno</Text>
        <View style={styles.buttonContainer}>
            <Button
                mode="contained"
                onPress={handleGoToCreateNotification}
                style={styles.button}
            >
                Criar Ocorrência
            </Button>
        </View>
    </View>
};

const styles = StyleSheet.create({
    container: {
        textAlign: "center",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        rowGap: 25,
        width: "100%"
    },
    title: {
        color: "#fff",
        fontSize: 20,
        width: "80%",
        textAlign: "center",
        fontWeight: "bold"
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        columnGap: 15,
        width: "100%"
    },
    button: {
        backgroundColor: '#C36005',
    }
});

export default WithoutNotification;