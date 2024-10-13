import { StyleSheet } from 'react-native';

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
        bottom: '5%',
        height: '15%',
        width: '100%',
        alignItems: 'center',
    },
    infoCard: {
        backgroundColor: '#FFFFFFDD',
        width: '95%',
        height: '100%',
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        flexDirection: 'column',
    },
    infoCardContent: {
        flexDirection: 'row',
    },
    infoCardTitle: {
        marginVertical: 10,
        fontWeight: '200'
    },
    infoCardLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%'
    },
    infoCardRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%'
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
    deliveredCardText: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 20
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
    startContainer: {
        position: 'absolute',
        flex: 1,
        bottom: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    startButtonPos: {
        position: 'absolute',
        flex: 1,
        bottom: 35,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    startContent: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFFEE',
        width: '90%',
        height: 100,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    startDropdown: {
        backgroundColor: '#FFFFFFEE',
        width: '90%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        zIndex: 3000,
        elevation: 3000,
    },
    startButton: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 30,
        marginVertical: 10
    },
    startRouteButton: {
        width: '40%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        backgroundColor: '#C36005',
    },
    startText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        padding: 5,
    },
    stopRoute: {
        flex: 1,
        justifyContent: 'flex-end',
        position: 'absolute',
    },
    googleMapsPos: {
        position: 'absolute',
        bottom: "20%",
        margin: 15,
        opacity: 0.8
    },
    googlMaps: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
    },
    loadingRouteStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    dropdown: {
        width: '90%',
        marginBottom: 20,
        alignSelf: 'center',
        // zIndex: 900
    },
    dropdownContainer: {
        width: '90%',
        zIndex: 1000,
        alignSelf: 'center',
    },
    dropdownLabel: {
        fontSize: 18,
        marginBottom: 10,
    },
    confirmButton: {
        marginTop: 20,
        width: '45%',
        backgroundColor: '#C36005',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        width: '100%',
    },
    studentName: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },
    studentName2: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    endRouteButtonContainer: {
        position: 'absolute',
        bottom: '25%',
        alignSelf: 'center',
    },
    endRouteButton: {
        backgroundColor: '#C36005',
        borderRadius: 10,
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkbox: {
        backgroundColor: '#B0B0B0',
    }
});