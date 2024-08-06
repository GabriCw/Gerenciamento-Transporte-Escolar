export const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h > 0 ? `${h}h ` : ''}${m} Min`;
};

export const formatDistance = (meters) => {
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} Km`;
    }
    return `${meters.toFixed(0)} m`;
};

export const formatCPF = (cpf) => {
    return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatRG = (rg) => {
    return rg?.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
};

export const getAddress = async(street = "") => {
    const point = street?.split(",");
    console.log(point);

    return await{
        address: point[0],
        number: point[1]
    }
};