/* eslint-disable prettier/prettier */
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
import usePlacesAutoComplete, {
    getGeocode,
    getLatLng,
  } from 'use-places-autocomplete';
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';

// getting props.currentLocation from redux
const msp = ({ currentLocation, map }: { currentLocation: CLRootState; map: MRootState }) => ({
    currentLocation: currentLocation.currentLocation,
    center: map.center,
});
const mdp = (dispatch: (action: Action) => void) => ({
    SET_MAP_CENTER: (center: center) => dispatch(SET_MAP_CENTER(center)),
});

const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;

interface mapProps extends reduxProps {
    mapType?: google.maps.MapTypeId;
    mapTypeControl?: boolean;
    clMarkerEnabled?: boolean;
    onMapClick?: (e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => void;
    children?: React.ReactNode;
}
const lib: Libraries = ["places"];

const DefaultMap = function ({ children, clMarkerEnabled, center, SET_MAP_CENTER, onMapClick }: mapProps) {
    
    const containerStyle = {
        width: '100%',
        height: '100vh',
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapRef = useRef<any>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const panTo = useCallback<any>(({ lat, lng }: { lat: number, lng: number}) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(18);
      }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLoad = function (map: any) {
        mapRef.current = map;
    };
    const handleCenterChanged = function () {
        if (mapRef.current) {
            SET_MAP_CENTER({
                lat: mapRef.current.center.lat(),
                lng: mapRef.current.center.lng(),
            });
        }
    };
    return (
        <LoadScriptNext googleMapsApiKey={`${process.env.REACT_APP_GOOGK}`} libraries={lib}>
            <div className='map-wrapper'>
            <GoogleMap
                onLoad={handleLoad}
                center={center}
                zoom={16}
                options={{ disableDefaultUI: true, minZoom: 15, maxZoom: 18 }}
                onClick={(e) => (onMapClick ? onMapClick(e) : null)}
                mapContainerStyle={containerStyle}
                onDragEnd={handleCenterChanged}
                //onClick={(e) => console.log(e)}
                //mapTypeId="terrain"
            >
                {clMarkerEnabled ? <CurrentLocationMarker /> : null}
                {children}
            </GoogleMap>
            <Search panTo={panTo} SET_MAP_CENTER={SET_MAP_CENTER} />
            </div>
        </LoadScriptNext>
        
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Search = ({ panTo, SET_MAP_CENTER }: { panTo: any; SET_MAP_CENTER: any; }) => {
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
        <Combobox onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();
          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
            SET_MAP_CENTER({ lat, lng })
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
              {status === 'OK' && data.map(({ description }, i) => (
                <ComboboxOption key={i} value={description} />
              ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
  
      </div>
  
    );
  };
export default connector(DefaultMap);
