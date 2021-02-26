import React, { useEffect } from 'react';
import HomeMap from '../components/default-map/DefaultMap';
import LoginButton from '../components/login-button/LoginButton';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from '../components/logout-button/LogoutButton';
import SpotifyPlayer from 'react-spotify-player';

const testPage: React.FC = () => {
    // size may also be a plain string using the presets 'large' or 'compact'
    const size = {
        width: '100%',
        height: 300,
    };
    const view = 'list'; // or 'coverart'
    const theme = 'black'; // or 'white'

    return (
        <>
            {/* <HomeMap
                googleMapURL={`https://maps.google.com/maps/api/js?key=${process.env.REACT_APP_GOOGK}`}
                loadingElement={<div className="loading-element" />}
                containerElement={<div className="view-map" />}
                mapElement={<div className="map-element" />}
            /> */}
            <LoginButton />
            <LogoutButton />
            <SpotifyPlayer uri="spotify:track:7lEptt4wbM0yJTvSG5EBof" size={size} view={view} theme={theme} />
            {console.log(useAuth0().user)}
        </>
    );
};

export default testPage;
