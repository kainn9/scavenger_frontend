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
            <h1 style={{ color: 'black', fontSize: '40px', position: 'relative', zIndex: 9 }}>Test This is</h1>
        </>
    );
};

export default testPage;
