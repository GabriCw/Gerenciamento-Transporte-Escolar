import { TextInput, Button, Provider, Portal } from "react-native-paper";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const ModalEdit = ({data, open, onClose, handleConfirm}) => {
    const [vehicle, setVehicle] = useState(null);
    
    useEffect(() => {
        setVehicle({
            id: data?.id,
            plate: data?.plate.toUpperCase(),
            model: data?.model ?? "Não informado",
            color: data?.color ?? "Não informado"
        });
    }, [data]);

    return <ModalDefault title="Editar Veículo" open={open} onClose={onClose}>
        <>
            <TextInput
                label="Placa"
                value={vehicle?.plate}
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                onChangeText={(text) => setVehicle({ ...vehicle, plate: text })}
                style={styles.input}
            />
            <TextInput
                label="Modelo"
                value={vehicle?.model}
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                onChangeText={(text) => setVehicle({ ...vehicle, model: text })}
                style={styles.input}
            />
            <TextInput
                label="Cor"
                value={vehicle?.color}
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                onChangeText={(text) => setVehicle({ ...vehicle, color: text })}
                style={styles.input}
            />
            <Button mode="contained" onPress={() => handleConfirm(vehicle)} style={styles.saveButton}>
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