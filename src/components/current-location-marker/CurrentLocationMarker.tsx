import { Marker } from '@react-google-maps/api';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { CLRootState, Action, currentLocation } from '../../redux/current-location/currentLocationReducer';
import { PLACE_CL_MARKER } from '../../redux/current-location/currentLocationActions';

// getting props.currentLocation from redux
const msp = ({ currentLocation }: { currentLocation: CLRootState }) => ({
    currentLocation: currentLocation.currentLocation,
});
// getting PLACE_CL_MARKER from redux
const mdp = (dispatch: (action: Action) => void) => ({
    PLACE_CL_MARKER: (currentLocation: currentLocation) => dispatch(PLACE_CL_MARKER(currentLocation)),
});

// getting connector for redux props
const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;

const CurrentLocationMarker: React.FC<reduxProps> = function ({ currentLocation, PLACE_CL_MARKER }) {
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords }) =>
            PLACE_CL_MARKER({ lat: coords.latitude, lng: coords.longitude }),
        );
    }, []);
    return currentLocation ? <Marker position={{ lat: currentLocation.lat, lng: currentLocation.lng }} /> : null;
};

export default connector(CurrentLocationMarker);
