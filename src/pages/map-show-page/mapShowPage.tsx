import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import PreviewMap from '../../components/preview-map/PreviewMap';
import { backendRoute } from '../../redux/active-route/activeRouteReducer';
import { useAuth0 } from '@auth0/auth0-react';
import './mapShowPageStyles.scss';
import MapUiBar from '../../components/map-ui-bar/MapBar';
import LogoutButton from '../../components/logout-button/LogoutButton';
import MapUiBtn from '../../components/default-map-ui-btn/MapUiBtn';

const mapShowPage: React.FC<RouteComponentProps<{ routeID: string }>> = function ({ match, history }) {
    const { getAccessTokenSilently, user } = useAuth0();
    const [mapData, setMapData] = useState<backendRoute | null>(null);
    const [isRouteValid, setRouteInvalid] = useState<boolean>(false);
    const {
        params: { routeID },
    } = match;
    useEffect(() => {
        const fetchRoute = async () => {
            const token = await getAccessTokenSilently({ audience: `${process.env.REACT_APP_BASE_LINK}/` });

            const resp = await fetch(`${process.env.REACT_APP_BASE_LINK}/api/v1/routes/${routeID}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (resp.ok) {
                const data = await resp.json();
                setMapData(data.data.route);
                console.log(data);
            } else {
                setRouteInvalid(true);
            }
        };
        fetchRoute();
    }, []);
    // if ID is bad
    if (isRouteValid) return <div>{`Route ID ${routeID} is invalid`}</div>;
    // otherwise wait for map Data
    return (
        <>
            {!mapData ? (
                <div>loading</div>
            ) : (
                <div className="show-map-container">
                    <PreviewMap
                        syncCenter
                        nodes={mapData.nodes}
                        customHeight="40vh"
                        creator={{ email: mapData.creator.email, creatorID: mapData.creator.id }}
                        routeIDOverride={routeID}
                        // routeLikesOverride={mapData.userLikes}
                    />
                </div>
            )}
            <MapUiBar>
                <LogoutButton />
                <MapUiBtn iconName="user circle" text="Profile" clickFN={() => history.push(`/user/${user.email}`)} />
                <MapUiBtn iconName="edit" text="Create" clickFN={() => history.push('/create')} />
                <MapUiBtn iconName="map" text="Home" clickFN={() => history.push('/home')} />
            </MapUiBar>
        </>
    );
};
export default withRouter(mapShowPage);
