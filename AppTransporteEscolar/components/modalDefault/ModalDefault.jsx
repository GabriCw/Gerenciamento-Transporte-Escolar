import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Portal, Modal, Button } from "react-native-paper";

const ModalDefault = ({open, onClose, title, children}) => {
    return <Portal>
                <Modal visible={open} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
                    <View style={styles.headerContent}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <Text style={styles.closeButton} onPress={onClose}>X</Text>
                    </View>
                    <ScrollView>
                        {children}
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
    }
});

export default ModalDefault;