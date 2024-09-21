import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

const NotificationsList = () => {
    return <View style={styles.container}>
        <Text style={styles.text}>Tem notificação</Text>
        <Button mode="contained" style={styles.button}>
            Adicionar
        </Button>
    </View>
};

const styles = StyleSheet.create({
    container: {
    },
    text: {
        color: "#fff"
    },
    button: {
        backgroundColor: '#C36005',
    }
});

export default NotificationsList;