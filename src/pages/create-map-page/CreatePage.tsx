/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import MapUiBtn from '../../components/default-map-ui-btn/MapUiBtn';
import DefaultMap from '../../components/default-map/DefaultMap';
import FindMeBtn from '../../components/find-me-btn/FindMeBtn';
import LockPosBtn from '../../components/lock-pos-btn/LockPosBtn';
import MapForm from '../../components/map-form/MapForm';
import MapUiBar from '../../components/map-ui-bar/MapBar';
import { PUSH_TO_ACTIVE_ROUTE, SET_ACTIVE_NODE, SET_PREP_STATE } from '../../redux/active-route/activeRouteActions';
import { Action, activeNode, ARRootState } from '../../redux/active-route/activeRouteReducer';
import './CreatePageStyles.scss';
import LogoutButton from '../../components/logout-button/LogoutButton';
import PreviewMarker from '../../components/preview-marker/PreviewMarker';
import ToggleDirectionsBtn from '../../components/toggle-directions-btn/ToggleDirectionsBtn';
import DirectionsComp from '../../components/directions/DirectionsComp';
import { MRootState } from '../../redux/map/mapReducer';

const msp = ({ activeRoute, map }: { activeRoute: ARRootState; map: MRootState }) => ({
    prepNode: activeRoute.prepNode,
    activeNode: activeRoute.activeNode,
    activeRoute: activeRoute.activeRoute,
    showDirections: map.showDirections,
});

const mdp = (dispatch: (action: Action) => void) => ({
    SET_PREP_STATE: (bool: boolean) => dispatch(SET_PREP_STATE(bool)),
    SET_ACTIVE_NODE: (node: activeNode) => dispatch(SET_ACTIVE_NODE(node)),
    PUSH_TO_ACTIVE_ROUTE: (node: activeNode) => dispatch(PUSH_TO_ACTIVE_ROUTE(node)),
});

const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;

const CreatePage: React.FC<RouteComponentProps & reduxProps> = function ({
    history,
    prepNode,
    activeRoute,
    showDirections,
    SET_PREP_STATE,
    SET_ACTIVE_NODE,
    PUSH_TO_ACTIVE_ROUTE,
}) {
    const addNode = (e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
        if (prepNode) {
            SET_PREP_STATE(false);
            const newNode = {
                key: null,
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                title: '',
                img: null,
                text: '',
                soundMedia: null,
            };

            PUSH_TO_ACTIVE_ROUTE(newNode);
            SET_ACTIVE_NODE({ ...newNode });
        }
    };

    const renderRouteNodes = () => {
        return activeRoute.map((node) => {
            if (node) {
                return <PreviewMarker key={node.key + ''} node={node} />;
            }
        });
    };

    return (
        <>
            <DefaultMap
                // loadingElement={<div className="loading-element" />}
                // containerElement={<div className="view-map" />}
                // mapElement={<div className="map-element" />}
                clMarkerEnabled
                onMapClick={addNode}
            >
                {renderRouteNodes()}

                {activeRoute.length > 1 && showDirections ? <DirectionsComp /> : null}
                <ToggleDirectionsBtn />
            </DefaultMap>
            <MapForm />
            <MapUiBar>
                <LogoutButton />
                <MapUiBtn iconName="user circle" text="Profile" />
                <MapUiBtn iconName="edit" text="Create" clickFN={() => history.push('/create')} />
                <LockPosBtn />
                <FindMeBtn />
            </MapUiBar>
        </>
    );
};

export default withRouter(connector(CreatePage));
