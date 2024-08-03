import { ScrollView, StyleSheet, Text } from "react-native";
import { Portal, Modal, Button } from "react-native-paper";

const ModalDefault = ({open, onClose, title, children, onConfirm}) => {
    return <Portal>
                <Modal visible={open} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <ScrollView>
                        {children}
                    </ScrollView>
                    <Button mode="contained" onPress={onConfirm} style={styles.saveButton}>
                        Salvar
                    </Button>
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
    modalTitle: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#C36005',
        marginTop: 20,
    },
});

export default ModalDefault;