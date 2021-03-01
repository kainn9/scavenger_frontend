import React, { useState, useEffect } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import SpotifyPlayer from 'react-spotify-player';

interface Props {
    uri: string;
}
const SpotPlayerLoader: React.FC<Props> = function ({ uri }) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted ? (
        <SpotifyPlayer
            uri={uri}
            size={{
                width: '100%',
                height: '45%',
            }}
            view="list"
            theme="black"
        />
    ) : (
        <Dimmer active>
            <Loader />
        </Dimmer>
    );
};

export default SpotPlayerLoader;
