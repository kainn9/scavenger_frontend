/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from 'react';
import { DirectionsRenderer, DirectionsService } from '@react-google-maps/api';
import { connect, ConnectedProps } from 'react-redux';
import { activeNode, activeRoute, ARRootState } from '../../redux/active-route/activeRouteReducer';

// redux
const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    activeRoute: activeRoute.activeRoute,
});

const connector = connect(msp);

type ReduxProps = ConnectedProps<typeof connector>;

interface props extends ReduxProps {
    overideRoute?: activeRoute;
}
/**
 * google map child component, will connect the activeRoute nodes together
 *
 * @activeRoute activeRoute in redux store

 */
const DirectionsComp: React.FC<props> = function ({ activeRoute, overideRoute }) {
    // state to save directionService resp
    const [directionsResp, setDirectionsResp] = useState<any>(null);

    /**
    * function gets lat/lng from a node in activeRoute and converts it  to google.maps.LatLng that can be passed as a DirectionService prop
    *
    * @param index index of node to get lat/lng from
    * @returns google.maps.LatLng

    */
    const getLatLng = function (index: number) {
        if (index >= 0) {
            const lat = overideRoute ? overideRoute[index]!.lat : activeRoute[index]!.lat;
            const lng = overideRoute ? overideRoute[index]!.lng : activeRoute[index]!.lng;
            return new google.maps.LatLng({ lat: lat, lng: lng });
        }
    };

    /**
    * function converts nodes from activeRoute (excluding head and tail of route) into google.maps.LatLng[] for DirectionService waypoint prop
    *
    * @param index index of node to get lat/lng from
    * @returns google.maps.LatLng[]

    */
    const getWaypoints = function (ar: activeRoute) {
        return ar.slice(1, overideRoute ? overideRoute.length - 1 : activeRoute.length - 1).map((node: activeNode) => {
            return {
                location: new google.maps.LatLng(node!.lat, node!.lng),
            };
        });
    };

    /**
    * callback function sets DirectionsRenderer resp into state
    *
    * @param response google maps direction service resp, used by DirectionsRenderer to connect nodes

    */
    const directionsCallback = function (response: any) {
        //console.log(response);
        if (response !== null) {
            if (response.status === 'OK') {
                setDirectionsResp(response);
            } else {
                //console.log('response: ', response);
            }
        }
    };

    return (
        <>
            <DirectionsService
                // required
                options={{
                    destination: getLatLng(overideRoute ? overideRoute.length - 1 : activeRoute.length - 1),
                    origin: getLatLng(0),
                    waypoints: getWaypoints(overideRoute || activeRoute),
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
