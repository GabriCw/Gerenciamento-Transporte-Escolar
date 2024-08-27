import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

const SchoolVehicleList = ({navigation, list}) => {

    const handleGoToSchoolVehicleDetails = (item) => {
        navigation.navigate("SchoolVehicleDetails", {schoolVehicleData: item});
    };

    return <ScrollView style={styles.scrollContainer}>
        {
            list?.map((item, index) => {
                return <Pressable style={styles.viewContainter} key={index} onPress={() => handleGoToSchoolVehicleDetails(item)}>
                    <View style={styles.cardContainer}>
                        <View style={styles.mainInfosContainer}>
                            <View style={styles.content}>
                                <View style={styles.nameYearContent}>
                                    <Text style={styles.title}>{item?.point?.name}</Text>
                                    <AntDesign name="rightcircle" size={24} color="black"/>
                                </View>
                                
                                <View style={{width: "100%"}}>
                                    <View>
                                        <Text style={styles.text}>{item?.point?.address}</Text>
                                        <Text style={styles.text}>{item?.point?.neighborhood} - {item?.point?.city}/{item?.point?.state}</Text>
                                    </View>
                                </View>
                                
                        </View>
                    </View>
        
                    <View style={styles.lineSeparator}/>
        
                    <View style={styles.schoolContainer}>
                        <View style={styles.schoolContent}>
                            <Text style={styles.colorBox}>Veículo</Text>
                            <Text style={styles.text}>{item?.vehicle?.plate}</Text>
                            <Text style={styles.text}>({item?.vehicle?.color})</Text>
                        </View>
                        <View>
                            <Text style={styles.text}>{item?.vehicle?.model} - {item?.vehicle?.year}</Text>
                        </View>
                            <View style={styles.nameYearContent}>
                                {
                                    item?.vehicle?.code && <View style={styles.codeContent}>
                                        <Text style={styles.codeText}>Código:</Text>
                                        <Text style={styles.colorBox}>{item?.vehicle?.code}</Text>
                                    </View>
                                }
                            </View>
                        </View>
                        <View style={styles.lineSeparator}/>

                    <View style={styles.codeContainer}>
                        <View style={styles.codeContent}>
                            <Text style={styles.codeText}>Código Associação</Text>
                            <Text style={[styles.colorBox, {backgroundColor: "#C36005"}]}>{item?.code}</Text>
                        </View>
                    </View>
                    </View>
                </Pressable>
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
        minWidth: "90%",
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
        alignSelf: "flex-start",
        paddingTop: 5,
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
        rowGap: 5,
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
        paddingVertical: 10,
        rowGap: 3,
        width: "100%",
        display: "flex",
    },
    schoolContent: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        columnGap: 10
    },
    codeContainer:{
        paddingTop: 10,
        rowGap: 3,
        display: "flex",
    },
    codeContent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
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