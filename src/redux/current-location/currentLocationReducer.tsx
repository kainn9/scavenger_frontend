export interface currentLocation {
    lat: number;
    lng: number;
}
export interface CLRootState {
    currentLocation: currentLocation | null;
}

export interface Action {
    type: string;
    payload: currentLocation;
}

const INIT_STATE = {
    currentLocation: null,
};

const currentLocationReducer = function (prevState = INIT_STATE, { type, payload }: Action): CLRootState {
    switch (type) {
        case 'PAN_TO_CL':
            return {
                ...prevState,
                currentLocation: payload,
            };

        default:
            return prevState;
    }
};

export default currentLocationReducer;
