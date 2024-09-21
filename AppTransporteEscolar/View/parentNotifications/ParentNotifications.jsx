import { useContext, useEffect, useState } from "react";
import PageDefault from "../../components/pageDefault/PageDefault";
import { AuthContext } from "../../providers/AuthProvider";
import { getActiveNotifications } from "../../data/parentNotificationsServices";
import { StyleSheet, Text, View } from "react-native";
import NotificationsList from "./components/NotificationList";
import { Button } from "react-native-paper";
import WithoutNotification from "./components/WithoutNotification";

const ParentNotifications = () => {

    const {userData} = useContext(AuthContext);

    const [pageLoading, setPageLoading] = useState(false);
    const [activeNotifications, setActiveNotifications] = useState([]);

    useEffect(() => {
        const requestData = async() => {
            setPageLoading(true);

            const response = await getActiveNotifications(userData.id);

            setActiveNotifications(response.data);

            setPageLoading(false);
        };

        requestData();
    }, [userData]);

    return <PageDefault headerTitle="Notificações" loading={pageLoading}>
        {
            activeNotifications?.length > 0 ? 
                <NotificationsList/>
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