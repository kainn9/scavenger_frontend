import React, { useState, useEffect } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import SpotifyPlayer from 'react-spotify-player';

interface Props {
    uri: string;
}
const SpotPlayerLoader: React.FC<Props> = function ({ uri }) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [uriSwap, setUriSwap] = useState<string>('spotify:album:27ftYHLeunzcSzb33Wk1hf');
    useEffect(() => {
        setIsMounted(true);
        setUriSwap(uri);
    }, []);
    return isMounted ? (
        <SpotifyPlayer
            uri={uriSwap}
            size={{
                width: '230rem',
                height: uri.slice(8, 13) === 'track' ? '85rem' : '153rem',
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