import { useContext, useEffect, useState } from "react";
import PageDefault from "../../../components/pageDefault/PageDefault";
import { Button, TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { createVehicle } from "../../../data/vehicleServices";
import { AuthContext } from "../../../providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const CreateVehicle = () => {
    const { userData } = useContext(AuthContext);
    const navigation = useNavigation();
    const [board, setBoard] = useState("");
    const [model, setModel] = useState("");
    const [color, setColor] = useState("");
    const [year, setYear] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(board.length === 7 && model && color && year.length === 4){
            setDisabled(false);
        }
    }, [board, model, color, year]);

    const handleCreateVehicle = async() => {
        setLoading(true);

        const body = {
            plate: board,
            vehicle_type_id: 1,
            color,
            model,
            year,
            user_id: userData.id
        };

        const create = await createVehicle(body);

        if(create.status === 201){
            Toast.show({
                type: 'success',
                text1: 'Sucesso!',
                text2: "Veículo criado com sucesso!",
                visibilityTime: 3000,
            });

            navigation.navigate("Perfil");
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: create.data.detail,
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    return <PageDefault headerTitle="Criar veículo" loading={loading}>
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                label="Placa"
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                value={board}
                maxLength={7}
                onChangeText={(text) => setBoard(text.toUpperCase())}
            />
            <TextInput
                style={styles.input}
                label="Modelo"
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                value={model}
                onChangeText={(text) => setModel(text)}
            />
            <TextInput
                style={styles.input}
                label="Cor"
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                value={color}
                onChangeText={(text) => setColor(text)}
            />
            <TextInput
                style={styles.input}
                label="Ano"
                mode="outlined"
                activeOutlineColor="#C36005"
                keyboardAppearance="dark"
                value={year}
                maxLength={4}
                onChangeText={(text) => setYear(text)}
            />
            <Button mode="contained" disabled={disabled} onPress={handleCreateVehicle} style={styles.button}>
                Atualizar
            </Button>
        </View>
    </PageDefault>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        width: "100%"
    },
    input: {
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#C36005"
    }
});

export default CreateVehicle;