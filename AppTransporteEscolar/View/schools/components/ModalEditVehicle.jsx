import { useContext, useEffect, useState } from "react";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { getSchoolByDriver } from "../../../data/pointServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import { Text, View } from "react-native";
import { getVehicleListByUser } from "../../../data/vehicleServices";

const ModalEditVehicle = ({open, setOpen, navigation}) => {

    const {userData} = useContext(AuthContext);

    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const requestData = async() => {
            const response = await getVehicleListByUser(userData.id);

            if(response.status === 200){
                setVehicles(response.data);
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
        };

        requestData();
    }, []);

    return <ModalDefault title="Selecione um veículo" open={open} onClose={() => setOpen(false)}>
        {
            vehicles.map(item => {
                return <View key={item.id}>
                    <Text style={{color: "white"}}>{item.plate}</Text>
                </View>
            }
           )
        }
    </ModalDefault>
};

export default ModalEditVehicle;