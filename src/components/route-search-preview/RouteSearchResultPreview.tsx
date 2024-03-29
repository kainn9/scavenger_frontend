import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import {
    SET_ACTIVE_NODE,
    SET_ACTIVE_ROUTE,
    // SET_LIKES,
    SET_ROUTE_ID,
} from '../../redux/active-route/activeRouteActions';
import { Action, activeRoute, backendRoute } from '../../redux/active-route/activeRouteReducer';
import './RouteSearchResultPreviewStyles.scss';

//redux
const mdp = (dispatch: (action: Action) => void) => ({
    SET_ACTIVE_ROUTE: (route: activeRoute | null) => dispatch(SET_ACTIVE_ROUTE(route)),
    // SET_LIKES: (likes: Array<string>) => dispatch(SET_LIKES(likes)),
    SET_ROUTE_ID: (id: string) => dispatch(SET_ROUTE_ID(id)),
    SET_ACTIVE_NODE: (n: null) => dispatch(SET_ACTIVE_NODE(n)),
});
const connector = connect(null, mdp);
type ReduxProps = ConnectedProps<typeof connector>;
interface props extends ReduxProps {
    route: backendRoute;
}
const RouteSearchResultPreview: React.FC<props> = function ({
    route,
    SET_ACTIVE_ROUTE,
    SET_ACTIVE_NODE,
    // SET_LIKES,
    SET_ROUTE_ID,
}) {
    // console.log('yeh', route);
    return (
        <div
            className="route-s-result"
            onClick={() => {
                SET_ACTIVE_NODE(null);
                SET_ACTIVE_ROUTE(route.nodes);
                // SET_LIKES(route.userLikes);
                SET_ROUTE_ID(route._id);
            }}
        >
            <h1>{route.title}</h1>
            <p>Node Count: {route.nodes.length}</p>
            <Icon className="map" />
        </div>
    );
};

export default connector(RouteSearchResultPreview);
