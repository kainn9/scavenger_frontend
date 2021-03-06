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

// redux
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

/**
 * Page, for building node routes, props come from redux and withRouter
 * @history history prop injected from withRouter
 * @prepNode redux state(bool), true = map onClick enabled, false = map onClick disabled
 * @activeRoute redux state(activeNode[]), is the current route being edited
 * @showDirections redux state(bool), toggles node connections in activeRoute
 * @SET_PREP_STATE redux action, toggles prepState(prepNode) -> true: mapOnClick enabled, fale: mapOnClick disabled
 * @SET_ACTIVE_NODE redux action , sets activeNode in redux
 * @PUSH_TO_ACTIVE_ROUTE adds a node to end of activeRoute and sets as new activeNode(will be unsaved/have no key) until locked in.

 */
const CreatePage: React.FC<RouteComponentProps & reduxProps> = function ({
    history,
    prepNode,
    activeRoute,
    showDirections,
    SET_PREP_STATE,
    SET_ACTIVE_NODE,
    PUSH_TO_ACTIVE_ROUTE,
}) {
    /* 
        if prepState is not active creates a node with null key(null key === unsaved node), adds it to current route, 
        turns prepState back on 
    */
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
    /**
     * function renders array of google maps markers/nodes based on activeRoute-state[]
     * @returns  jsx PreviewMarker[]
     */
    const renderRouteNodes = () => {
        return activeRoute.map((node) => {
            if (node) {
                return <PreviewMarker key={node.key + ''} node={node} />;
            }
        });
    };

    return (
        <>
            {/* Scavengers defauly google map */}
            <DefaultMap clMarkerEnabled minZoom={2} onMapClick={addNode}>
                {renderRouteNodes() /* renders nods */}

                {
                    /* connects nodes if more than 1 node exists and use has toggled directions on */
                    activeRoute.length > 1 && showDirections ? <DirectionsComp /> : null
                }
                {
                    /* toggles node directions/connection lines */
                    activeRoute.length > 1 ? <ToggleDirectionsBtn /> : null
                }
            </DefaultMap>

            {/* form for creating nodes */}
            <MapForm />

            {/* main navbar -> renders children buttons */}
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
