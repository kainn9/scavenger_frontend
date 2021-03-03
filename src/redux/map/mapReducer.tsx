import { activeNode } from '../active-route/activeRouteReducer';

export interface center {
    lat: number;
    lng: number;
}

export type infoBox = {
    title: string;
};

export interface MRootState {
    center: center;
    infoBox: activeNode | null;
    showDirections: boolean;
}

export interface Action {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any;
}

const INIT_STATE = {
    center: { lat: 40.7128, lng: -74.006 },
    infoBox: null,
    showDirections: false,
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
        case 'TOGGLE_DIRECTIONS':
            return {
                ...prevState,
                showDirections: !prevState.showDirections,
            };
        case 'SET_INFO_WINDOW':
            return {
                ...prevState,
                infoBox: payload,
            };
        default:
            return prevState;
    }
};

export default mapReducer;
