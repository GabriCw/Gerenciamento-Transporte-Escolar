import { TextInput, Button } from "react-native-paper";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const ModalEditUser = ({data, open, onClose, handleConfirm}) => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        setUser({
            id: data?.id,
            name: data?.name,
            email: data?.email,
            cpf: data?.cpf,
            rg: data?.rg,
            cnh: data?.cnh
        });
    }, [data]);

    return <ModalDefault title="Editar Usuário" open={open} onClose={onClose}>
    <>
        <TextInput
            label="Nome"
            value={user?.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
            style={styles.textInputModal}
            mode="outlined"
            activeOutlineColor="#C36005"
            keyboardAppearance="dark"
        />
        <TextInput
            label="Email"
            value={user?.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
            style={styles.textInputModal}
            mode="outlined"
            activeOutlineColor="#C36005"
            keyboardAppearance="dark"
        />
        <TextInput
            label="CPF"
            value={user?.cpf}
            onChangeText={(text) => setUser({ ...user, cpf: text })}
            style={styles.textInputModal}
            mode="outlined"
            activeOutlineColor="#C36005"
            keyboardAppearance="dark"
        />
        {
            user?.rg && <TextInput
                label="RG"
                value={user?.rg}
                onChangeText={(text) => setUser({ ...user, rg: text })}
                style={styles.textInputModal}
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
            />
        }
        {
            user?.cnh && <TextInput
                label="CNH"
                value={user?.cnh}
                onChangeText={(text) => setUser({ ...user, cnh: text })}
                style={styles.textInputModal}
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
            />
        }
        <Button mode="contained" onPress={() => handleConfirm(user)} style={styles.saveButton}>
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

export default ModalEditUser;