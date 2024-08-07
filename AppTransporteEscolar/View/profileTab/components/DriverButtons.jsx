import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-paper";

const DriverButtons = ({navigation}) => {
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
            <Button
                onPress={handleToProfilePage}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                >
                Ver Perfil
            </Button>
            <Button 
                onPress={handleToVehiclePage}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                >
                Ver Veiculo
            </Button>
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

export default DriverButtons;