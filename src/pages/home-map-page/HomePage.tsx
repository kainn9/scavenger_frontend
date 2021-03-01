import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import MapUiBtn from '../../components/default-map-ui-btn/MapUiBtn';
import DefaultMap from '../../components/default-map/DefaultMap';
import FindMeBtn from '../../components/find-me-btn/FindMeBtn';
import LockPosBtn from '../../components/lock-pos-btn/LockPosBtn';
import LogoutButton from '../../components/logout-button/LogoutButton';
import MapUiBar from '../../components/map-ui-bar/MapBar';

const HomePage: React.FC<RouteComponentProps> = function ({ history }) {
    return (
        <>
            <DefaultMap
                // loadingElement={<div className="loading-element" />}
                // containerElement={<div className="view-map" />}
                // mapElement={<div className="map-element" />}
                clMarkerEnabled
            />
            <MapUiBar>
                <LogoutButton />
                <MapUiBtn iconName="user circle" text="Profile" />
                <MapUiBtn iconName="edit" text="Create" clickFN={() => history.push('/create')} />
                <LockPosBtn />
                <FindMeBtn />
            </MapUiBar>
        </>
    );
};

export default withRouter(HomePage);
