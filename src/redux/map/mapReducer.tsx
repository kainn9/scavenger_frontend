export interface center {
    lat: number;
    lng: number;
}

export type infoBox = {
    title: string;
};

export interface MRootState {
    center: center;
    showDirections: boolean;
}

export interface Action {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any;
}

const INIT_STATE = {
    center: { lat: 40.7128, lng: -74.006 },
    showDirections: false,
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
        default:
            return prevState;
    }
};

export default mapReducer;
