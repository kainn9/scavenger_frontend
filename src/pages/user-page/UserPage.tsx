/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react';
import './UserPageStyles.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import PreviewMap from '../../components/preview-map/PreviewMap';
import { Icon } from 'semantic-ui-react';
import { activeRoute, ARRootState, backendRoute } from '../../redux/active-route/activeRouteReducer';
import RouteSearchResultPreview from '../../components/route-search-preview/RouteSearchResultPreview';
import { connect, ConnectedProps } from 'react-redux';
import MapUiBar from '../../components/map-ui-bar/MapBar';
import MapUiBtn from '../../components/default-map-ui-btn/MapUiBtn';
import LogoutButton from '../../components/logout-button/LogoutButton';
import { SET_ACTIVE_ROUTE, SET_ROUTE_ID } from '../../redux/active-route/activeRouteActions';

//redux
const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    activeRoute: activeRoute.activeRoute,
    likeEvent: activeRoute.likeEvent,
});
const mdp = (dispatch: (action: { type: string }) => void) => ({
    SET_ACTIVE_ROUTE: (route: activeRoute | null) => dispatch(SET_ACTIVE_ROUTE(route)),
    SET_ROUTE_ID: (id: null) => dispatch(SET_ROUTE_ID(id)),
});
const connector = connect(msp, mdp);
type ReduxProps = ConnectedProps<typeof connector>;

interface user {
    email: string;
    id: string;
    routes: Array<backendRoute>;
    likes: Array<backendRoute>;
}
const UserPage: React.FC<RouteComponentProps<{ email: string }> & ReduxProps> = function ({
    history,
    match,
    activeRoute,
    likeEvent,
    SET_ROUTE_ID,
}) {
    const {
        params: { email },
    } = match;
    const { getAccessTokenSilently } = useAuth0();
    const [userFound, setUserFound] = useState<boolean>(true);
    const [user, setUser] = useState<user | null>(null);
    const [showLikes, setShowLikes] = useState<boolean>(false);
    useEffect(() => {
        const fetchUser = async () => {
            const token = await getAccessTokenSilently({ audience: `${process.env.REACT_APP_BASE_LINK}/` });

            const resp = await fetch(`${process.env.REACT_APP_BASE_LINK}/api/v1/users/email/?email=${email}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!resp.ok) setUserFound(false);
            else {
                const userData = await resp.json();

                setUser((ps: null | user) => {
                    // must return a new object as first arg, use a cb function otherwise state will lag 1 step behind since async
                    return Object.assign({}, ps || userData.data.user, { likes: userData.data.user.likes });
                });
            }
        };
        fetchUser();
    }, [likeEvent]);
    // cleanup
    useEffect(() => {
        const cleanUp = () => {
            SET_ACTIVE_ROUTE(null);
            SET_ROUTE_ID(null);
        };

        return cleanUp();
    }, []);

    const renderUserRoutes = () => {
        if (user) {
            if (user.routes.length === 0) return <h1>{email} has not created any routes</h1>;

            return user.routes.map((route, i) => <RouteSearchResultPreview key={i} route={route} />);
        }
        return <h1>searching for {email} routes</h1>;
    };
    const renderUserLikes = () => {
        if (user) {
            if (user.likes.length === 0)
                return <h1 style={{ textAlign: 'center' }}>{email} has not liked any routes</h1>;

            return user.likes.map((route, i) => <RouteSearchResultPreview key={i} route={route} />);
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
            <div className="user-routes-preview-container">{showLikes ? renderUserLikes() : renderUserRoutes()}</div>
        </div>
    ) : (
        <div className="user-page">
            <h1 id="user-email-header">{`${email}'s Page`}</h1>
            <div className="prev-map-container">
                {activeRoute && activeRoute.length ? (
                    <PreviewMap expandBtn nodes={activeRoute} creator={{ email: user!.email, creatorID: user!.id }} />
                ) : (
                    <>
                        <h1>Route Preview</h1>
                        <Icon className="map" />
                    </>
                )}
            </div>
            <div className="user-route-show-opt">
                <div className="user-toggle-created" onClick={() => setShowLikes(false)}>
                    <h1 style={showLikes ? { color: 'grey' } : {}}>View Routes</h1>
                </div>
                <div className="user-toggle-likes" onClick={() => setShowLikes(true)}>
                    {' '}
                    <h1 style={!showLikes ? { color: 'grey' } : {}}>View Liked Routes</h1>
                </div>
            </div>
            <div className="user-routes-preview-container">{showLikes ? renderUserLikes() : renderUserRoutes()}</div>
            <MapUiBar>
                <LogoutButton />
                <MapUiBtn iconName="user circle" text="Profile" clickFN={() => history.push(`/user/${user.email}`)} />
                <MapUiBtn iconName="edit" text="Create" clickFN={() => history.push('/create')} />
                <MapUiBtn iconName="map" text="Home" clickFN={() => history.push('/home')} />
            </MapUiBar>
        </div>
    );
};

export default withRouter(connector(UserPage));
