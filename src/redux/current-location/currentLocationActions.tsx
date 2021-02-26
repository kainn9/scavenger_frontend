import { currentLocation, isLocked } from './currentLocationReducer';

export const PLACE_CL_MARKER = function (currentLocation: currentLocation): { type: string; payload: currentLocation } {
    return {
        type: 'PLACE_CL_MARKER',
        payload: currentLocation,
    };
};

export const TOGGLE_IS_LOCKED = function (isLocked: isLocked): { type: string; payload: isLocked } {
    return {
        type: 'TOGGLE_IS_LOCKED',
        payload: isLocked,
    };
};
