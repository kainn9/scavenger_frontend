import React from 'react';
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import './App.scss';
import testPage from './pages/testPage';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type StateType = {
    transition?: string;
    timeout?: number;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type IndexProps = RouteComponentProps<{}, {}, StateType>;
const App: React.FC<IndexProps> = function ({ location }) {
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
                        <Route exact path="/" component={testPage} />
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </>
    );
};

export default withRouter(App);
