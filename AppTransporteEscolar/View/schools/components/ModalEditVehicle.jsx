import { useContext, useEffect, useState } from "react";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import { StyleSheet, Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { getVehicleListByUser } from "../../../data/vehicleServices";
import { Button } from "react-native-paper";

const ModalEditVehicle = ({vehicleSelected, open, setOpen, handleUpdate, navigation}) => {

    const {userData} = useContext(AuthContext);

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const requestData = async() => {
            setLoading(true);

            const response = await getVehicleListByUser(userData.id);

            if(response.status === 200){
                const vehicleFormatted = response.data.map(item => {
                    if(item?.id === vehicleSelected?.id){
                        return {...item, isChecked: true}
                    }
                    return {...item, isChecked: false}
                });
                setVehicles(vehicleFormatted);
            }
            else{
                setVehicles([]);
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'Erro ao listar as escolas',
                    visibilityTime: 3000,
                });
                navigation.goBack();
            }

            setLoading(false);
        };

        requestData();
    }, []);

    const handleSelectVehicle = (selected) => {
        const vehiclesFormatted = vehicles.map(item => {
            if(item?.id === selected?.id){
                return {...item, isChecked: true}; 
            }
            return {...item, isChecked: false};
        });

        setVehicles(vehiclesFormatted);
    };

    const handleUpdateVehicle = () => {
        const vehicle = vehicles.find(s => s.isChecked === true);

        if(vehicle !== undefined){
            handleUpdate(vehicle);
            setOpen(false);
        }
    };

    return <ModalDefault title="Selecione um veículo" loading={loading} open={open} onClose={() => setOpen(false)}>
        {
            vehicles.map(item => {
                return <View style={styles.container} key={item.id}>
                <BouncyCheckbox
                    size={25}
                    fillColor="#C36005"
                    unFillColor="transparent"
                    text={item.plate}
                    isChecked={item.isChecked}
                    iconStyle={{ borderColor: "#C36005" }}
                    innerIconStyle={{ borderWidth: 1 }}
                    textStyle={{ textDecorationLine: "none", color: "white" }}
                    onPress={() => handleSelectVehicle(item)}
                />
            </View>
            }
           )
        }
        <Button
            mode="contained"
            onPress={handleUpdateVehicle}
            style={styles.button}
            >
            Confirmar
        </Button>
    </ModalDefault>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        marginBottom: 10
    },
    button: {
        backgroundColor: '#C36005',
        width: "40%",
        marginTop: 10,
        marginHorizontal: "auto",
        display: "flex"
    },
});

export default ModalEditVehicle;