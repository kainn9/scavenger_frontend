import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Action } from '../../redux/map/mapReducer';
import { TOGGLE_DIRECTIONS } from '../../redux/map/mapActions';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';
import './ToggleDirectionBtnStyles.scss';

const mdp = (dispatch: (action: Action) => void) => ({
    TOGGLE_DIRECTIONS: () => dispatch(TOGGLE_DIRECTIONS()),
});
const connector = connect(null, mdp);
type ReduxProps = ConnectedProps<typeof connector>;

const ToggleDirectionsBtn: React.FC<ReduxProps> = function ({ TOGGLE_DIRECTIONS }) {
    return (
        <div className="toggle-d-btn" onClick={TOGGLE_DIRECTIONS}>
            <MapUiBtn iconName="map" text="" />
            <p>Toggle Directions</p>
        </div>
    );
};

export default connector(ToggleDirectionsBtn);
