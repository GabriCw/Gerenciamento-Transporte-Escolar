import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ButtonDefault from "./ButtonDefault";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

const AdminButtons = ({navigation}) => {
    const handleToDriverSchoolPage = () => {
        navigation.navigate('DriverSchools');
    }

    const handleToStudentPage = () => {
        navigation.navigate('Alunos');
    }
    
    const handleToVehiclePage = () => {
        navigation.navigate('Veiculo');
    }

    const handleToProfilePage = () => {
        navigation.navigate('VerPerfilMoto');
    }

    return <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        >
        <View style={styles.content}>
            <View style={styles.buttonsContent}>
                <ButtonDefault
                    icon={<FontAwesome name="user" size={"30%"} color="#fff"  />}
                    title={"Perfil"}
                    onClick={handleToProfilePage}
                />
                <ButtonDefault
                    icon={<FontAwesome name="bus" size={"30%"} color="#fff"/>}
                    title={"Veículo"}
                    onClick={handleToVehiclePage}
                />
                <ButtonDefault
                    icon={<FontAwesome name="child" size={"30%"} color="#fff"/>}
                    title={"Alunos"}
                    onClick={handleToStudentPage}
                />
                <ButtonDefault
                    icon={<MaterialCommunityIcons name="connection" size={"30%"} color="#fff" />}
                    title={"Associação"}
                    onClick={handleToDriverSchoolPage}
                />
            </View>
        </View>
    </KeyboardAwareScrollView>
};

const styles = StyleSheet.create({
    view: {
    flex: 1,
    backgroundColor: '#090833',
    }, 
    text: {
        fontSize: 20,
        color: '#000',
    },
    subtext: {
        fontSize: 15,
        color: '#000',
    },
    content: {
        flex: 1,
        marginTop: '5%',
        alignItems: 'center',
    },
    buttonsContent: {
        width: "80%",
        display: "flex",
        height: "90%",
        rowGap: "10%",
        columnGap: "10%",
        flexDirection: "row",
        flexWrap: "wrap",
    },  
    perfilBox:{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 5,
        width: '80%',
    },
    button: {
        width: '80%',
        backgroundColor: '#C36005',
        marginTop: 20,
    },
    buttonLabel: {
        color: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'flex-start',
        backgroundColor: '#090833',
    },
    header: {
        alignSelf: 'stretch',
        alignItems: 'center',
        marginTop: 90,
        backgroundColor: '#090833',
    },
})

export default AdminButtons;