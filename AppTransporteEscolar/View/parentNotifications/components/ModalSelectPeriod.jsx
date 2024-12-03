import { useContext, useEffect, useState } from "react";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { StyleSheet, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Button } from "react-native-paper";
import { getAllPeriodOptions } from "../../../data/parentNotificationsServices";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../../providers/AuthProvider";

const ModalSelectPeriod = ({selected, open, setOpen, setPeriod}) => {

    const [periodSelected, setPeriodSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [periodList, setPeriodList] = useState([]);

    const { token } = useContext(AuthContext);

    useEffect(() => {
        const requestData = async() => {
            setLoading(true);

            const response = await getAllPeriodOptions(token);

            if(response.status === 200){
                const periodFormatted = response.data.map(item => {
                    if(item?.id === selected?.id){
                        return {...item, isChecked: true};
                    }
                    return {...item, isChecked: false};
                });

                setPeriodList(periodFormatted);
            }
            else{
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: "Houve um erro ao buscar os períodos",
                    visibilityTime: 3000,
                });
                setOpen(false);
            }

            setLoading(false);
        };

        if(open === true)
            requestData();
    }, [open, selected]);

    const handleSelectPeriod = (selected) => {
        const periodFormatted = periodList?.map(item => {
            if(item?.id === selected?.id){
                return {...item, isChecked: true};
            }
            return {...item, isChecked: false};
        });

        setPeriodSelected(selected);
        setPeriodList(periodFormatted);
    };

    const handleConfirmSelect = () => {
        setPeriod(periodSelected);
        setOpen(false);
    };
    
    return <ModalDefault title="Selecione um período" loading={loading} open={open} onClose={() => setOpen(false)}>
        {
            periodList?.map(item => {
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
                        onPress={() => handleSelectPeriod(item)}
                    />
                </View>
            })
        }
        <Button
            mode="contained"
            onPress={handleConfirmSelect}
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

export default ModalSelectPeriod;