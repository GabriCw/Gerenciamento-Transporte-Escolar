import { useContext, useEffect, useState } from "react";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { getSchoolAssociatedByDriver, getSchoolByDriver } from "../../../data/pointServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import { Alert, StyleSheet, Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Button } from "react-native-paper";
import { getListAllHomes, updateAddress, updateAddressByPoint } from "../../../data/studentServices";

const ModalEditPoint = ({pointSelected, open, setOpen, navigation, handleReload, student}) => {

    const {userData, token} = useContext(AuthContext);

    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const requestData = async() => {
            setLoading(true);

            const response = await getListAllHomes(student.id, userData.id, token);

            if(response.status === 200){
                const pointFormatted = response.data.map(item => {
                    if(item?.id === pointSelected?.id){
                        return {...item, isChecked: true};
                    }
                    return {...item, isChecked: false};
                });

                setPoints(pointFormatted);
            }
            else{
                setOpen(false);
                
                Alert.alert('Trocar Endereço', 'Confirma a mudança de endereço para a sua residência?', [
                    {
                      text: 'Cancelar',
                      style: 'cancel',
                    },
                    {text: 'Confirmar', onPress: () => handleChangePoint()},
                ]);
            }

            setLoading(false);
        };

        if(open === true)
            requestData();
    }, [pointSelected, open]);

    const handleChangePoint = async() => {
        setLoading(true);

        const body = {
            student_id: student.id,
            user_id: userData.id,
        };

        const update = await updateAddress(body, token);

        if(update.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: "Sucesso ao atualizar endereço",
                visibilityTime: 3000,
            });

            handleReload();
            setOpen(false);
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: "Erro ao atualizar endereço",
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    const handleSelectPoint = (selected) => {
        const pointFormatted = points.map(item => {
            if(item?.id === selected?.id){
                return {...item, isChecked: true}; 
            }
            return {...item, isChecked: false};
        });

        setPoints(pointFormatted);
    };

    const handleUpdatePoint = async() => {
        setLoading(true);

        const pointSelected = points.find(s => s.isChecked === true);

        const body = {
            student_id: student.id,
            user_id: userData.id,
            point_id: pointSelected.id
        };

        const update = await updateAddressByPoint(body, token);

        if(update.status === 200){
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: "Sucesso ao atualizar endereço",
                visibilityTime: 3000,
            });

            handleReload();
            setOpen(false);
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: "Erro ao atualizar endereço",
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };
    
    return <ModalDefault title="Selecione um endereço" loading={loading} open={open} onClose={() => setOpen(false)}>
        {
            points.map(item => {
                return <View style={styles.container} key={item.id}>
                    <BouncyCheckbox
                        size={25}
                        fillColor="#C36005"
                        unFillColor="transparent"
                        text={item.name}
                        isChecked={item.isChecked}
                        iconStyle={{ borderColor: "#C36005" }}
                        innerIconStyle={{ borderWidth: 1 }}
                        textStyle={{ textDecorationLine: "none", color: "white" }}
                        onPress={() => handleSelectPoint(item)}
                    />
                </View>
            })
        }
        <Button
            mode="contained"
            onPress={handleUpdatePoint}
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

export default ModalEditPoint;