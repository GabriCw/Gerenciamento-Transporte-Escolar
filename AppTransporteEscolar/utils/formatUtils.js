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
