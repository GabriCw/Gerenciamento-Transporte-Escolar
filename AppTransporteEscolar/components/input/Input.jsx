import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

const Input = ({value, onChange, placeholder, keyboardType, isPassword}) => {
    const [focus, setFocus] = useState(false);
    
    const [isVisible, setIsVisible] = useState(false);

    return <View style={styles.container}>
        <TextInput
            placeholder={placeholder}
            keyboardType={keyboardType}
            style={[styles.input, focus ? {borderWidth: 1.3, borderColor: "#C36005"} : null]}
            onChangeText={(text) => onChange(text)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            secureTextEntry={isPassword && isVisible}
            keyboardAppearance="light"
            value={value}
        />
        {
            isPassword && <Pressable style={styles.icon} onPress={() => setIsVisible(!isVisible)}>
                {
                    !isVisible ? 
                    <Ionicons name="eye" size={20} color="#C36005"/>
                    :
                    <Ionicons name="eye-off" size={20} color="#C36005"/>
                }
            </Pressable>    
        }
    </View>
};

const styles = StyleSheet.create({
    container: {
        position: "relative"
    },  
    input: {
        marginBottom: 20,
        backgroundColor: "#fff",
        height: 45,
        paddingHorizontal: "5%",
        borderRadius: 10
    },
    icon: {
        position: "absolute",
        right: 10,
        top: 12.5
    }
});

export default Input;