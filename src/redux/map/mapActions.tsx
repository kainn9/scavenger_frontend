/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { center } from './mapReducer';
/**
 * function helps set/update mapcenter state by passing in new center {lat, lng} object as payload to reducer
 * @param center lat/lng object(check type center)
 */
export const SET_MAP_CENTER = function (center: center): { type: string; payload: center } {
    return {
        type: 'SET_MAP_CENTER',
        payload: center,
    };
};
/**
 * function helps toggle showDirections redux state by passing in boolean as payload to reducer(showDirections connects activeRoute nodes inside a google map)
 */
export const TOGGLE_DIRECTIONS = function (): { type: string } {
    return {
        type: 'TOGGLE_DIRECTIONS',
    };
};

export const SET_MAP_IFV = function (mapIFV: any): { type: string; payload: any } {
    return {
        type: 'SET_MAP_IFV',
        payload: mapIFV,
    };
};

export const SET_MAP_SUCCESS_MSG = function (mapMsg: string): { type: string; payload: string } {
    return {
        type: 'SET_MAP_SUCCESS_MSG',
        payload: mapMsg,
    };
};
