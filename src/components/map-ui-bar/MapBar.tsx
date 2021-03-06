import React from 'react';
import './MapUiBarStyles.scss';
/**
 * container component, simple navbar with gradient, expects buttons as children
 * @children jsx inside closing tags
 */
const MapUiBar: React.FC = function ({ children }) {
    return <div className="map-ui">{children}</div>;
};

export default MapUiBar;
