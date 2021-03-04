import React from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';
import { Action, activeNode, activeRoute, ARRootState } from '../../redux/active-route/activeRouteReducer';
import './PreviewMarkerStyles.scss';
import signPostIcon from '../../assets/sign-post-icon.png';
import { SET_ACTIVE_NODE, SET_ACTIVE_ROUTE } from '../../redux/active-route/activeRouteActions';
import { connect, ConnectedProps } from 'react-redux';
import SpotPlayerLoader from '../spot-player-w-loader/SpotPlayerLoader';
import { MRootState } from '../../redux/map/mapReducer';
import { SET_INFO_WINDOW } from '../../redux/map/mapActions';

const msp = ({ activeRoute, map }: { activeRoute: ARRootState; map: MRootState }) => ({
    activeRoute: activeRoute.activeRoute,
    activeNode: activeRoute.activeNode,
    infoBox: map.infoBox,
});

const mdp = (dispatch: (action: Action) => void) => ({
    SET_ACTIVE_NODE: (node: activeNode | null) => dispatch(SET_ACTIVE_NODE(node)),
    SET_ACTIVE_ROUTE: (route: activeRoute | null) => dispatch(SET_ACTIVE_ROUTE(route)),
    SET_INFO_WINDOW: (node: activeNode) => dispatch(SET_INFO_WINDOW(node)),
});

const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;

interface Props extends reduxProps {
    node: activeNode;
}

const PreviewMarker: React.FC<Props> = function ({
    node,
    activeNode,
    activeRoute,
    infoBox,
    SET_ACTIVE_NODE,
    SET_ACTIVE_ROUTE,
    SET_INFO_WINDOW,
}) {
    const revertOldNodePosOnSwitch = (route: activeRoute) => {
        if (activeNode) {
            const index = route.findIndex((n) => {
                if (n && activeNode) return n.key === activeNode.key;
            });
            if (index !== -1) {
                Object.assign(route[index], {
                    lat: activeNode.lat,
                    lng: activeNode.lng,
                });

                SET_ACTIVE_ROUTE(activeRoute.map((n) => Object.assign({}, n)));
            }
        }
    };

    const clickHandler = () => {
        // if active node key matches node key -or- no activeNode
        if ((activeNode && node && activeNode.key !== node.key) || (node && !activeNode)) {
            revertOldNodePosOnSwitch([...activeRoute]);
            SET_ACTIVE_NODE({ ...node });
        }
        SET_INFO_WINDOW(node);
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

    const imgSrc = function () {
        if (node && node.img && typeof node.img === 'string') return node.img;
        if (node && node.img) return URL.createObjectURL(node.img);
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
            {infoBox ? (
                <InfoWindow
                    position={{ lat: infoBox.lat, lng: infoBox.lng }}
                    onCloseClick={() => {
                        SET_INFO_WINDOW(null);
                    }}
                >
                    <div className="info-window-inner">
                        <div className="if-overflow">
                            <h1>{infoBox.title}</h1>
                            <p>{infoBox.text}</p>
                            <div className="if-image-container">
                                {infoBox.img ? (
                                    <>
                                        <img className="preview-img" src={imgSrc()} />
                                    </>
                                ) : null}
                            </div>
                            <div className="if-music-container">
                                {infoBox.soundMedia ? (
                                    <SpotPlayerLoader uri={infoBox.soundMedia} customWidth="90%" />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </InfoWindow>
            ) : null}
        </div>
    ) : null;
};
export default connector(PreviewMarker);
