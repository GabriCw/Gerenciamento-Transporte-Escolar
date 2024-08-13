import { TextInput, Button } from "react-native-paper";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { useState } from "react";
import { StyleSheet } from "react-native";

const ModalAssociation = ({open, onClose, handleConfirm}) => {
    const [studentCode, setStudentCode] = useState("");

    return <ModalDefault title="Associar Aluno" open={open} onClose={onClose}>
        <>
            <TextInput
                label="Código do aluno"
                value={studentCode}
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                onChangeText={(text) => setStudentCode(text)}
                style={styles.input}
            />
            <Button mode="contained" onPress={() => handleConfirm(studentCode)} style={styles.saveButton}>
                Pesquisar
            </Button>
        </>
    </ModalDefault>
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 10,
        fontSize: 20,
        color: '#FFF',
    },
    saveButton: {
        backgroundColor: '#C36005',
        marginTop: 20,
    },
});

export default ModalAssociation;