import { useContext, useEffect, useState } from "react";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { StyleSheet, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Button } from "react-native-paper";
import { getStudentsByResponsiblePoint } from "../../../data/studentServices";
import { AuthContext } from "../../../providers/AuthProvider";
import Toast from "react-native-toast-message";

const ModalSelectStudent = ({ open, setOpen, setStudent, selected}) => {

    const { userData } = useContext(AuthContext);
    const [studentSelected, setStudentSelected] = useState(null);
    const [studentList, setStudentList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const requestData = async() => {
            setLoading(true);

            const response = await getStudentsByResponsiblePoint(userData.id);

            if(response.status === 200){
                const studentFormatted = response.data.map(item => {
                    if(item?.id === selected?.id){
                        return {...item, isChecked: true};
                    }
                    return {...item, isChecked: false};
                });

                setStudentList(studentFormatted);
            }
            else{
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: "Você não possuí alunos no seu endereço",
                    visibilityTime: 3000,
                });
                setOpen(false);
            }

            setLoading(false);
        };

        if(open === true)
            requestData();
    }, [open, selected]);

    const handleSelectStudent = (selected) => {
        const studentFormatted = studentList?.map(item => {
            if(item?.id === selected?.id){
                return {...item, isChecked: true};
            }
            return {...item, isChecked: false};
        });

        setStudentSelected(selected);
        setStudentList(studentFormatted);
    };

    const handleConfirmSelect = () => {
        setStudent(studentSelected);
        setOpen(false);
    };
    
    return <ModalDefault title="Selecione um aluno" loading={loading} open={open} onClose={() => setOpen(false)}>
        {
            studentList?.map(item => {
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
                        onPress={() => handleSelectStudent(item)}
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

export default ModalSelectStudent;