import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { activeNode, ARRootState } from '../../redux/active-route/activeRouteReducer';
import DefaultMap from '../default-map/DefaultMap';
import PreviewMarker from '../preview-marker/PreviewMarker';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import SpotPlayerLoader from '../spot-player-w-loader/SpotPlayerLoader';
import './PreviewMapStyles.scss';
import { useAuth0 } from '@auth0/auth0-react';
import DirectionsComp from '../directions/DirectionsComp';
import LikeBtn from '../like-btn/LikeBtn';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';

//redux
const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    activeNode: activeRoute.activeNode,
    // activeRoute: activeRoute.activeRoute,
    // routeLikes: activeRoute.userLikes,
    routeID: activeRoute.activeRouteID,
});
const connector = connect(msp);
type ReduxProps = ConnectedProps<typeof connector>;

interface props extends ReduxProps, RouteComponentProps {
    nodes: Array<activeNode>;
    creator: { email: string; creatorID: string };
    customHeight?: string;
    expandBtn?: boolean;
    routeIDOverride?: string;
    // routeLikesOverride?: Array<string>;
    syncCenter?: boolean;
}
const PreviewMap: React.FC<props> = function ({
    nodes,
    history,
    activeNode,
    // routeLikes,
    creator,
    customHeight,
    expandBtn,
    routeID,
    routeIDOverride,
    // routeLikesOverride,
    syncCenter,
}) {
    const renderNodes = function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return nodes.map((node: any) => {
            /*  
                -backend node data schema is slightly different than active node for images
                -mapping over/correcting difference by checking for nested url and setting it as img prop
            */
            if (node.img && node.img.url) node.img = node.img.url;
            return <PreviewMarker key={node._id} node={node} noDrag disableIFV />;
        });
    };
    const { getAccessTokenSilently } = useAuth0();
    const likeRouteClickHandler = async () => {
        const token = await getAccessTokenSilently({ audience: `${process.env.REACT_APP_BASE_LINK}/` });
        const resp = await fetch(`${process.env.REACT_APP_BASE_LINK}/api/v1/users/likeRoute`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ routeID: routeIDOverride || routeID }),
        });

        resp.json().then(() => isRouteLikedByUser());
        // const data = await resp.json();
        // console.log(data);
    };
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const isRouteLikedByUser = async () => {
        // console.log('yeyeyeyeyey');
        const token = await getAccessTokenSilently({ audience: `${process.env.REACT_APP_BASE_LINK}/` });
        return fetch(
            `${process.env.REACT_APP_BASE_LINK}/api/v1/users/checkLike?routeID=${routeIDOverride || routeID}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
            .then((resp) => resp.json())
            .then((data) => setIsLiked(data.data.isLiked));
    };

    useEffect(() => {
        isRouteLikedByUser();
        // console.log('yeee', activeNode);
    }, [nodes]);
    // the goods:
    return nodes[0] ? (
        <div className="prev-map-wrapper">
            <div className="prev-map-header-container">
                <h1>{nodes[0].title}</h1>
                <p onClick={() => history.push(`/user/${creator.email}`)}>By {`${creator.email}`}</p>
                {isLiked ? (
                    <LikeBtn liked onClick={likeRouteClickHandler} />
                ) : (
                    <LikeBtn liked={false} onClick={likeRouteClickHandler} />
                )}
                {expandBtn ? (
                    <MapUiBtn
                        iconName="window maximize outline"
                        text="View"
                        bottomText
                        clickFN={() => history.push(`/routes/${routeIDOverride || routeID}`)}
                    />
                ) : null}
            </div>
            <div className="preview-map">
                <DefaultMap
                    clMarkerEnabled
                    noSearch
                    customHeight={customHeight || '30vh'}
                    doNotSyncCenter={syncCenter ? false : true}
                    customCenter={
                        activeNode
                            ? { lat: activeNode.lat, lng: activeNode.lng }
                            : { lat: nodes[0].lat, lng: nodes[0].lng }
                    }
                >
                    {renderNodes()}
                    {nodes && nodes.length > 1 ? <DirectionsComp overideRoute={nodes} /> : null}
                </DefaultMap>
            </div>
            <div className="marker-preview">
                {activeNode ? (
                    <div className="active-preview">
                        <h1>{activeNode.title}</h1>
                        {activeNode.text ? <p>{activeNode.text}</p> : null}
                        {activeNode.img ? <img className="marker-prev-img" src={`${activeNode.img}`} /> : null}
                        {activeNode.soundMedia ? <SpotPlayerLoader uri={activeNode.soundMedia} /> : null}
                    </div>
                ) : (
                    <div className="node-prev-empty">
                        <div className="emp-text">Node Preview Zone</div>
                        <Icon className="map signs" />
                    </div>
                )}
            </div>
        </div>
    ) : null;
};

export default withRouter(connector(PreviewMap));
