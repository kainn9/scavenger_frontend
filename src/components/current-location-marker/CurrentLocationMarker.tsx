import { Marker } from '@react-google-maps/api';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { CLRootState, Action, currentLocation } from '../../redux/current-location/currentLocationReducer';
import { PLACE_CL_MARKER } from '../../redux/current-location/currentLocationActions';
import clIcon from '../../assets/cl-icon.png';

// redux
const msp = ({ currentLocation }: { currentLocation: CLRootState }) => ({
    currentLocation: currentLocation.currentLocation,
});

const mdp = (dispatch: (action: Action) => void) => ({
    PLACE_CL_MARKER: (currentLocation: currentLocation) => dispatch(PLACE_CL_MARKER(currentLocation)),
});

const connector = connect(msp, mdp);
type ReduxProps = ConnectedProps<typeof connector>;

/**
 * googleMap child component, injects current location marker based on current location state
 *
 * @currentLocation state from redux, users current location -or- null
 * @PLACE_CL_MARKER redux action, tries to get current location to trigger marker render
 */
const CurrentLocationMarker: React.FC<ReduxProps> = function ({ currentLocation, PLACE_CL_MARKER }) {
    // tries to get CL on mount
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords }) =>
            PLACE_CL_MARKER({ lat: coords.latitude, lng: coords.longitude }),
        );
    }, []);

    return currentLocation ? (
        <Marker
            position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
            label="You"
            icon={{
                url: clIcon,
                scaledSize: new window.google.maps.Size(40, 40),
                origin: new window.google.maps.Point(0, 0),
                labelOrigin: new window.google.maps.Point(20, 47),
            }}
        />
    ) : null;
};

export default connector(CurrentLocationMarker);
