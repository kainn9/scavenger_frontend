import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { SET_ACTIVE_ROUTE } from '../../redux/active-route/activeRouteActions';
import { Action, activeRoute, backendRoute } from '../../redux/active-route/activeRouteReducer';
import './RouteSearchResultPreviewStyles.scss';

//redux
const mdp = (dispatch: (action: Action) => void) => ({
    SET_ACTIVE_ROUTE: (route: activeRoute | null) => dispatch(SET_ACTIVE_ROUTE(route)),
});
const connector = connect(null, mdp);
type ReduxProps = ConnectedProps<typeof connector>;
interface props extends ReduxProps {
    route: backendRoute;
}
const RouteSearchResultPreview: React.FC<props> = function ({ route, SET_ACTIVE_ROUTE }) {
    console.log(route);
    return (
        <div className="route-s-result" onClick={() => SET_ACTIVE_ROUTE(route.nodes)}>
            <h1>{route.title}</h1>
            <p>Node Count: {route.nodes.length}</p>
            <Icon className="map" />
        </div>
    );
};

export default connector(RouteSearchResultPreview);
