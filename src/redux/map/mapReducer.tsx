export interface center {
    lat: number;
    lng: number;
}
export interface MRootState {
    center: center;
    showDirections: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapIFV: any;
    mapMsg: string;
}

export interface Action {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any;
}

const INIT_STATE = {
    center: { lat: 40.7128, lng: -74.006 },
    showDirections: false,
    mapIFV: false,
    mapMsg: '',
};

const mapReducer = function (prevState = INIT_STATE, { type, payload }: Action): MRootState {
    switch (type) {
        case 'SET_MAP_CENTER':
            return {
                ...prevState,
                center: payload,
            };
        case 'TOGGLE_DIRECTIONS':
            return {
                ...prevState,
                showDirections: !prevState.showDirections,
            };

        case 'SET_MAP_IFV':
            return {
                ...prevState,
                mapIFV: payload,
            };
        case 'SET_MAP_SUCCESS_MSG':
            return {
                ...prevState,
                mapMsg: payload,
            };
        default:
            return prevState;
    }
};

export default mapReducer;
