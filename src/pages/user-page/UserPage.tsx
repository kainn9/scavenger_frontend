/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react';
import './UserPageStyles.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import PreviewMap from '../../components/preview-map/PreviewMap';
import { Icon } from 'semantic-ui-react';
import { Action, activeRoute, ARRootState, backendRoute } from '../../redux/active-route/activeRouteReducer';
import RouteSearchResultPreview from '../../components/route-search-preview/RouteSearchResultPreview';
import { connect, ConnectedProps } from 'react-redux';
import MapUiBar from '../../components/map-ui-bar/MapBar';
import MapUiBtn from '../../components/default-map-ui-btn/MapUiBtn';
import LogoutButton from '../../components/logout-button/LogoutButton';
import { SET_ACTIVE_ROUTE } from '../../redux/active-route/activeRouteActions';

//redux
const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    activeRoute: activeRoute.activeRoute,
});
const mdp = (dispatch: (action: Action) => void) => ({
    SET_ACTIVE_ROUTE: (route: activeRoute | null) => dispatch(SET_ACTIVE_ROUTE(route)),
});
const connector = connect(msp, mdp);
type ReduxProps = ConnectedProps<typeof connector>;

interface user {
    email: string;
    id: string;
    routes: Array<backendRoute>;
}
const UserPage: React.FC<RouteComponentProps<{ email: string }> & ReduxProps> = function ({
    history,
    match,
    activeRoute,
    SET_ACTIVE_ROUTE,
}) {
    const {
        params: { email },
    } = match;
    const { getAccessTokenSilently } = useAuth0();
    const [userFound, setUserFound] = useState<boolean>(true);
    const [user, setUser] = useState<user | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            const token = await getAccessTokenSilently({ audience: `${process.env.REACT_APP_BASE_LINK}/` });
            console.log(`${process.env.REACT_APP_BASE_LINK}/api/v1/users/email?email=${email}`);
            const resp = await fetch(`${process.env.REACT_APP_BASE_LINK}/api/v1/users/email/?email=${email}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!resp.ok) setUserFound(false);
            else {
                const userData = await resp.json();
                setUser(userData.data.user);
            }
        };
        fetchUser();
    }, []);
    useEffect(() => SET_ACTIVE_ROUTE(null), []);
    const renderUserRoutes = () => {
        if (user) {
            if (user.routes.length === 0) return <h1>{email} has not created any routes</h1>;

            return user.routes.map((route, i) => <RouteSearchResultPreview key={i} route={route} />);
        }
        return <h1>searching for {email} routes</h1>;
    };

    if (!userFound)
        return (
            <div className="user-page">
                <h1> No user found for email: {email}</h1>
            </div>
        );
    return !user ? (
        <div className="user-page">
            <h1>{`getting data for: ${email}`}</h1>
            <div className="prev-map-container">
                <h1>Route Preview</h1>
                <Icon className="map" />
            </div>
            <div className="user-routes-preview-container">{renderUserRoutes()}</div>
        </div>
    ) : (
        <div className="user-page">
            <h1>{`${email}'s Page`}</h1>
            <div className="prev-map-container">
                {activeRoute && activeRoute.length ? (
                    <PreviewMap nodes={activeRoute} creator={{ email: user!.email, creatorID: user!.id }} />
                ) : (
                    <>
                        <h1>Route Preview</h1>
                        <Icon className="map" />
                    </>
                )}
            </div>
            <div className="user-routes-preview-container">{renderUserRoutes()}</div>
            <MapUiBar>
                <LogoutButton />
                <MapUiBtn iconName="map" text="Home" clickFN={() => history.push('/home')} />
                <MapUiBtn iconName="edit" text="Create" clickFN={() => history.push('/create')} />
            </MapUiBar>
        </div>
    );
};

export default withRouter(connector(UserPage));
