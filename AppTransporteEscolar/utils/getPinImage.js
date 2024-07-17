export const getPinImage = (index) => {
    switch (index) {
        case 0:
            return 0
        case 1:
            return require('../assets/icons/pin2.png');
        case 2:
            return require('../assets/icons/pin3.png');
        case 3:
            return require('../assets/icons/pin4.png');
        case 4:
            return require('../assets/icons/pin5.png');
        default:
            return require('../assets/icons/pin6.png');

    }
};