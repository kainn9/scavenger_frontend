/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import './SpotifySearchStyles.scss';
import { useAuth0 } from '@auth0/auth0-react';
import SpotifySearchPreview from '../spotify-search-preview/SpotifySearchPreview';
import { Action, ARRootState } from '../../redux/active-route/activeRouteReducer';
import { connect, ConnectedProps } from 'react-redux';
import SpotPlayerLoader from '../spot-player-w-loader/SpotPlayerLoader';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';
import { SET_ACTIVE_SOUND } from '../../redux/active-route/activeRouteActions';


export interface soundMedia {
    artist: string | null;
    name: string;
    publisher: string | null;
    description: string | null;
    uri: string;
}

const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    activeNode: activeRoute.activeNode,
});
const mdp = (dispatch: (action: Action) => void) => ({
    SET_ACTIVE_SOUND: (uri: string | null) => dispatch(SET_ACTIVE_SOUND(uri)),
});
const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;

const SpotifySearch: React.FC<reduxProps> = function ({ activeNode, SET_ACTIVE_SOUND }) {
    const { user } = useAuth0();
    const [searchInput, setSearchInput] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [searchResults, setSearchResults] = useState<any>(null);
    const [resultType, setResultType] = useState<string>('tracks');

    const searchInputHandler = async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(value);

        let results = null;
        const trimmedInput = value.trim()
        if (trimmedInput.length > 0) {
            results = await Promise.all([
                `https://api.spotify.com/v1/search?q=${trimmedInput}&type=track&market=from_token`,
                `https://api.spotify.com/v1/search?q=${trimmedInput}&type=show&market=from_token`,
                `https://api.spotify.com/v1/search?q=${trimmedInput}&type=playlist&market=from_token`,
            ].map(async (url) => {
                const resp = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user['https://my.ns/spotify/access_token']}`,
                        Accept: 'application/json',
                        "Content-Type": 'application/json',
                    }
                })
    
                return resp.json()
            }));

        }
        let formatedResults = null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const format = (items: any[]) => items.map( (item) => {
            const { uri, name, publisher, artists, description } = item;
            console.log(item);
            return {
                uri: uri,
                name: name,
                publisher: publisher ? publisher : null,
                artist: artists ? artists[0].name : null,
                description: description ? description : null
            }
        })
        if (results) {
            const [{ tracks }, { shows }, { playlists } ] = results;
            formatedResults = {
                tracks: format(tracks.items),
                playlists: format(playlists.items),
                shows: format(shows.items),
            }
            return setSearchResults(formatedResults);
        };
        return setSearchResults(null);
    };

    const renderSearchResults = () => {
        
        if (searchResults && resultType === 'tracks') return (
            <>
                <h1 className="tracks-header">Track Results</h1>
                <div className="spotify-results-tracks">
                    {searchResults.tracks.map((track: soundMedia) => <SpotifySearchPreview {...track} key={track.uri}/>)}
                </div>
            </>
        ); 
        else if (searchResults && resultType === 'podcasts') return (
            <>
                <h1 className="tracks-header">Podcast Results</h1>
                <div className="spotify-results-tracks">
                    {searchResults.shows.map((show: soundMedia) => <SpotifySearchPreview {...show} key={show.uri}/>)}
                </div>
            </>
        );
        else if (searchResults && resultType === 'playlists') return (
            <>
                <h1 className="tracks-header">Playlist Results</h1>
                <div className="spotify-results-tracks">
                    {searchResults.playlists.map((pl: soundMedia) => <SpotifySearchPreview {...pl} key={pl.uri}/>)}
                </div>
            </>
        )
    };

    return (
        activeNode && activeNode.soundMedia ? (
            <div className="spotify-emb-container">
                <SpotPlayerLoader uri={activeNode.soundMedia} />
                <div className="spacer" style={{height: '3rem'}}></div>
                <MapUiBtn iconName="trash alternate" text="Clear Media" bottomText  clickFN={() => SET_ACTIVE_SOUND(null)}/>
            </div>
            
        ) : (
            <div className="spotify-search-container">
            <div className="spotify-search-options">
                <div className="ss-type-btn" onClick={() => setResultType('tracks')}>Tracks</div>
                <div className="ss-type-btn" onClick={() => setResultType('podcasts')}>Podcasts</div>
                <div className="ss-type-btn" onClick={() => setResultType('playlists')}>Playlists</div>
            </div>

        <div className="spotify-search">
            <div className="ss-input-wrapper">
                <input type="text" value={searchInput} onChange={searchInputHandler} />
            </div>
            
            <div className="ss-icon-wrapper">
                <Icon className="search" />
            </div>
            <div className={`ss-results ${searchResults ? 'ss-results-active' : ''}`}>
                {renderSearchResults()}
            </div>
        </div>
        </div>
        
        )
        
    );
};

export default connector(SpotifySearch);
