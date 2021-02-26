export type isLocked = null | NodeJS.Timeout;

export type currentLocation = {
    lat: number;
    lng: number;
} | null;

export interface CLRootState {
    currentLocation: currentLocation;
    isLocked: isLocked;
}

export interface Action {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
}

const INIT_STATE = {
    currentLocation: null,
    isLocked: null,
};

const currentLocationReducer = function (prevState = INIT_STATE, { type, payload }: Action): CLRootState {
    switch (type) {
        case 'PLACE_CL_MARKER':
            return {
                ...prevState,
                currentLocation: payload,
            };
        case 'TOGGLE_IS_LOCKED':
            return {
                ...prevState,
                isLocked: payload,
            };
        default:
            return prevState;
    }
};

export default currentLocationReducer;
