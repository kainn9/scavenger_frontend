import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';
/**
 * btn component, allows user logout via auth0 logout fn
 */
const LogoutButton: React.FC = () => {
    const { logout } = useAuth0();
    return (
        <MapUiBtn
            iconName="hand peace"
            text="Logout"
            clickFN={() =>
                logout({
                    returnTo: `${process.env.REACT_APP_FRLINK}`,
                })
            }
        />
    );
};

export default LogoutButton;
