import { StyleSheet } from 'react-native';
import { shadow } from 'react-native-paper';

export const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#090833',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%'
    },
    vanImage: {
        width: 30,
        height: 60,
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
    text: {
        fontSize: 20,
        color: '#FFF',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
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
    deliveredCardPosition: {
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
    },
    startButtonPos: {
        position: 'absolute',
        flex: 1,
        bottom: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    startDropdown: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#999999DD',
        width: '90%',
        height: 250,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 50,
        paddingTop: 30
    },
    startButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#999999DD',
        width: '90%',
        height: 200,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 50,
        paddingHorizontal: 30
    },
    startRouteButton: {
        width: 150,
        backgroundColor: '#C36005',
        text: '#FFFFFF',
        height: 80,
        justifyContent: 'center',
        flexDirection: 'column'
    },
    stopRoute: {
        flex: 1,
        justifyContent: 'flex-end',
        position: 'absolute',
    },
    stopRouteIcon: {

    }

});