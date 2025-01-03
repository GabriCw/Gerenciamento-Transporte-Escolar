import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, View, Dimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ButtonDefault from "./ButtonDefault";
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get("window");

const ResponsibleButtons = ({navigation}) => {
    const handleToStudentPage = () => {
        navigation.navigate('Alunos');
    }

    const handleToProfilePage = () => {
        navigation.navigate('VerPerfilMoto');
    }
    
    const handleToParentNotifications = () => {
        navigation.navigate('ParentNotifications');
    }
    
    const handleToHistoric = () => {
        navigation.navigate('ResponsibleScheduleHistoric');
    }

    const buttonSize = width * 0.1;

    return <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        >
        <View style={styles.content}>
            <View style={styles.buttonsContent}>
                <ButtonDefault
                    icon={<FontAwesome name="user" size={buttonSize} color="#fff"  />}
                    title={"Perfil"}
                    onClick={handleToProfilePage}
                />
                <ButtonDefault
                    icon={<FontAwesome name="child" size={buttonSize} color="#fff"/>}
                    title={"Alunos"}
                    onClick={handleToStudentPage}
                />
                 <ButtonDefault
                    icon={<Ionicons name="alert" size={buttonSize} color="#fff" />}
                    title={"Faltas"}
                    onClick={handleToParentNotifications}
                />
                <ButtonDefault
                    icon={<FontAwesome name="history" size={buttonSize} color="#fff" />}
                    title={"Histórico"}
                    onClick={handleToHistoric}
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
        rowGap: "5%",
        columnGap: "5%",
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

export default ResponsibleButtons;