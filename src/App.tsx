import React, { useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Route, Switch, withRouter, RouteComponentProps, Redirect } from 'react-router-dom';
import './App.scss';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from './auth/protected-route';
import HomePage from './pages/home-map-page/HomePage';
import AuthPage from './pages/auth-page/AuthPage';
import { Dimmer, Loader } from 'semantic-ui-react';
import CreatePage from './pages/create-map-page/CreatePage';
import UserPage from './pages/user-page/UserPage';
import mapShowPage from './pages/map-show-page/mapShowPage';

/**
 * Component for routing and routings anims
 *
 * @component
 */

// props
type StateType = {
    transition?: string; // classname for routing animations
    timeout?: number; // animation length / how long both pages are visiblr
};
// eslint-disable-next-line @typescript-eslint/ban-types
type IndexProps = RouteComponentProps<{}, {}, StateType>;

const App: React.FC<IndexProps> = function ({ location }) {
    // render loader if while waiting to see if user is authenticated
    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    useEffect(() => {
        const getUserData = async () => {
            if (isAuthenticated) {
                const token = await getAccessTokenSilently({ audience: `${process.env.REACT_APP_BASE_LINK}/` });

                if (token) {
                    fetch(`${process.env.REACT_APP_BASE_LINK}/api/v1/users/validate`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }
            }
        };

        getUserData();
    }, [isAuthenticated]);

    if (isLoading) {
        return (
            <Dimmer active>
                <Loader />
            </Dimmer>
        );
    }
    return (
        <>
            {/* TransitionGroup -> HOC for handling routing anims */}
            <TransitionGroup
                id="transition-group"
                // childFactory + react.cloneEl lets transGrp apply css classes for anim based on injected state
                childFactory={(child) =>
                    React.cloneElement(child, {
                        classNames: location.state ? location.state.transition : 'default',
                        timeout: location.state ? location.state.timeout : 0,
                    })
                }
            >
                {/* Hoc passes in the injected props from TransGroup for routing anims */}
                <CSSTransition timeout={1500} key={location.key}>
                    <Switch location={location}>
                        {/* login page/rootpage is not protected but will redirect authenticated users to home page */}
                        <Route
                            exact
                            path="/"
                            render={() => (isAuthenticated ? <Redirect to="/home" /> : <AuthPage />)}
                        />
                        {/* protected routes redirect to login automatically  */}
                        <ProtectedRoute path="/home" component={HomePage} />
                        <ProtectedRoute path="/create" component={CreatePage} />
                        <ProtectedRoute path="/user/:email" component={UserPage} />
                        <ProtectedRoute path="/routes/:routeID" component={mapShowPage} />
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </>
    );
};

export default withRouter(App);
