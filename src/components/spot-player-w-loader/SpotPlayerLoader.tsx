import React, { useState, useEffect } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import SpotifyPlayer from 'react-spotify-player';

interface Props {
    uri: string;
    customWidth?: string;
}
/**
* component wraps SpotifyPlayer(from npm) and adds a semantic loader/dimmer
* @param props.uri spotify uri string for playlist, podcast, or song
* @param props.customWidth width overide prop

*/
const SpotPlayerLoader: React.FC<Props> = function ({ uri, customWidth }) {
    // music player sometimes breaks if a song is the first format provided so the
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [uriSwap, setUriSwap] = useState<string>('spotify:album:27ftYHLeunzcSzb33Wk1hf');
    useEffect(() => {
        setIsMounted(true);
        setUriSwap(uri);
        console.log(uriSwap);
    }, []);
    return isMounted ? (
        <SpotifyPlayer
            uri={uriSwap}
            size={{
                width: customWidth || '230rem',
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
