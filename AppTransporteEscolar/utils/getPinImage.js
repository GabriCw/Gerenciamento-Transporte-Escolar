const pinImages = {
    0: require('../assets/icons/pin1.png'),
    1: require('../assets/icons/pin2.png'),
    2: require('../assets/icons/pin3.png'),
    3: require('../assets/icons/pin4.png'),
    4: require('../assets/icons/pin5.png'),
    5: require('../assets/icons/pin6.png'),
    6: require('../assets/icons/pin7.png'),
    7: require('../assets/icons/pin8.png'),
    8: require('../assets/icons/pin9.png'),
    9: require('../assets/icons/pin10.png'),
    10: require('../assets/icons/pin11.png'),
    11: require('../assets/icons/pin12.png'),
    12: require('../assets/icons/pin13.png'),
    13: require('../assets/icons/pin14.png'),
    14: require('../assets/icons/pin15.png'),
    15: require('../assets/icons/pin16.png'),
    16: require('../assets/icons/pin17.png'),
    17: require('../assets/icons/pin18.png'),
    18: require('../assets/icons/pin19.png'),
    19: require('../assets/icons/pin20.png'),
    20: require('../assets/icons/pin21.png'),
    21: require('../assets/icons/pin22.png'),
    22: require('../assets/icons/pin23.png'),
    23: require('../assets/icons/pin24.png'),
    24: require('../assets/icons/pin25.png')
};

export const getPinImage = (index) => {
    return pinImages[index] || null; // Retorna null se o índice estiver fora do intervalo
};
