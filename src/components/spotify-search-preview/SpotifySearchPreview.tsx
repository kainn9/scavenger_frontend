import React from 'react';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';
import { soundMedia } from '../spotify-search/SpotifySearch';
import './SpotifySearchPreviewStyles.scss';
import { connect, ConnectedProps } from 'react-redux';
import { Action } from '../../redux/active-route/activeRouteReducer';
import { SET_ACTIVE_SOUND } from '../../redux/active-route/activeRouteActions';

// redux
const mdp = (dispatch: (action: Action) => void) => ({
    SET_ACTIVE_SOUND: (uri: string) => dispatch(SET_ACTIVE_SOUND(uri)),
});
const connector = connect(null, mdp);
type ReduxProps = ConnectedProps<typeof connector>;

/**
 * Component is a preview card/search result card used by SpotifySearch component, allows user to set result as activeSoundMedias too
 * @param props.name sound media name
 * @param props.artist (sometimes null) sound media artist name
 * @param props.uri spotify uri string
 * @param props.publisher (sometimes null) sound media publisher
 * @param props.description sound media artist description
 * @SET_ACTIVE_SOUND redux action, sets activeSoundMedia

 */
const TrackSearchPreview: React.FC<soundMedia & ReduxProps> = function ({
    name,
    artist,
    uri,
    publisher,
    description,
    SET_ACTIVE_SOUND,
}: soundMedia & ReduxProps) {
    return (
        <div className="spot-search-prev">
            <h1>{name}</h1>
            <span>{artist || publisher || description}</span>
            <MapUiBtn iconName="save" text="" clickFN={() => SET_ACTIVE_SOUND(uri)} />
        </div>
    );
};

export default connector(TrackSearchPreview);
