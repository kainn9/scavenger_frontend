import { currentLocation, isLocked } from './currentLocationReducer';
/**
 * function helps set currentLocation state by passing in new cl {lat, lng} object as payload to reducers
 * @param currentLocation lat/lng object(check type currentLocation)
 */
export const PLACE_CL_MARKER = function (currentLocation: currentLocation): { type: string; payload: currentLocation } {
    return {
        type: 'PLACE_CL_MARKER',
        payload: currentLocation,
    };
};
/**
 * function helps toggle isLocked redux state by passing in boolean or interval as payload to reducer(isLocked repeatedly updates users CL in redux)
 * @param isLocked boolean to disable isLocked or interval to enable. Interval needs to be cleared before toggling back to false.
 */
export const TOGGLE_IS_LOCKED = function (isLocked: isLocked): { type: string; payload: isLocked } {
    return {
        type: 'TOGGLE_IS_LOCKED',
        payload: isLocked,
    };
};
