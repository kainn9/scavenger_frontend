import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import './homeMapStyles.scss';
import lockIcon from '../../../assets/lock-icon.png';
import targetIcon from '../../../assets/target-icon.png';
import unlockIcon from '../../../assets/unlock-icon.png';
import CurrentLocationMarker from '../current-location-marker/CurrentLocationMarker';
import { CLRootState } from '../../../redux/current-location/currentLocationReducer';

// getting props.currentLocation from redux
const msp = ({ currentLocation }: { currentLocation: CLRootState }) => ({
    currentLocation: currentLocation.currentLocation,
});

const connector = connect(msp);
type reduxProps = ConnectedProps<typeof connector>;

interface mapProps extends reduxProps {
    mapType?: google.maps.MapTypeId;
    mapTypeControl?: boolean;
}

const HomeMap = withScriptjs(
    withGoogleMap(({ currentLocation }: mapProps) => {
        console.log(currentLocation);
        return (
            <>
                <GoogleMap
                    center={
                        currentLocation
                            ? { lat: currentLocation.lat, lng: currentLocation.lng }
                            : { lat: -34.397, lng: 150.644 }
                    }
                    zoom={20}
                    options={{ disableDefaultUI: true }}
                >
                    <CurrentLocationMarker />
                </GoogleMap>
                <div className="map-ui">
                    <div className="map-ui-lock">{true ? <img src={lockIcon} /> : <img src={unlockIcon} />}</div>
                    <div className="map-ui-find">
                        <img src={targetIcon} />
                    </div>
                </div>
            </>
        );
    }),
);
export default connector(HomeMap);
