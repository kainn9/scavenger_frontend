import React, { useState } from 'react';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';
import './MapFormStyles.scss';
import { connect, ConnectedProps } from 'react-redux';
import { Action, activeNode, activeRoute, ARRootState } from '../../redux/active-route/activeRouteReducer';
import {
    FILTER_NODE,
    SET_ACTIVE_IMAGE,
    SET_ACTIVE_NODE,
    SET_ACTIVE_ROUTE,
    SET_ACTIVE_TEXT,
    SET_ACTIVE_TITLE,
    SET_ERROR,
    SET_PREP_STATE,
} from '../../redux/active-route/activeRouteActions';
import BodyForm from './BodyForm';
import ImageForm from './ImageForm';
import SoundForm from './SoundForm';

// redux
const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    // prepNode: activeRoute.prepNode,
    activeNode: activeRoute.activeNode,
    activeRoute: activeRoute.activeRoute,
    // error: activeRoute.error,
});

const mdp = (dispatch: (action: Action) => void) => ({
    SET_PREP_STATE: (bool: boolean) => dispatch(SET_PREP_STATE(bool)),
    SET_ACTIVE_NODE: (node: activeNode | null) => dispatch(SET_ACTIVE_NODE(node)),
    SET_ACTIVE_TITLE: (input: string) => dispatch(SET_ACTIVE_TITLE(input)),
    SET_ACTIVE_TEXT: (input: string) => dispatch(SET_ACTIVE_TEXT(input)),
    SET_ACTIVE_ROUTE: (route: activeRoute | null) => dispatch(SET_ACTIVE_ROUTE(route)),
    FILTER_NODE: (key: Date | null) => dispatch(FILTER_NODE(key)),
    SET_ERROR: (error: string | null) => dispatch(SET_ERROR(error)),
    SET_ACTIVE_IMAGE: (imgFile: File | null) => dispatch(SET_ACTIVE_IMAGE(imgFile)),
});

const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;
/**
 * Component is form for creating/editing scavenger node routes
 * @activeNode redux state, current node being edited
 * @activeRoute redux state, current route being edited
 * @SET_PREP_STATE redux action, toggles prepState(prepNode) -> true: mapOnClick enabled, fale: mapOnClick disabled
 * @SET_ACTIVE_NODE redux action, sets activeNode in redux
 * @SET_ACTIVE_ROUTE redux action, sets/updates activeRoute
 * @FILTER_NODE redux action, deletes node  from activeRoute via key param matched to node property
 * @SET_ERROR redux action, sets error string/message in redux
 */
const MapForm: React.FC<reduxProps> = function ({
    activeNode,
    activeRoute,
    SET_PREP_STATE,
    SET_ACTIVE_NODE,
    SET_ACTIVE_ROUTE,
    FILTER_NODE,
    SET_ERROR,
}) {
    // local state to toggle btwn form's collapsed displays
    const [menuMode, setMenuMode] = useState('');

    /**
     * function(onClick for addNode) updates prepstate in redux, this enables the onClick function on the googleMap so the user can create a node
     * @reduxActions SET_PREP_STATE
     */
    const addNodeClickHandler = () => {
        SET_PREP_STATE(true);
    };

    /**
     * function unselects current active node and reverts any changes or deletes it from render state if unsaved, also toggles prepstate to disables map OnClick
     * @reduxActions SET_PREP_STATE, FILTER_NODE, SET_ACTIVE_NODE, SET_ACTIVE_ROUTE
     */
    const cancelNodeClickHandler = () => {
        // clear prep state
        SET_PREP_STATE(false);

        // null key === unsaved node, filtering unsaved nodes
        if (activeNode && activeNode.key === null) {
            FILTER_NODE(activeNode.key);
            //clear activeNode
            SET_ACTIVE_NODE(null);
            return;
        }

        // if key is not null ie, if active node has been saved -> revert node back to old location
        if (activeNode) {
            // update coords of match in arr
            const routeClone = [...activeRoute];
            // ref of object in clone of references so still same re
            const arrayNode = routeClone.find((rNode) => {
                if (rNode && activeNode) return rNode.key === activeNode.key;
            });

            Object.assign(arrayNode, { lat: activeNode.lat, lng: activeNode.lng });
            SET_ACTIVE_ROUTE(routeClone);
            SET_ACTIVE_NODE(null);
        }
    };

    /**
     * function clears and removes currentActive node from its own state and activeRoute, also toggles prepstate to disables map OnClick
     * @reduxActions SET_PREP_STATE, FILTER_NODE, SET_ACTIVE_NODE, SET_ACTIVE_ROUTE
     */
    const deleteNodeHandler = () => {
        SET_PREP_STATE(false);

        // deletes node from route based on key
        if (activeNode) {
            FILTER_NODE(activeNode.key);
            SET_ACTIVE_NODE(null);
        }
    };

    /**
     * function matches active node to it's index inside activeRoute array
     * @params activeRoute[]
     * @returns index | null
     */
    const matchNodeIndex = (routes: activeRoute) => {
        for (let i = 0; i < routes.length; i++) {
            const node = routes[i];
            if (node && activeNode && node.key === activeNode.key) return i;
        }
        return null;
    };

    /**
     * function compares activeNode to its corrosponding object in activeRoute array to see if activeNode is edited
     * @params activeRoute[]
     * @returns true | false
     */
    const isNodeEdited = (routes: activeRoute) => {
        let match = null;
        for (const node of routes) {
            if (node && activeNode && node.key === activeNode.key) match = node;
        }
        if (match && activeNode) {
            if (
                match.text !== activeNode.text ||
                match.title !== activeNode.title ||
                match.lat !== activeNode.lat ||
                match.lng !== activeNode.lng ||
                match.img !== activeNode.img ||
                match.soundMedia !== activeNode.soundMedia
            )
                return true;
        }

        return false;
    };

    /**
     * function saves activeNode/activeNode changes to its corrosponding reference in the activeRoute
     */
    const addNodeToActiveRoute = () => {
        // limit number of nodes(google free directions renderer max's on 8 markers)
        if (activeRoute.length > 7) {
            SET_ERROR('MAX NODE COUNT IS 8(SORRY, CANT AFFORD PREM GOOG MAPS LOL)');
            setTimeout(() => SET_ERROR(null), 3000);
            return;

            // validates that node includes a title
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        } else if (activeNode!.title.length <= 0) {
            SET_ERROR('Node Title Required');
            setTimeout(() => SET_ERROR(null), 3000);
            return;
        }

        // index of actniveNode in activeRoute
        const index = matchNodeIndex(activeRoute);

        // reference to the node inside Route
        let newNode = index || index === 0 ? activeRoute[index] : null;

        // dont want to overwrite lat and lng in array because inverted state logic
        if (newNode && activeNode && (index || index === 0)) {
            newNode = Object.assign(newNode, activeNode, {
                key: Date.now() + '',
                lat: newNode.lat,
                lng: newNode.lng,
            });
            // update the state
            SET_ACTIVE_ROUTE(activeRoute.map((node) => Object.assign({}, node)));
            SET_ACTIVE_NODE(Object.assign({}, activeRoute[index]));
        }
    };
    // body menu
    if (menuMode === 'main')
        return (
            <BodyForm
                setMenuMode={setMenuMode}
                addNodeClickHandler={addNodeClickHandler}
                cancelNodeClickHandler={cancelNodeClickHandler}
                isNodeEdited={isNodeEdited}
                addNodeToActiveRoute={addNodeToActiveRoute}
                deleteNodeHandler={deleteNodeHandler}
            />
        );
    // img menu
    else if (menuMode === 'img')
        return (
            <ImageForm
                setMenuMode={setMenuMode}
                cancelNodeClickHandler={cancelNodeClickHandler}
                isNodeEdited={isNodeEdited}
                addNodeToActiveRoute={addNodeToActiveRoute}
                addNodeClickHandler={addNodeClickHandler}
                deleteNodeHandler={deleteNodeHandler}
            />
        );
    // music
    else if (menuMode === 'music')
        return (
            <SoundForm
                setMenuMode={setMenuMode}
                cancelNodeClickHandler={cancelNodeClickHandler}
                isNodeEdited={isNodeEdited}
                addNodeToActiveRoute={addNodeToActiveRoute}
                addNodeClickHandler={addNodeClickHandler}
                deleteNodeHandler={deleteNodeHandler}
            />
        );
    // collapsed menu
    else
        return (
            <>
                <div className="map-form map-form-colap">
                    <MapUiBtn iconName="arrow alternate circle up" text="" clickFN={() => setMenuMode('main')} />
                    <p>Open Body Section</p>
                </div>

                <div className="map-form map-form-colap-middle">
                    <MapUiBtn iconName="arrow alternate circle up" text="" clickFN={() => setMenuMode('img')} />
                    <p>Open Image Section</p>
                </div>

                <div className="map-form map-form-colap-right">
                    <MapUiBtn iconName="arrow alternate circle up" text="" clickFN={() => setMenuMode('music')} />
                    <p>Open Music Section</p>
                </div>
            </>
        );
};
export default connector(MapForm);
