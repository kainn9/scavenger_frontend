import React, { useState, useEffect } from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';
import { Action, activeNode, activeRoute, ARRootState } from '../../redux/active-route/activeRouteReducer';
import './PreviewMarkerStyles.scss';
import signPostIcon from '../../assets/sign-post-icon.png';
import { SET_ACTIVE_NODE, SET_ACTIVE_ROUTE } from '../../redux/active-route/activeRouteActions';
import { connect, ConnectedProps } from 'react-redux';
import SpotPlayerLoader from '../spot-player-w-loader/SpotPlayerLoader';

// redux
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
    noDrag?: boolean;
    disableIFV?: boolean;
}

/**
 * google maps child component, renders activeRoute and stores data to be rendered by InfoView/ edit-form OnClicked
 * @param props.node current node data for the marker to render
 * @activeNode currentNode in redux
 * @activeRoute activeNode[], current route being saved/edited
 * @SET_ACTIVE_NODE redux action, sets activeNode redux(used for selection)
 * @SET_ACTIVE_ROUTE redux action, sets activeRoute in redux(used to rerender route upon saved edits)

 */
const PreviewMarker: React.FC<Props> = function ({
    node,
    disableIFV,
    noDrag,
    activeNode,
    activeRoute,
    SET_ACTIVE_NODE,
    SET_ACTIVE_ROUTE,
}) {
    /**
    * function reverts lat/lng of activeNode's corrosponding object(inside activeRoute)
    * @param props.route current node data for the marker to render


    */
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
    /**
    * function first reverts postion of current activeNode(if pos is edited && unsaved) sets current marker data as activeNode, and opens the infoView

    */
    const clickHandler = () => {
        // if active node key matches node key -or- no activeNode
        if ((activeNode && node && activeNode.key !== node.key) || (node && !activeNode)) {
            if (activeRoute) revertOldNodePosOnSwitch([...activeRoute]);
            SET_ACTIVE_NODE({ ...node });
        }
        toggleIFV((ps) => !ps);
    };
    /**
    * function first reverts postion of current activeNode(if pos is edited && unsaved) sets current marker data as activeNode, opens the infoView, and updates the corrosponding nodes lat/lng inside activeRoute based on dragend pos

    */
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
        toggleIFV(true);
    };
    /**
    * function checks if markers img Data is a url or file, and either returns the url or the file converted into a url
    * @returns url for image
    
    */
    const imgSrc = function () {
        if (node && node.img && typeof node.img === 'string') return node.img;
        if (node && node.img) return URL.createObjectURL(node.img);
    };
    // boolean, toggles if infoView window should be rendered for the marker
    const [IFV, toggleIFV] = useState<boolean>(false);
    // open infoview when marker mounts
    useEffect(() => {
        if (node && node.title) toggleIFV(true);
    }, []);

    return node ? (
        <div className="test1">
            <Marker
                draggable={noDrag ? false : true}
                label={node.title}
                position={{ lat: node.lat, lng: node.lng }}
                icon={{
                    url: signPostIcon,
                    scaledSize: new window.google.maps.Size(40, 40),
                    origin: new window.google.maps.Point(0, 0),
                    labelOrigin: new window.google.maps.Point(20, 47),
                }}
                onClick={clickHandler}
                onDragEnd={updateActiveNodeOnDrag}
            ></Marker>
            {IFV && !disableIFV ? (
                <InfoWindow
                    position={{ lat: node.lat, lng: node.lng }}
                    onCloseClick={() => {
                        toggleIFV((ps) => !ps);
                    }}
                >
                    <div className="info-window-inner">
                        <div className="if-overflow">
                            <h1>{node.title}</h1>
                            <p>{node.text}</p>
                            <div className="if-image-container">
                                {node.img ? (
                                    <>
                                        <img className="preview-img" src={imgSrc()} />
                                    </>
                                ) : null}
                            </div>
                            <div className="if-music-container">
                                {node.soundMedia ? <SpotPlayerLoader uri={node.soundMedia} customWidth="90%" /> : null}
                            </div>
                        </div>
                    </div>
                </InfoWindow>
            ) : null}
        </div>
    ) : null;
};
export default connector(PreviewMarker);
