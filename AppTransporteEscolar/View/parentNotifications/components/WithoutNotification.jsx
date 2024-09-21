import { StyleSheet, Text, View } from "react-native";

const WithoutNotification = () => {
    return <View>
        <Text style={styles.text}>Não tem</Text>
    </View>
};

const styles = StyleSheet.create({
    container: {
    },
    text: {
        color: "#fff"
    }
});

export default WithoutNotification;