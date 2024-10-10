import { StyleSheet, View } from "react-native";

const Card = ({data, key}) => {

    console.log(data)
    console.log(data)
    console.log(data)
    console.log(data)
    console.log("aaaaaaa")

    return <View style={styles.content} key={key}>
        <View style={styles.mapContainer}>

        </View>
        <View style={styles.infosContainer}>

        </View>
    </View>
};

const styles = StyleSheet.create({
    content: {
        backgroundColor: "white",
        justifyContent: "center",
        height: "22%",
        display: "flex", 
        flexDirection: "row",
        width: "95%"
    },
    mapContainer: {
        flex: 1.3,
        backgroundColor: "yellow"
    },
    infosContainer: {
        flex: 3
    }
});

export default Card;