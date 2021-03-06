/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api';
import './DefaultMapStyles.scss';
import CurrentLocationMarker from '../current-location-marker/CurrentLocationMarker';
import { CLRootState } from '../../redux/current-location/currentLocationReducer';
import { Action, center, MRootState } from '../../redux/map/mapReducer';
import { SET_MAP_CENTER } from '../../redux/map/mapActions';

import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';
import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';

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
}
// google maps expects external var(outside component) for extra libraries used...Places is needed for address lookup/search
const lib: Libraries = ['places'];

/**
 * Default map for app
 *
 * @param props.clMarkerEnabled boolean, renders cl marker component
 * @param props.onMapClick click function for when user clicks on map
 * @center redux state, { lng: number, lat: number }
 * @SET_MAP_CENTER redux action, sets center state
 * @children jsx inbwtn tags

 */
const DefaultMap = function ({ children, clMarkerEnabled, center, SET_MAP_CENTER, onMapClick }: mapProps) {
    // sizing for goole map
    const containerStyle = {
        width: '100%',
        height: '100vh',
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
                    center={center}
                    zoom={16}
                    options={{ disableDefaultUI: true, minZoom: 15, maxZoom: 18 }}
                    onClick={(e) => (onMapClick ? onMapClick(e) : null)}
                    mapContainerStyle={containerStyle}
                    onDragEnd={onDrag}
                >
                    {clMarkerEnabled ? <CurrentLocationMarker /> : null}
                    {children}
                </GoogleMap>
                <Search panTo={panTo} SET_MAP_CENTER={SET_MAP_CENTER} />
            </div>
        </LoadScriptNext>
    );
};

const Search = ({ panTo, SET_MAP_CENTER }: { panTo: any; SET_MAP_CENTER: any }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutoComplete({
        requestOptions: {
            radius: 200 * 1000,
            location: new google.maps.LatLng(40, 70),
        },
    });

    return (
        <div className="search-bar">
            <Combobox
                onSelect={async (address) => {
                    setValue(address, false);
                    clearSuggestions();
                    try {
                        const results = await getGeocode({ address });
                        const { lat, lng } = await getLatLng(results[0]);
                        panTo({ lat, lng });
                        SET_MAP_CENTER({ lat, lng });
                    } catch (err) {
                        console.log('error!');
                    }
                }}
            >
                <ComboboxInput
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    disabled={!ready}
                    placeholder="Enter an address"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === 'OK' &&
                            data.map(({ description }, i) => <ComboboxOption key={i} value={description} />)}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
};
export default connector(DefaultMap);
