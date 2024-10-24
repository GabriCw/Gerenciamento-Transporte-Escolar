import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Header = ({title, specificNavigation, titleSize}) => {

    const navigation = useNavigation();

    const handleNavigation = () => {
        if(specificNavigation){
            if (typeof specificNavigation === 'function') {
                specificNavigation(); 
            }
            else{
                navigation.navigate(specificNavigation);
            }
        }
         else {
            navigation.goBack(); 
        }
    };

    return <View style={styles.container}>
        <View style={styles.content}>
            <Pressable
                onPress={handleNavigation}
                style={styles.iconContainer}
            >
                <Ionicons style={styles.iconContent} name="arrow-back" size={24} color="white" />
            </Pressable>
            <Text style={[styles.title, titleSize ? {fontSize: titleSize} : null]}>{title}</Text>
        </View>
    </View>
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "12%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#090833",
    },
    content: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        paddingBottom: "5%",
        justifyContent: "center",
        height: "100%",
        position: "relative"
    },
    iconContainer: {
        position: "absolute",
        left: "2.5%",
        paddingBottom: "5%"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default Header;