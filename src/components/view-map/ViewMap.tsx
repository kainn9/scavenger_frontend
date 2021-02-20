import React, { useState } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import './viewMapStyle.scss';
import lockIcon from '../../assets/lock-icon.png';
import targetIcon from '../../assets/target-icon.png';
import unlockIcon from '../../assets/unlock-icon.png';

interface mapProps {
    mapType?: google.maps.MapTypeId;
    mapTypeControl?: boolean;
}
const ViewMap = withScriptjs(
    withGoogleMap(({}: mapProps) => {
        const [currentLocation, setCurrentLocation] = useState<null | { lat: number; lng: number }>(null);
        const [zoom, setZoom] = useState<number>(20);
        const [isLocked, setIsLocked] = useState<null | NodeJS.Timeout>(null);

        const getLocation = () => {
            navigator.geolocation.getCurrentPosition(({ coords }) =>
                setCurrentLocation({ lat: coords.latitude, lng: coords.longitude }),
            );
            setZoom((currentZoom) => (currentZoom === 19 ? 18.9 : 19));
            console.log(Date.now(), zoom);
        };

        const lockOnLocation = () => {
            if (isLocked) {
                clearInterval(isLocked);
                setIsLocked(null);
            } else {
                const intervalId = setInterval(getLocation, 200);
                setIsLocked(intervalId);
            }
        };

        return (
            <>
                <GoogleMap
                    defaultCenter={{ lat: -34.397, lng: 150.644 }}
                    center={
                        currentLocation
                            ? { lat: currentLocation.lat, lng: currentLocation.lng }
                            : { lat: -34.397, lng: 150.644 }
                    }
                    zoom={zoom}
                    options={{ disableDefaultUI: true }}
                >
                    {currentLocation && <Marker position={{ lat: currentLocation.lat, lng: currentLocation.lng }} />}
                </GoogleMap>
                <div className="map-ui">
                    <div className="map-ui-search"></div>
                    <div className="map-ui-lock" onClick={lockOnLocation}>
                        {isLocked ? <img src={lockIcon} /> : <img src={unlockIcon} />}
                        {isLocked ? 'Lock On Current Location' : 'Unlock From Current Location'}
                    </div>
                    <div className="map-ui-find" onClick={getLocation}>
                        <img src={targetIcon} />
                        Pan To Current Location
                    </div>
                </div>
            </>
        );
    }),
);
export default ViewMap;
