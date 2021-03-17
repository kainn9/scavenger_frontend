import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import MapUiBtn from '../../components/default-map-ui-btn/MapUiBtn';
import DefaultMap from '../../components/default-map/DefaultMap';
import FindMeBtn from '../../components/find-me-btn/FindMeBtn';
import LockPosBtn from '../../components/lock-pos-btn/LockPosBtn';
import LogoutButton from '../../components/logout-button/LogoutButton';
import MapUiBar from '../../components/map-ui-bar/MapBar';
import RouteHead from '../../components/route-heads-marker/RouteHead';
import { SET_MAP_SUCCESS_MSG } from '../../redux/map/mapActions';
import { Action, MRootState } from '../../redux/map/mapReducer';
import './HomePageStyles.scss';

// redux
const msp = ({ map }: { map: MRootState }) => ({
    mapMsg: map.mapMsg,
    center: map.center,
});

const mdp = (dispatch: (action: Action) => void) => ({
    SET_MAP_SUCCESS_MSG: (mapMsg: string) => dispatch(SET_MAP_SUCCESS_MSG(mapMsg)),
});

const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;

/**
 * Component is home page for viewing routes made by other users
 * @history history prop from withRouter

 */
const HomePage: React.FC<RouteComponentProps & reduxProps> = function ({
    history,
    center,
    mapMsg,
    SET_MAP_SUCCESS_MSG,
}) {
    const { user, getAccessTokenSilently } = useAuth0();
    interface rHeader {
        title: string;
        _id: string;
        startLocation: { type: string; coordinates: number[] };
    }
    const [routeHeaders, setRouteHeaders] = useState<rHeader[] | null>(null);
    useEffect(() => {
        async function fetchRouteHeaders() {
            const token = await getAccessTokenSilently({ audience: `${process.env.REACT_APP_BASE_LINK}/` });
            const resp = await fetch(
                //routes/radius/:distance/center/:point
                `${process.env.REACT_APP_BASE_LINK}/api/v1/routes/radius/${15}/center/${center.lat},${center.lng}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (resp.ok) {
                const data = await resp.json();
                const {
                    data: { routes },
                } = data;

                setRouteHeaders(routes);
                console.log('routes in range:', routes);
            }
        }

        fetchRouteHeaders();
    }, [center]);
    const renderRouteHeaders = () => {
        if (routeHeaders) {
            return routeHeaders.map((rh) => (
                <RouteHead
                    key={rh._id}
                    title={rh.title}
                    id={rh._id}
                    lat={rh.startLocation.coordinates[1]}
                    lng={rh.startLocation.coordinates[0]}
                />
            ));
        } else return null;
    };
    return (
        <div className="h-page">
            {mapMsg ? (
                <div className="suc-msg">
                    Route Saved at {mapMsg.toString()}
                    <MapUiBtn iconName="times circle" text="" clickFN={() => SET_MAP_SUCCESS_MSG('')} />
                </div>
            ) : null}
            <DefaultMap clMarkerEnabled>{renderRouteHeaders()} </DefaultMap>
            <MapUiBar>
                <LogoutButton />
                <MapUiBtn iconName="user circle" text="Profile" clickFN={() => history.push(`/user/${user.email}`)} />
                <MapUiBtn iconName="edit" text="Create" clickFN={() => history.push('/create')} />
                <LockPosBtn />
                <FindMeBtn />
            </MapUiBar>
        </div>
    );
};

export default withRouter(connector(HomePage));
