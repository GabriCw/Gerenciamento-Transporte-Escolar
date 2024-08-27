import { useContext, useEffect, useState } from "react";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { getSchoolAssociatedByDriver, getSchoolByDriver } from "../../../data/pointServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";
import { StyleSheet, Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Button } from "react-native-paper";

const ModalEditPoint = ({schoolSelected, open, setOpen, navigation, handleUpdate}) => {

    const {userData} = useContext(AuthContext);

    const [schools, setSchools] = useState([]);

    useEffect(() => {
        const requestData = async() => {
            const response = await getSchoolByDriver(userData.id);

            if(response.status === 200){
                const schoolFormatted = response.data.map(item => {
                    if(item?.id === schoolSelected?.id){
                        return {...item, isChecked: true};
                    }
                    return {...item, isChecked: false};
                });

                setSchools(schoolFormatted);
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
    }, [schoolSelected]);

    const handleSelectSchool = (selected) => {
        const schoolFormatted = schools.map(item => {
            if(item?.id === selected?.id){
                return {...item, isChecked: true}; 
            }
            return {...item, isChecked: false};
        });

        setSchools(schoolFormatted);
    };

    const handleUpdateSchool = () => {
        const school = schools.find(s => s.isChecked === true);

        if(school !== undefined){
            handleUpdate(school);
            setOpen(false);
        }
    };
    
    return <ModalDefault title="Selecione uma escola" open={open} onClose={() => setOpen(false)}>
        {
            schools.map(item => {
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
                        onPress={() => handleSelectSchool(item)}
                    />
                </View>
            })
        }
        <Button
            mode="contained"
            onPress={handleUpdateSchool}
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