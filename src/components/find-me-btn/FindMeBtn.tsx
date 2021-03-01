import React from 'react';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';
import './FindMeBtnStyles.scss';

import { connect, ConnectedProps } from 'react-redux';
import { PLACE_CL_MARKER } from '../../redux/current-location/currentLocationActions';
import { Action, currentLocation } from '../../redux/current-location/currentLocationReducer';
import { center } from '../../redux/map/mapReducer';
import { SET_MAP_CENTER } from '../../redux/map/mapActions';

const mdp = (dispatch: (action: Action) => void) => ({
    PLACE_CL_MARKER: (cl: currentLocation) => dispatch(PLACE_CL_MARKER(cl)),
    SET_MAP_CENTER: (center: center) => dispatch(SET_MAP_CENTER(center)),
});

const connector = connect(null, mdp);
type reduxProps = ConnectedProps<typeof connector>;

const FindMeBtn: React.FC<reduxProps> = function ({ PLACE_CL_MARKER, SET_MAP_CENTER }) {
    const FindMe = () => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            const formattedCords = { lat: coords.latitude, lng: coords.longitude };
            PLACE_CL_MARKER(formattedCords);
            SET_MAP_CENTER(formattedCords);
        });
    };
    return <MapUiBtn text="Find Me" iconName="compass" clickFN={FindMe} />;
};

export default connector(FindMeBtn);
