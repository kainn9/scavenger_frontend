import React from 'react';
//import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { withRouter } from 'react-router-dom';

const Auth0ProviderWithHistory = ({ children }) => {
    const domain = process.env.REACT_APP_AUTH0_DOMAIN;
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
    // const redirectURI = process.env.REACT_APP_FRLINK;

    //const history = useHistory();

    // const onRedirectCallback = (appState) => {
    //     history.push(appState?.returnTo || window.location.pathname);
    // };
    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            redirectUri={`${process.env.REACT_APP_FRLINK}`}
            //onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

export default withRouter(Auth0ProviderWithHistory);
