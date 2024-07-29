import { StyleSheet } from 'react-native';
import { shadow } from 'react-native-paper';

export const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        alignSelf: 'stretch',
        marginLeft: 20,
        marginTop: 50,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#090833',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#090833',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#C36005',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    text: {
        fontSize: 20,
        color: '#FFF',
    },
    footer: {
        position: 'absolute',
        bottom: 70,
        height: '15%',
        width: '100%',
        alignItems: 'center',
    },
    infoCard: {
        backgroundColor: '#FFFFFFDD',
        width: '95%',
        height: '100%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        marginBottom: 20,
    },
    infoCardNextStop: {
        flex: 1,
        paddingTop: 10,
        alignItems: 'center',
        flexDirection: 'column'
    },
    infoCardNextStopTexts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 60,
    },
    infoCardFullRouteTexts: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20 
    },
    infoCardText: {
        fontWeight: 'bold',
        fontSize: 30
    },
    DeliveredCardPosition: {
        position: 'absolute',
        top: '13%',
        height: '8%',
        width: '100%',
        alignItems: 'center'
    },
    deliveredCardContent: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFFFFFBB',
        width: '95%',
        height: '50%',
        borderRadius: 15,
        alignItems: 'center',
    },
    deliveredCardText:{
        flex: 1,
        fontWeight: 'bold',
        fontSize: 12,
        marginHorizontal: 10
    },
    deliveredCardButtons: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        right: 0
    },
    deliveredCardButtonYes: {
        backgroundColor: 'green',
        width: 80,
        padding: 0,
        marginRight: 10
    },
    deliveredCardButtonNo: {
        backgroundColor: 'red',
        width: 80,
        padding: 0
    }

});