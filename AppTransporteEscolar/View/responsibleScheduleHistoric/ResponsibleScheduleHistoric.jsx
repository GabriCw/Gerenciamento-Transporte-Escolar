import React, { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import 'moment/locale/pt-br'; 
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import PageDefault from "../../components/pageDefault/PageDefault";
import { AuthContext } from "../../providers/AuthProvider";
import { getHistoricDriverByDate } from "../../data/scheduleServices";
import CardResponsible from "./components/CardResponsible";

const ResponsibleScheduleHistoric = () => {
    moment.locale('pt-br');

    const { userData } = useContext(AuthContext);

    const today = moment().format("DD/MM/YYYY, dddd");
    const [dateSelected, setDateSelected] = useState(today);
    const [dateButton, setDateButton] = useState(false);

    const [loading, setLoading] = useState(false);
    const [listByDate, setListByDate] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSearchSchedulesByDate = async(date) => {
        setErrorMessage(null);

        setLoading(true);

        const list = await getHistoricDriverByDate({ date: date, user_id: userData.id });

        if(list.status === 200){
            setListByDate(list.data);
        }
        else{
            setErrorMessage(list.data.detail);
        }

        setLoading(false);
    };

    useEffect(() => {
        const requestData = async() => {
            await handleSearchSchedulesByDate(moment().format("YYYY-MM-DD"));            
        };

        requestData();
    }, [userData]);

    const handleConfirmDate = async(value) => {
        await handleSearchSchedulesByDate(moment(value).format("YYYY-MM-DD"));
        
        setDateSelected(moment(value).format("DD/MM/YYYY, dddd"));
        setDateButton(false);
    };

    return (
        <PageDefault headerTitle="Histórico de Viagens" withoutCentering={true} loading={loading}>
            <View style={styles.content}>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{dateSelected}</Text>
                    <Pressable onPress={() => setDateButton(true)} style={styles.button}>
                        <Ionicons name="calendar" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Alterar</Text>
                    </Pressable>
                </View>

                <ScrollView style={styles.cardContainer}>
                    {
                        !errorMessage ?
                            <View style={styles.cardContent}>
                                {listByDate?.map(item => (<CardResponsible index={item.schedule.id} data={item} setLoading={setLoading}/>))}
                            </View>
                        :
                        <View style={styles.errorMessageContainer}>
                            <FontAwesome name="exclamation-circle" size={"80%"} color="#C36005" />
                            <Text style={styles.errorMessage}>{errorMessage}</Text>
                        </View>
                    }
                </ScrollView>
            </View>

            <DateTimePickerModal
                display="inline"
                mode="date"
                date={moment(dateSelected, "DD/MM/YYYY").toDate()}
                isVisible={dateButton}
                onConfirm={handleConfirmDate}
                onCancel={() => setDateButton(false)}
            />
        </PageDefault>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1
    },  
    dateContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
        padding: 10,
    },
    dateText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginLeft: 5
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#C36005",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        marginLeft: 10,
    },
    cardContainer: {
        paddingBottom: 15,
        flex: 1
    },
    cardContent: {
        flex: 1,
        alignItems: "center",
        rowGap: 15,
        flexDirection: "column",
        minHeight: "100%"
    },
    errorMessageContainer:{
        flex: 1,
        justifyContent: "center",
        marginTop: "35%",
        rowGap: 10,
        alignItems: "center",
        marginBottom: "20%"
    },
    errorMessage: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        color: "#fff", 
    }
});

export default ResponsibleScheduleHistoric;
