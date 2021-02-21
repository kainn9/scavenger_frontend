interface currentLocation {
    lat: number;
    lng: number;
}
export const PAN_TO_CL = function (currentLocation: currentLocation): { type: string; payload: currentLocation } {
    return {
        type: 'PAN_TO_CL',
        payload: currentLocation,
    };
};
