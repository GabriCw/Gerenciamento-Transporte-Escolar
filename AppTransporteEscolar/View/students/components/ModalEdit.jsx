import { TextInput, Button } from "react-native-paper";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const ModalEdit = ({data, open, onClose, handleConfirm}) => {
    useEffect(() => {
        setStudent({
            id: data?.id,
            name: data?.name,
            year: data?.year
        });
    }, [data]);

    const [student, setStudent] = useState(null);

    return <ModalDefault title="Editar Aluno" open={open} onClose={onClose}>
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
            Atualizar
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

export default ModalEdit;