import { activeNode, activeRoute } from './activeRouteReducer';

export const SET_PREP_STATE = function (bool: boolean): { type: string; payload: boolean } {
    return {
        type: 'SET_PREP_STATE',
        payload: bool,
    };
};

export const SET_ACTIVE_NODE = function (node: activeNode): { type: string; payload: activeNode } {
    return {
        type: 'SET_ACTIVE_NODE',
        payload: node,
    };
};

export const PUSH_TO_ACTIVE_ROUTE = function (node: activeNode): { type: string; payload: activeNode } {
    return {
        type: 'PUSH_TO_ACTIVE_ROUTE',
        payload: node,
    };
};
export const SET_ACTIVE_TITLE = function (input: string): { type: string; payload: string } {
    return {
        type: 'SET_ACTIVE_TITLE',
        payload: input,
    };
};

export const FILTER_NODE = function (key: Date | null): { type: string; payload: Date | null } {
    return {
        type: 'FILTER_NODE',
        payload: key,
    };
};

export const SET_ACTIVE_ROUTE = function (route: activeRoute | null): { type: string; payload: activeRoute | null } {
    return {
        type: 'SET_ACTIVE_ROUTE',
        payload: route,
    };
};
