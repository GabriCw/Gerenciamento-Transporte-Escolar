import { useState } from "react";
import ModalDefault from "../../../components/modalDefault/ModalDefault";
import { StyleSheet, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Button } from "react-native-paper";

const ModalSelectStudent = ({list, open, setOpen, setStudent}) => {

    const [studentSelected, setStudentSelected] = useState(null);

    const handleSelectStudent = (selected) => {
        setStudentSelected(selected);
    };

    const handleConfirmSelect = () => {
        setStudent(studentSelected);
        setOpen(false);
    };
    
    return <ModalDefault title="Selecione um aluno" open={open} onClose={() => setOpen(false)}>
        {
            list.map(item => {
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