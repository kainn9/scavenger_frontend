import React, { useState, useEffect } from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';
import signPostIcon from '../../assets/sign-post-icon.png';
import PreviewMap from '../preview-map/PreviewMap';
import './RouteHeadStyles.scss';
import { connect, ConnectedProps } from 'react-redux';
import { Action, MRootState } from '../../redux/map/mapReducer';
import { SET_MAP_IFV } from '../../redux/map/mapActions';
import { activeNode } from '../../redux/active-route/activeRouteReducer';
import { SET_ACTIVE_NODE } from '../../redux/active-route/activeRouteActions';
import { useAuth0 } from '@auth0/auth0-react';

// redux
const msp = ({ map }: { map: MRootState }) => ({
    mapIFV: map.mapIFV,
});

const mdp = (dispatch: (action: Action) => void) => ({
    SET_MAP_IFV: (mapIFV: MRootState['mapIFV']) => dispatch(SET_MAP_IFV(mapIFV)),
    SET_ACTIVE_NODE: (node: activeNode | null) => dispatch(SET_ACTIVE_NODE(node)),
});

const connector = connect(msp, mdp);
type ReduxProps = ConnectedProps<typeof connector>;

interface props extends ReduxProps {
    title: string;
    id: string;
    lat: number;
    lng: number;
}
const RouteHead: React.FC<props> = function ({ title, lat, lng, id, mapIFV, SET_MAP_IFV, SET_ACTIVE_NODE }) {
    const { getAccessTokenSilently } = useAuth0();
    const [routeHeaderID, setRouteHeaderID] = useState<false | string>(false);
    const [creator, setCreator] = useState<false | { email: string; creatorID: string }>(false);
    const [routeID, setRouteID] = useState<null | string>(null);
    const previewRoute = async () => {
        const token = await getAccessTokenSilently({ audience: `${process.env.REACT_APP_BASE_LINK}/` });
        const resp = await fetch(`${process.env.REACT_APP_BASE_LINK}/api/v1/routes/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (resp.ok) {
            const data = await resp.json();
            const {
                data: {
                    route: { nodes, creator, id },
                },
            } = data;

            SET_ACTIVE_NODE(null);
            SET_MAP_IFV(nodes);
            setRouteHeaderID(nodes[0].key);
            setCreator({ email: creator.email, creatorID: creator._id });
            setRouteID(id);
        }
    };

    // cleanup for activenode when switching pages
    useEffect(() => {
        return () => SET_ACTIVE_NODE(null);
    }, []);
    return (
        <>
            <Marker
                label={title}
                position={{ lat: lat, lng: lng }}
                icon={{
                    url: signPostIcon,
                    scaledSize: new window.google.maps.Size(40, 40),
                    origin: new window.google.maps.Point(0, 0),
                    labelOrigin: new window.google.maps.Point(20, 47),
                }}
                onClick={previewRoute}
            ></Marker>
            {mapIFV && creator && mapIFV[0].key === routeHeaderID && routeID ? (
                <InfoWindow
                    position={{ lat: lat, lng: lng }}
                    onCloseClick={() => {
                        SET_MAP_IFV(false);
                    }}
                >
                    <div id="ifv-div-wrapper">
                        <div className="ifv-map-container">
                            <PreviewMap expandBtn nodes={mapIFV} creator={creator} routeIDOverride={routeID} />
                        </div>
                    </div>
                </InfoWindow>
            ) : null}
        </>
    );
};

export default connector(RouteHead);
