import React from 'react';
import { Marker } from '@react-google-maps/api';
import { Action, activeNode, activeRoute, ARRootState } from '../../redux/active-route/activeRouteReducer';
import './PreviewMarkerStyles.scss';
import signPostIcon from '../../assets/sign-post-icon.png';
import { SET_ACTIVE_NODE, SET_ACTIVE_ROUTE } from '../../redux/active-route/activeRouteActions';
import { connect, ConnectedProps } from 'react-redux';

const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    activeRoute: activeRoute.activeRoute,
    activeNode: activeRoute.activeNode,
});
const mdp = (dispatch: (action: Action) => void) => ({
    SET_ACTIVE_NODE: (node: activeNode | null) => dispatch(SET_ACTIVE_NODE(node)),
    SET_ACTIVE_ROUTE: (route: activeRoute | null) => dispatch(SET_ACTIVE_ROUTE(route)),
});

const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;

interface Props extends reduxProps {
    node: activeNode;
}

const PreviewMarker: React.FC<Props> = function ({ node, activeNode, activeRoute, SET_ACTIVE_NODE, SET_ACTIVE_ROUTE }) {
    const revertOldNodePosOnSwitch = (stateArray: activeRoute) => {
        const oldNode = stateArray.find((node) => {
            if (node && activeNode) return node.key === activeNode.key;
        });

        if (activeNode)
            Object.assign(oldNode, {
                lat: activeNode.lat,
                lng: activeNode.lng,
            });
    };

    const clickHandler = () => {
        console.log('testo');
        if ((activeNode && node && node && activeNode.key !== node.key) || (node && !activeNode)) {
            revertOldNodePosOnSwitch([...activeRoute]);
            SET_ACTIVE_NODE(null);
            SET_ACTIVE_NODE({ ...node });
        }
    };

    const updateActiveNodeOnDrag = ({
        latLng: { lng, lat },
    }: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
        const routeClone = [...activeRoute];

        const arrayNode = routeClone.find((rNode) => {
            if (rNode && node) return rNode.key === node.key;
        });

        if ((activeNode && node && arrayNode && activeNode.key !== node.key) || (arrayNode && !activeNode)) {
            revertOldNodePosOnSwitch(routeClone);
            SET_ACTIVE_NODE({ ...arrayNode });
        }
        Object.assign(arrayNode, { lat: lat(), lng: lng() });
        SET_ACTIVE_ROUTE(routeClone);
    };

    return node ? (
        <div className="test1">
            <Marker
                draggable
                label={node.title}
                position={{ lat: node.lat, lng: node.lng }}
                icon={{
                    url: signPostIcon,
                    scaledSize: new window.google.maps.Size(40, 40),
                    origin: new window.google.maps.Point(0, 0),
                    //anchor: new window.google.maps.Point(0, 0),
                    labelOrigin: new window.google.maps.Point(20, 47),
                }}
                onClick={clickHandler}
                onDragEnd={updateActiveNodeOnDrag}
            ></Marker>
        </div>
    ) : null;
};
export default connector(PreviewMarker);
