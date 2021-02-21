import { Marker } from 'react-google-maps';
import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { CLRootState, Action, currentLocation } from '../../../redux/current-location/currentLocationReducer';
import { PAN_TO_CL } from '../../../redux/current-location/currentLocationActions';

// getting props.currentLocation from redux
const msp = ({ currentLocation }: { currentLocation: CLRootState }) => ({
    currentLocation: currentLocation.currentLocation,
});
// getting PAN_TO_CL from redux
const mdp = (dispatch: (action: Action) => void) => ({
    PAN_TO_CL: (project: currentLocation) => dispatch(PAN_TO_CL(project)),
});

// getting connector for redux props
const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;

const CurrentLocationMarker: React.FC<reduxProps> = function ({ currentLocation, PAN_TO_CL }) {
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords }) =>
            PAN_TO_CL({ lat: coords.latitude, lng: coords.longitude }),
        );
    }, []);
    return currentLocation ? <Marker position={{ lat: currentLocation.lat, lng: currentLocation.lng }} /> : null;
};

export default connector(CurrentLocationMarker);
