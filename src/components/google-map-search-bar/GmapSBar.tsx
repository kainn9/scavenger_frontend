/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';
import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { center } from '../../redux/map/mapReducer';
interface Props {
    panTo: () => void;
    SET_MAP_CENTER: (center: center) => void;
}
const GmapSbar: React.FC<Props> = ({ panTo, SET_MAP_CENTER }: { panTo: any; SET_MAP_CENTER: any }) => {
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
export default GmapSbar;
