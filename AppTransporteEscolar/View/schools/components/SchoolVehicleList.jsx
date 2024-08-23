import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import PageDefault from "../../../components/pageDefault/PageDefault";
import { Button, IconButton, Text } from "react-native-paper";
import { useCallback } from "react";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";

const SchoolVehicleList = ({navigation, list}) => {
    
    const OpenURLButton = ({url, children}) => {
        const handlePress = useCallback(async () => {
          const supported = await Linking.canOpenURL(url);
      
          if (supported) {
            await Linking.openURL(url);
          } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
          }
        }, [url]);
      
        return <Button onPress={handlePress}>{children}</Button>;
    };

    const handleGoToSchoolVehicleDetails = (item) => {
        navigation.navigate("SchoolVehicleDetails", {schoolVehicleData: item});
    };

    return <ScrollView style={styles.scrollContainer}>
        {
            list?.map((item, index) => {
                return <View style={styles.viewContainter} key={index}>
                    <View style={styles.cardContainer}>
                        <View style={styles.mainInfosContainer}>
                            <View style={styles.iconContent}>
                            <FontAwesome6 name="van-shuttle"  color="black" style={styles.vehicleIcon} />
                            </View>
                            <View style={styles.content}>
                                <View style={styles.nameYearContent}>
                                    <Text style={styles.title}>{item?.vehicle?.plate}</Text>
                                    <Pressable onPress={() => handleGoToSchoolVehicleDetails(item)}>
                                        <MaterialIcons name="edit" size={24} color="black" />
                                    </Pressable>
                                </View>
                                <View style={styles.nameYearContent}>
                                    {
                                        item?.vehicle?.code && <View style={styles.codeContent}>
                                            <Text style={styles.codeText}>Código:</Text>
                                            <Text style={styles.colorBox}>{item?.vehicle?.code}</Text>
                                        </View>
                                    }
                                    <Text style={styles.text}>{item?.vehicle?.model}</Text>
                                </View>
                                
                            </View>
                        </View>
        
                        <View style={styles.lineSeparator}/>
        
                        <View style={styles.schoolContainer}>
                            <View style={styles.schoolContent}>
                                <Text style={styles.colorBox}>Escola</Text>
                                <Text style={styles.text}>{item?.school?.name}</Text>
                            </View>
                            <View>
                                <Text style={styles.text}>{item?.school?.address}</Text>
                                <Text style={styles.text}>{item?.school?.neighborhood} - {item?.school?.city}/{item?.school?.state}</Text>
                            </View>
                            <OpenURLButton url={`https://www.google.com/maps?q=${item?.school?.lat},${item?.school?.lng}`}>Veja no Google Maps</OpenURLButton>
                        </View>
                    </View>
                </View>
            })
        }
    </ScrollView>
};

const styles = StyleSheet.create({
    scrollContainer: {
        display: "flex",
        flexDirection: "column",
    },  
    viewContainter: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        width: "100%",
        marginBottom: 15,
        alignItems: "center",
    },
    cardContainer: {
        width: '100%',
        height: "auto",
        marginHorizontal: "auto",
        maxHeight: 400,
        backgroundColor: '#f0f0f0',
        borderColor: '#d0d0d0',
        borderWidth: 4,
        borderRadius: 10,
        padding: 10,
        overflow: 'hidden',
    },
    mainInfosContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingBottom: 10
    },
    iconContent: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingLeft: 1,
    },
    vehicleIcon: {
        marginRight: 10,
        marginBottom: 8,
        fontSize: 40
    },
    content: {
        flex: 1,
        paddingHorizontal: 5,
        display: "flex",
        rowGap: 5
    },
    nameYearContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    title: {
        color: '#000',
        fontSize: 22,
        marginBottom: 5,
        fontWeight: "bold",
        maxWidth: "70%",
    },  
    text: {
        color: '#000',
        fontSize: 18,
        marginBottom: 5,
    },
    codeContent: {
        display: "flex",
        flexDirection: "row",
        columnGap: 5,
        alignItems: "center"
    },
    colorBox: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
        backgroundColor: "#090833",
        textAlign: "center",
        paddingVertical: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontWeight: "bold"
    },
    codeText: {
        color: '#000',
        fontSize: 16,
        marginBottom: 5,
    },
    lineSeparator: {
        height: 1,
        backgroundColor: "#d0d0d0"
    },
    schoolContainer:{
        paddingTop: 10,
        rowGap: 3,
        display: "flex",
    },
    schoolContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10
    },
    driverContainer:{
        paddingTop: 10,
        rowGap: 3,
        display: "flex",
    },
    driverContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10
    },
    buttonContainer: {
        display : "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    button: {
        backgroundColor: '#C36005',
        width: "40%",
        display: "flex"
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#090833',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SchoolVehicleList;