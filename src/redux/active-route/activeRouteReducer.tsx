export type activeNode = {
    title: string;
    lat: number;
    lng: number;
    key: Date | null;
} | null;
export type activeRoute = Array<activeNode>;

export interface ARRootState {
    prepNode: boolean;
    activeNode: activeNode;
    activeRoute: activeRoute;
}

export interface Action {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
}

const INIT_STATE: ARRootState = {
    prepNode: false,
    activeNode: null,
    activeRoute: [],
};

const activeRouteReducer = function (prevState = INIT_STATE, { type, payload }: Action): ARRootState {
    switch (type) {
        case 'SET_PREP_STATE':
            return {
                ...prevState,
                prepNode: payload,
            };
        case 'SET_ACTIVE_NODE':
            return {
                ...prevState,
                activeNode: payload,
            };
        case 'PUSH_TO_ACTIVE_ROUTE':
            return {
                ...prevState,
                activeRoute: [...prevState.activeRoute, payload],
            };
        case 'SET_ACTIVE_TITLE':
            const updatedNode = prevState.activeNode ? { ...prevState.activeNode, title: payload } : null;
            return {
                ...prevState,
                activeNode: updatedNode,
            };
        case 'FILTER_NODE':
            const filteredRoute = prevState.activeRoute.filter((route) => {
                if (route) return route.key !== payload;
            });
            return {
                ...prevState,
                activeRoute: filteredRoute,
            };
        case 'SET_ACTIVE_ROUTE':
            return {
                ...prevState,
                activeRoute: payload,
            };
        default:
            return prevState;
    }
};

export default activeRouteReducer;
