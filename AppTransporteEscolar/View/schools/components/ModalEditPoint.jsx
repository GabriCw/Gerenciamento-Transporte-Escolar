import { useContext, useEffect, useState } from "react";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { getSchoolByDriver } from "../../../data/pointServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import { Text, View } from "react-native";

const ModalEditPoint = ({open, setOpen, navigation}) => {

    const {userData} = useContext(AuthContext);

    const [schools, setSchools] = useState([]);

    useEffect(() => {
        const requestData = async() => {
            const response = await getSchoolByDriver(userData.id);

            console.log(response.data)

            if(response.status === 200){
                setSchools(response.data);
            }
            else{
                setSchools([]);
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

    return <ModalDefault title="Selecione uma escola" open={open} onClose={() => setOpen(false)}>
        {
            schools.map(item => {
                return  <View>
                <Text style={{color: "white"}}>{item.school.name}</Text>
            </View>
            }
           )
        }
    </ModalDefault>
};

export default ModalEditPoint;