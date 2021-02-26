import './LoginButtonStyles.scss';
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Icon } from 'semantic-ui-react';

type PaperPlaneIconString = 'paper plane outline' | 'paper plane';

const LoginButton: React.FC = () => {
    const [paperPlaneIcon, setPaperPlaneIcon] = useState<PaperPlaneIconString>('paper plane outline');
    const { loginWithRedirect } = useAuth0();
    return (
        <div
            className="login-btn"
            onClick={() => loginWithRedirect({ redirectUri: `${process.env.REACT_APP_FRLINK}` })}
            onMouseOver={() => setPaperPlaneIcon('paper plane')}
            onMouseLeave={() => setPaperPlaneIcon('paper plane outline')}
        >
            <Icon name={paperPlaneIcon} />
            <h2>Login/Signup</h2>
        </div>
    );
};

export default LoginButton;
