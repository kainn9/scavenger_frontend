import React from 'react';
import { Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const ProtectedRoute = ({ component, ...args }) => (
    <Route
        component={withAuthenticationRequired(component, {
            // eslint-disable-next-line react/display-name
            onRedirecting: () => <div>Loading</div>,
        })}
        {...args}
    />
);

export default ProtectedRoute;
