import { useContext, useEffect, useState } from "react";
import PageDefault from "../../components/pageDefault/PageDefault";
import { AuthContext } from "../../providers/AuthProvider";
import { getActiveNotifications, getPastNotifications } from "../../data/parentNotificationsServices";
import { StyleSheet, Text, View } from "react-native";
import NotificationsList from "./components/NotificationList";
import { Button } from "react-native-paper";
import WithoutNotification from "./components/WithoutNotification";

const ParentNotifications = () => {

    const {userData} = useContext(AuthContext);

    const [pageLoading, setPageLoading] = useState(false);
    const [activeNotifications, setActiveNotifications] = useState([]);
    const [pastNotifications, setPastNotifications] = useState([]);

    useEffect(() => {
        const requestData = async() => {
            setPageLoading(true);

            const [activeList, pastList] = await Promise.all([getActiveNotifications(userData.id), getPastNotifications(userData.id)]);

            if(activeList.status === 200 && pastList.status === 200){
                setActiveNotifications(activeList.data);
                setPastNotifications(pastList.data);
            }

            setPageLoading(false);
        };

        requestData();
    }, [userData]);

    return <PageDefault headerTitle="Informe de Faltas" loading={pageLoading}>
        {
            activeNotifications?.length > 0 ? 
                <NotificationsList activeList={activeNotifications} pastList={pastNotifications} setLoading={setPageLoading}/>
                :
                <WithoutNotification/>
        }
    </PageDefault>
};

const styles = StyleSheet.create({
    container: {
    },
    text: {
        color: "#fff"
    }
});

export default ParentNotifications;