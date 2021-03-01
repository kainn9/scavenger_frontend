import React from 'react';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';
import { soundMedia } from '../spotify-search/SpotifySearch';
import './SpotifySearchPreviewStyles.scss';
import { connect, ConnectedProps } from 'react-redux';
import { Action } from '../../redux/active-route/activeRouteReducer';
import { SET_ACTIVE_SOUND } from '../../redux/active-route/activeRouteActions';

const mdp = (dispatch: (action: Action) => void) => ({
    SET_ACTIVE_SOUND: (uri: string) => dispatch(SET_ACTIVE_SOUND(uri)),
});
const connector = connect(null, mdp);
type ReduxProps = ConnectedProps<typeof connector>;

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
