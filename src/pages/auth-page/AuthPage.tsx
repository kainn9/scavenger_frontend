import './AuthPageStyles.scss';
import React from 'react';
import LoginButton from '../../components/login-button/LoginButton';
/**
 * Component is page for user login
 *
 * @component

 */
const AuthPage: React.FC = function () {
    return (
        <div className="auth-page">
            <div className="auth-page-login-card">
                <h1>Welcome to Scavenger</h1>
                <LoginButton />
            </div>
        </div>
    );
};

export default AuthPage;
