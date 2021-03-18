import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { activeNode, ARRootState } from '../../redux/active-route/activeRouteReducer';
import DefaultMap from '../default-map/DefaultMap';
import PreviewMarker from '../preview-marker/PreviewMarker';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import SpotPlayerLoader from '../spot-player-w-loader/SpotPlayerLoader';
import './PreviewMapStyles.scss';

//redux
const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    activeNode: activeRoute.activeNode,
});
const connector = connect(msp);
type ReduxProps = ConnectedProps<typeof connector>;

interface props extends ReduxProps, RouteComponentProps {
    nodes: Array<activeNode>;
    creator: { email: string; creatorID: string };
    customHeight?: string;
}
const PreviewMap: React.FC<props> = function ({ nodes, history, activeNode, creator, customHeight }) {
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
    return nodes[0] ? (
        <div className="prev-map-wrapper">
            <div className="prev-map-header-container">
                <h1>{nodes[0].title}</h1>
                <p onClick={() => history.push(`/user/${creator.email}`)}>By {`${creator.email}`}</p>
            </div>
            <div className="preview-map">
                <DefaultMap
                    clMarkerEnabled
                    noSearch
                    customHeight={customHeight || '30vh'}
                    doNotSyncCenter
                    customCenter={{ lat: nodes[0].lat, lng: nodes[0].lng }}
                >
                    {renderNodes()}
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
