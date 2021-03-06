import { activeNode, activeRoute } from './activeRouteReducer';
/**
 * function helps toggle prepNode state by passing boolean as payload into reducer
 * @param bool, bool to set as payloas 

 */
export const SET_PREP_STATE = function (bool: boolean): { type: string; payload: boolean } {
    return {
        type: 'SET_PREP_STATE',
        payload: bool,
    };
};
/**
 * function helps set/update/edit activeNode by passing node as payload into reducer
 * @param node, node data to set as activeNode

 */
export const SET_ACTIVE_NODE = function (node: activeNode): { type: string; payload: activeNode } {
    return {
        type: 'SET_ACTIVE_NODE',
        payload: node,
    };
};
/**
 * function helps expand activeRoute by passing NEW node data as payload to reducer
 * @param node, node data to set as activeNode

 */
export const PUSH_TO_ACTIVE_ROUTE = function (node: activeNode): { type: string; payload: activeNode } {
    return {
        type: 'PUSH_TO_ACTIVE_ROUTE',
        payload: node,
    };
};
/**
 * function helps edit/set activeNode body/text by passing string/input data as payload to reducer
 * @param input string data to update/edit activeNode.text

 */
export const SET_ACTIVE_TEXT = function (input: string): { type: string; payload: string } {
    return {
        type: 'SET_ACTIVE_TEXT',
        payload: input,
    };
};
/**
 * function helps edit/set activeNode title by passing string/input data as payload to reducer
 * @param input string data to update/edit activeNode.title

 */
export const SET_ACTIVE_TITLE = function (input: string): { type: string; payload: string } {
    return {
        type: 'SET_ACTIVE_TITLE',
        payload: input,
    };
};
/**
 * function helps removes nodes by passing their key into the reducer
 * @param key key of node to remove(null means node has never been locked in)

 */
export const FILTER_NODE = function (key: Date | null): { type: string; payload: Date | null } {
    return {
        type: 'FILTER_NODE',
        payload: key,
    };
};
/**
 * function helps set the activeRoute by passing a new/mutated-clone activeRoute or null as payload
 * @param route new or modified clone of activeRoute

 */
export const SET_ACTIVE_ROUTE = function (route: activeRoute | null): { type: string; payload: activeRoute | null } {
    return {
        type: 'SET_ACTIVE_ROUTE',
        payload: route,
    };
};
/**
 * function helps set activeNode.img by passing either url, file or null as payload into reducer
 * @param img img file or url to save

 */
export const SET_ACTIVE_IMAGE = function (img: File | null | string): { type: string; payload: File | null | string } {
    return {
        type: 'SET_ACTIVE_IMAGE',
        payload: img,
    };
};
/**
 * function helps set error messages by passing a string/null as payload into redux
 * @param error error string

 */
export const SET_ERROR = function (error: string | null): { type: string; payload: string | null } {
    return {
        type: 'SET_ERROR',
        payload: error,
    };
};
/**
 * function helps set activeNode.soundMedia by passing a uri string or null as payload to reducer
 * @param uri spotify uri string

 */
export const SET_ACTIVE_SOUND = function (uri: string | null): { type: string; payload: string | null } {
    return {
        type: 'SET_ACTIVE_SOUND',
        payload: uri,
    };
};
