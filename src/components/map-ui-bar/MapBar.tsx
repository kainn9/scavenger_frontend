import React from 'react';
import './MapUiBarStyles.scss';

const MapUiBar: React.FC = function ({ children }) {
    return <div className="map-ui">{children}</div>;
};

export default MapUiBar;
