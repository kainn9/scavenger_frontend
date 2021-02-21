import React from 'react';
import HomeMap from '../components/view-map/home-map/HomeMap';

const testPage: React.FC = () => {
    return (
        <>
            <HomeMap
                googleMapURL={`https://maps.google.com/maps/api/js?key=${process.env.REACT_APP_GOOGK}`}
                loadingElement={<div className="loading-element" />}
                containerElement={<div className="view-map" />}
                mapElement={<div className="map-element" />}
            />
        </>
    );
};

export default testPage;
