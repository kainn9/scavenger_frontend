import React from 'react';
import ViewMap from '../components/view-map/ViewMap';

const testPage: React.FC = () => {
    return (
        <>
            <ViewMap
                googleMapURL={`https://maps.google.com/maps/api/js?key=${process.env.REACT_APP_GOOGK}`}
                loadingElement={<div className="loading-element" />}
                containerElement={<div className="view-map" />}
                mapElement={<div className="map-element" />}
            />
        </>
    );
};

export default testPage;
