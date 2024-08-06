import { TextInput, Button } from "react-native-paper";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { getAddressByCEP } from "../../../data/cepServices";
import { getAddress } from "../../../utils/formatUtils";

const ModalEditPoint = ({data, address, open, onClose, handleConfirm}) => {
    const [point, setPoint] = useState(null);
    
    useEffect(() => {
        setTimeout(async() => {  
            const addressStreet = await address?.split(",");

            setPoint({
                id: data?.id,
                name: data?.name,
                address: addressStreet && addressStreet[0],
                number: addressStreet && addressStreet[1],
                neighborhood: data?.neighborhood,
                state: data?.state,
                city: data?.city,
                description: data?.description,
                cep: null
            });
        }, 1000);
    }, [data, address]);

    const searchAddressByCEP = async() => {
        const response = await getAddressByCEP(point?.cep);

        if(response.status === 200){
            const {logradouro, uf, localidade, bairro} = response.data;

            setPoint({
                ...point,
                address: logradouro,
                state: uf,
                city: localidade,
                neighborhood: bairro,
                number: null
            });
        }
        else{
            Alert.alert('Erro', 'Não foi possível buscar o endereço');
        }
    };

    return <ModalDefault title="Editar Endereço" open={open} onClose={onClose}>
    <>
        <TextInput
            label="CEP"
            value={point?.cep}
            onChangeText={(text) => setPoint({ ...point, cep: text })}
            style={styles.textInputModal}
            mode="outlined"
            activeOutlineColor="#C36005"
            keyboardAppearance="dark"
        />
        <Button mode="contained" onPress={searchAddressByCEP} style={[styles.searchButton, {marginTop:15, marginBottom:15}]} disabled={point?.cep?.length !== 8}>
            Buscar
        </Button>
        <TextInput
            label="Endereço"
            value={point?.address}
            onChangeText={(text) => setPoint({ ...point, address: text })}
            style={[styles.textInputModal, point?.cep?.length !== 8 && styles.disabledTextInput]}
            mode="outlined"
            activeOutlineColor="#C36005"
            keyboardAppearance="dark"
            editable={point?.cep?.length !== 8}
        />
        <TextInput
            label="Número"
            value={point?.number}
            onChangeText={(text) => setPoint({ ...point, number: text })}
            style={[styles.textInputModal, point?.cep?.length !== 8 && styles.disabledTextInput]}
            mode="outlined"
            activeOutlineColor="#C36005"
            keyboardAppearance="dark"
            editable={point?.cep?.length === 8}
        />
        <TextInput
            label="Bairro"
            value={point?.neighborhood}
            onChangeText={(text) => setPoint({ ...point, neighborhood: text })}
            style={[styles.textInputModal, point?.cep?.length !== 8 && styles.disabledTextInput]}
            mode="outlined"
            activeOutlineColor="#C36005"
            keyboardAppearance="dark"
            editable={point?.cep?.length === 8}
        />
        <TextInput
            label="Estado"
            value={point?.state}
            onChangeText={(text) => setPoint({ ...point, state: text })}
            style={[styles.textInputModal, point?.cep?.length !== 8 && styles.disabledTextInput]}
            mode="outlined"
            activeOutlineColor="#C36005"
            keyboardAppearance="dark"
            editable={point?.cep?.length === 8}
        />
        <TextInput
            label="Cidade"
            value={point?.city}
            onChangeText={(text) => setPoint({ ...point, city: text })}
            style={[styles.textInputModal, point?.cep?.length !== 8 && styles.disabledTextInput]}
            mode="outlined"
            activeOutlineColor="#C36005"
            keyboardAppearance="dark"
            editable={point?.cep?.length === 8}
        />
        <Button mode="contained" onPress={() => handleConfirm(point)} style={styles.saveButton}>
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

export default ModalEditPoint;