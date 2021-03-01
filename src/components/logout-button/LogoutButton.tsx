import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';

const LogoutButton: React.FC = () => {
    const { logout } = useAuth0();
    return (
        <MapUiBtn
            iconName="hand peace"
            text="Logout"
            clickFN={() =>
                logout({
                    returnTo: 'https://scavenger-frontend.vercel.app/',
                })
            }
        />
    );
};

export default LogoutButton;
