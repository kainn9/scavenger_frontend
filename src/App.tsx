import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Route, Switch, withRouter, RouteComponentProps, Redirect } from 'react-router-dom';
import './App.scss';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from './auth/protected-route';
import HomePage from './pages/home-map-page/HomePage';
import AuthPage from './pages/auth-page/AuthPage';
import { Dimmer, Loader } from 'semantic-ui-react';
import CreatePage from './pages/create-map-page/CreatePage';

type StateType = {
    transition?: string;
    timeout?: number;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type IndexProps = RouteComponentProps<{}, {}, StateType>;

const App: React.FC<IndexProps> = function ({ location }) {
    const { isLoading, isAuthenticated } = useAuth0();
    if (isLoading) {
        return (
            <Dimmer active>
                <Loader />
            </Dimmer>
        );
    }
    return (
        <>
            <TransitionGroup
                id="transition-group"
                childFactory={(child) =>
                    React.cloneElement(child, {
                        classNames: location.state ? location.state.transition : 'default',
                        timeout: location.state ? location.state.timeout : 0,
                    })
                }
            >
                <CSSTransition timeout={1500} key={location.key}>
                    <Switch location={location}>
                        <Route
                            exact
                            path="/"
                            render={() => (isAuthenticated ? <Redirect to="/home" /> : <AuthPage />)}
                        />
                        <ProtectedRoute path="/home" component={HomePage} />
                        <ProtectedRoute path="/create" component={CreatePage} />
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </>
    );
};

export default withRouter(App);
