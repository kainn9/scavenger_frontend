/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from 'react';
import { DirectionsRenderer, DirectionsService } from '@react-google-maps/api';
import { connect, ConnectedProps } from 'react-redux';
import { activeNode, activeRoute, ARRootState } from '../../redux/active-route/activeRouteReducer';

const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    activeRoute: activeRoute.activeRoute,
});
const connector = connect(msp);
type ReduxProps = ConnectedProps<typeof connector>;
const DirectionsComp: React.FC<ReduxProps> = function ({ activeRoute }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [directionsResp, setDirectionsResp] = useState<any>(null);

    const getLatLng = function (index: number) {
        if (index >= 0) {
            const lat = activeRoute[index]!.lat;
            const lng = activeRoute[index]!.lng;
            return new google.maps.LatLng({ lat: lat, lng: lng });
        }
    };

    const getWaypoints = function (ar: activeRoute) {
        //const waypts: google.maps.DirectionsWaypoint[] = [];
        return ar.slice(1, activeRoute.length - 1).map((node: activeNode) => {
            return {
                location: new google.maps.LatLng(node!.lat, node!.lng),
            };
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directionsCallback = function (response: any) {
        console.log(response);
        if (response !== null) {
            if (response.status === 'OK') {
                setDirectionsResp(response);
            } else {
                console.log('response: ', response);
            }
        }
    };

    return (
        <>
            <DirectionsService
                // required
                options={{
                    destination: getLatLng(activeRoute.length - 1),
                    origin: getLatLng(0),
                    waypoints: getWaypoints(activeRoute),
                    travelMode: google.maps.TravelMode.WALKING,
                }}
                // required
                callback={directionsCallback}
            />

            {directionsResp ? (
                <DirectionsRenderer
                    // required
                    options={{
                        directions: directionsResp,
                        suppressMarkers: true,
                    }}
                />
            ) : null}
        </>
    );
};
export default connector(DirectionsComp);
