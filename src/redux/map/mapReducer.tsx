export interface center {
    lat: number;
    lng: number;
}

export type infoBox = {
    title: string;
};

export interface MRootState {
    center: center;
    infoBox: infoBox | null;
}

export interface Action {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
}

const INIT_STATE = {
    center: { lat: 42.030686100000004, lng: -74.1102542 },
    infoBox: null,
};

const mapReducer = function (prevState = INIT_STATE, { type, payload }: Action): MRootState {
    switch (type) {
        case 'SET_MAP_CENTER':
            return {
                ...prevState,
                center: payload,
            };
        case 'SET_INFO_BOX':
            return {
                ...prevState,
                infoBox: payload,
            };
        default:
            return prevState;
    }
};

export default mapReducer;
