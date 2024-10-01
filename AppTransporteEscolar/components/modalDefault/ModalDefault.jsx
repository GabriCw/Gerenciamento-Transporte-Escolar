import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Portal, Modal, Button, ActivityIndicator } from "react-native-paper";

const ModalDefault = ({open, onClose, title, children, loading}) => {
    return <Portal>
                <Modal visible={open} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
                    <View style={styles.headerContent}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <Text style={styles.closeButton} onPress={onClose}>X</Text>
                    </View>
                    <ScrollView>
                        {
                            !loading ? 
                                children 
                                :
                                <View style={styles.loadingOverlay}>
                                    <ActivityIndicator size="large" color="#C36005" />
                                </View>
                        }
                    </ScrollView>
                </Modal>
        </Portal> 
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#090833',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    headerContent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },  
    modalTitle: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
    },
    closeButton: {
        color: "#fff",
        fontSize: 20
    },
    loadingOverlay: {
        backgroundColor: '#090833',
        justifyContent: 'center',
        height: "100%",
        alignItems: 'center',
    }
});

export default ModalDefault;