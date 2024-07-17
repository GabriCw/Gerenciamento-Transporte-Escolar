import { StyleSheet } from 'react-native';

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
});