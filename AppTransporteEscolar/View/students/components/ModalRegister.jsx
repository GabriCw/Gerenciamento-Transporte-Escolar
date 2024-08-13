import { TextInput, Button } from "react-native-paper";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { useState } from "react";
import { StyleSheet } from "react-native";

const ModalRegister = ({open, onClose, handleConfirm}) => {
    const [student, setStudent] = useState(null);

    return <ModalDefault title="Cadastrar Aluno" open={open} onClose={onClose}>
        <>
            <TextInput
                label="Nome"
                value={student?.name}
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                onChangeText={(text) => setStudent({ ...student, name: text })}
                style={styles.input}
            />
            <TextInput
                label="Idade"
                value={student?.year}
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                keyboardType="numeric"
                onChangeText={(text) => setStudent({ ...student, year: text })}
                style={styles.input}
            />
            <Button mode="contained" onPress={() => handleConfirm(student)} style={styles.saveButton}>
                Salvar
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

export default ModalRegister;