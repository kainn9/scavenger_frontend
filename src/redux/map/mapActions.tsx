import { activeNode } from '../active-route/activeRouteReducer';
import { center } from './mapReducer';

export const SET_MAP_CENTER = function (center: center): { type: string; payload: center } {
    return {
        type: 'SET_MAP_CENTER',
        payload: center,
    };
};

export const TOGGLE_DIRECTIONS = function (): { type: string } {
    return {
        type: 'TOGGLE_DIRECTIONS',
    };
};

export const SET_INFO_WINDOW = function (node: activeNode): { type: string; payload: activeNode } {
    return {
        type: 'SET_INFO_WINDOW',
        payload: node,
    };
};
