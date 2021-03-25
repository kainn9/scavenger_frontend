export type activeNode = {
    title: string;
    text: string;
    lat: number;
    lng: number;
    key: Date | null;
    img?: File | null;
    soundMedia?: string | null;
} | null;
export type backendNode = {
    title: string;
    text: string;
    lat: number;
    lng: number;
    key: Date | null;
    img?: { url: string; key: string } | null;
    soundMedia?: string | null;
};
export type activeRoute = Array<activeNode>;

export interface backendRoute {
    creator: { id: string; email: string; likes: Array<string> };
    title: string;
    nodes: Array<activeNode>;
    userLikes: Array<string>;
    _id: string;
}

export interface ARRootState {
    prepNode: boolean;
    activeNode: activeNode;
    activeRoute: activeRoute;
    error?: string | null;
    // userLikes?: Array<string> | null;
    // eslint-disable-next-line @typescript-eslint/ban-types
    likeEvent: {};
    activeRouteID: string | null;
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
    error: null,
    // userLikes: [],
    likeEvent: {},
    activeRouteID: null,
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
        case 'SET_ACTIVE_IMAGE':
            //const updatedNode = prevState.activeNode ? { ...prevState.activeNode, title: payload } : null;
            return {
                ...prevState,
                activeNode: Object.assign({}, prevState.activeNode, { img: payload }),
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
        case 'TRIGGER_LIKE_EVENT':
            return {
                ...prevState,
                likeEvent: {},
            };
        case 'SET_ROUTE_ID':
            return {
                ...prevState,
                activeRouteID: payload,
            };
        case 'SET_ACTIVE_TITLE':
            return {
                ...prevState,
                activeNode: Object.assign({}, prevState.activeNode, { title: payload }),
            };
        case 'SET_ACTIVE_TEXT':
            return {
                ...prevState,
                activeNode: Object.assign({}, prevState.activeNode, { text: payload }),
            };
        case 'SET_ERROR':
            return {
                ...prevState,
                error: payload,
            };
        case 'SET_ACTIVE_SOUND':
            return {
                ...prevState,
                activeNode: Object.assign({}, prevState.activeNode, { soundMedia: payload }),
            };
        default:
            return prevState;
    }
};

export default activeRouteReducer;
