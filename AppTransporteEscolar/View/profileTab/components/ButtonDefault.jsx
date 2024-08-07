import { Pressable, StyleSheet, Text, TextBase, View } from "react-native";

const ButtonDefault = ({icon, title, onClick}) => {
    return <Pressable onPress={onClick} style={styles.container}>
        <View style={styles.content}>
            <View style={styles.icon}>
                {icon}
            </View>
            <Text style={styles.title}>
                {title}
            </Text>
        </View>
    </Pressable>
};

const styles = StyleSheet.create({
    container: {
        width: "30%",
        height: "23%",
        maxHeight: "23%",
    },
    content: {
        backgroundColor: "#C36005",
        height: "100%",
        borderRadius: 5,
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        rowGap: 10
    },
    icon: {
    },
    title: {
        color: "#fff"
    }
});

export default ButtonDefault;