import React from 'react';
import ViewMap from '../components/view-map/ViewMap';
import Div100vh from 'react-div-100vh';

const testPage: React.FC = () => {
    return (
        <>
            <Div100vh>
                <ViewMap
                    googleMapURL={`https://maps.google.com/maps/api/js?key=${process.env.REACT_APP_GOOGK}`}
                    loadingElement={<div className="loading-element" />}
                    containerElement={<div className="view-map" />}
                    mapElement={<div className="map-element" />}
                />
            </Div100vh>
        </>
    );
};

export default testPage;
