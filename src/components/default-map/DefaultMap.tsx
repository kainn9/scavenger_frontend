import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api';
import './DefaultMapStyles.scss';
import CurrentLocationMarker from '../current-location-marker/CurrentLocationMarker';
import { CLRootState } from '../../redux/current-location/currentLocationReducer';
import { MRootState } from '../../redux/map/mapReducer';

// getting props.currentLocation from redux
const msp = ({ currentLocation, map }: { currentLocation: CLRootState; map: MRootState }) => ({
    currentLocation: currentLocation.currentLocation,
    center: map.center,
});

const connector = connect(msp);
type reduxProps = ConnectedProps<typeof connector>;

interface mapProps extends reduxProps {
    mapType?: google.maps.MapTypeId;
    mapTypeControl?: boolean;
    clMarkerEnabled?: boolean;
    onMapClick?: (e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => void;
    children?: React.ReactNode;
}

const DefaultMap = function ({ children, clMarkerEnabled, center, onMapClick }: mapProps) {
    const containerStyle = {
        width: '100%',
        height: '100vh',
    };
    return (
        <LoadScriptNext googleMapsApiKey={`${process.env.REACT_APP_GOOGK}`}>
            <GoogleMap
                center={center}
                zoom={16}
                options={{ disableDefaultUI: true, minZoom: 15, maxZoom: 18 }}
                onClick={(e) => (onMapClick ? onMapClick(e) : null)}
                mapContainerStyle={containerStyle}
                //onClick={(e) => console.log(e)}
                //mapTypeId="terrain"
            >
                {clMarkerEnabled ? <CurrentLocationMarker /> : null}
                {children}
            </GoogleMap>
        </LoadScriptNext>
    );
};
export default connector(DefaultMap);
