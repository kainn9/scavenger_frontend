/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api';
import './DefaultMapStyles.scss';
import CurrentLocationMarker from '../current-location-marker/CurrentLocationMarker';
import { CLRootState } from '../../redux/current-location/currentLocationReducer';
import { Action, center, MRootState } from '../../redux/map/mapReducer';
import { SET_MAP_CENTER } from '../../redux/map/mapActions';

import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';
import GmapSbar from '../google-map-search-bar/GmapSBar';

// redux
const msp = ({ currentLocation, map }: { currentLocation: CLRootState; map: MRootState }) => ({
    currentLocation: currentLocation.currentLocation,
    center: map.center,
});
const mdp = (dispatch: (action: Action) => void) => ({
    SET_MAP_CENTER: (center: center) => dispatch(SET_MAP_CENTER(center)),
});

const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;

// props
interface mapProps extends reduxProps {
    mapType?: google.maps.MapTypeId;
    mapTypeControl?: boolean;
    clMarkerEnabled?: boolean;
    onMapClick?: (e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => void;
    children?: React.ReactNode;
    minZoom?: number;
    noSearch?: boolean;
    doNotSyncCenter?: boolean;
    customCenter?: { lat: number; lng: number };
    customHeight?: string;
}
// google maps expects external var(outside component) for extra libraries used...Places is needed for address lookup/search
const lib: Libraries = ['places'];

/**
 * Default map for app
 *
 * @param props.clMarkerEnabled boolean, renders cl marker component
 * @param props.minZoom optional param for maximum map zoom out
 * @param props.onMapClick click function for when user clicks on map
 * @center redux state, { lng: number, lat: number }
 * @SET_MAP_CENTER redux action, sets center state
 * @children jsx inbwtn tags

 */
const DefaultMap = function ({
    children,
    minZoom,
    noSearch,
    customHeight,
    customCenter,
    clMarkerEnabled,
    doNotSyncCenter,
    center,
    SET_MAP_CENTER,
    onMapClick,
}: mapProps) {
    // sizing for goole map
    const containerStyle = {
        width: '100%',
        height: customHeight || '100vh',
    };

    const mapRef = useRef<any>(null); //ref used access gMaps methods like getCenter() or panTo()

    // calls google map methods panTo and setZoom using mapRef
    const panTo = useCallback<any>(({ lat, lng }: { lat: number; lng: number }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(18);
    }, []);

    /**
     * function sets mapRef.current to google map when the map loads
     * @param  map - google map instance
     */
    const handleLoad = function (map: any) {
        mapRef.current = map;
    };

    /**
     * function updates center in redux store after map is dragged(helps keep map pos consistent when changing pages)
     */
    const onDrag = function () {
        if (mapRef.current) {
            SET_MAP_CENTER({
                lat: mapRef.current.center.lat(),
                lng: mapRef.current.center.lng(),
            });
        }
    };
    return (
        // LoadScript is HOC that is required for google map to work
        <LoadScriptNext googleMapsApiKey={`${process.env.REACT_APP_GOOGK}`} libraries={lib}>
            <div className="map-wrapper">
                <GoogleMap
                    onLoad={handleLoad}
                    center={customCenter || center}
                    zoom={16}
                    options={{ disableDefaultUI: true, minZoom: minZoom || 15, maxZoom: 22 }}
                    onClick={(e) => (onMapClick ? onMapClick(e) : null)}
                    mapContainerStyle={containerStyle}
                    onDragEnd={doNotSyncCenter ? () => null : onDrag}
                >
                    {clMarkerEnabled ? <CurrentLocationMarker /> : null}
                    {children}
                </GoogleMap>
                {noSearch ? null : <GmapSbar panTo={panTo} SET_MAP_CENTER={SET_MAP_CENTER} />}
            </div>
        </LoadScriptNext>
    );
};

export default connector(DefaultMap);
