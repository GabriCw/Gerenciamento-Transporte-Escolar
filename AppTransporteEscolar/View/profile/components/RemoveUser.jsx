import React, { useContext, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import PageDefault from "../../../components/pageDefault/PageDefault";
import { Button } from "react-native-paper";
import { deleteUser } from "firebase/auth";
import { AuthContext } from "../../../providers/AuthProvider";

const RemoveUser = () => {

    const {userData, handleRemoveUserFromFirebase} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleAlertToRemoveUser = () => {
        Alert.alert('Remover Usuário', 'Confirma a remoção?', [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {text: 'Confirmar', onPress: () => handleConfirmRemoveUser()},
        ]);
    };

    const handleConfirmRemoveUser = async() => {
        setLoading(true);

        const response = await deleteUser(userData.id);

        if(response.status === 200){
            await handleRemoveUserFromFirebase();
        }
        else{
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Ocorreu um erro eo remover seu usuário!',
                visibilityTime: 3000,
            });
        }

        setLoading(false);
    };

    return (
        <PageDefault headerTitle="Remover Usuário" loading={loading}>
            <View style={styles.container}>
                <Text style={styles.title}>Confirmação de Remoção</Text>
                <Text style={styles.text}>Tem certeza que deseja remover seu usuário?</Text>
                <Text style={styles.text}>
                    Esta ação removerá permanentemente todos os seus dados cadastrais, incluindo:
                </Text>
                <View style={styles.listContainer}>
                    <Text style={styles.listItem}>- Dados de cadastro</Text>
                    <Text style={styles.listItem}>- Endereço</Text>
                    <Text style={styles.listItem}>- Número de telefone</Text>
                    <Text style={styles.listItem}>- Seus Alunos</Text>
                    <Text style={styles.listItem}>
                        - Você será desassociado de todos os alunos não criados por você, e vice-versa
                    </Text>
                </View>
                <Button
                    mode="contained"
                    onPress={handleAlertToRemoveUser}
                    style={styles.button}
                >
                    Remover
                </Button>
            </View>
        </PageDefault>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#C36005"
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 5,
        color: "#fff"
    },
    listContainer: {
        marginTop: 10,
        alignSelf: "stretch",
        color: "#fff"
    },
    listItem: {
        fontSize: 14,
        marginBottom: 5,
        color: "#fff"
    },
    button: {
        marginTop: 20,
        backgroundColor: '#C36005',
        width: "40%",
        display: "flex"
    },
});

export default RemoveUser;
