import { StyleSheet, View } from "react-native";
import Header from "../header/Header";
import { ActivityIndicator } from "react-native-paper";

const PageDefault = ({children, headerTitle, loading, withoutCentering, backNavigation}) => {
    return <View style={styles.view}>
        {headerTitle && <Header title={headerTitle} specificNavigation={backNavigation}/>}
        {
            !loading ? 
                <View style={!withoutCentering ? styles.content : styles.contentWithoutCentering}>
                    {children}
                </View>
                :
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#C36005" />
                </View>
        }
    </View>
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
        width: "100%"
    },
    content: {
        width: "100%",
        flex: 1,
        height: "100%",
        alignItems: 'center',
        justifyContent: "center",
        position: "relative"
    },
    contentWithoutCentering: {
        width: "100%",
        flex: 1,
        height: "100%",
        alignItems: 'center',
        position: "relative"
    },
    loadingOverlay: {
        backgroundColor: '#090833',
        justifyContent: 'center',
        height: "85%",
        alignItems: 'center',
    },
});

export default PageDefault;