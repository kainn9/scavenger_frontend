import React, { useState } from 'react';
import './MapUiBtn.scss';
import { Icon, SemanticICONS } from 'semantic-ui-react';
import { connect, ConnectedProps } from 'react-redux';
import { CLRootState } from '../../redux/current-location/currentLocationReducer';

const msp = ({ currentLocation }: { currentLocation: CLRootState }) => ({
    isLocked: currentLocation.isLocked,
});

const connector = connect(msp);
type reduxProps = ConnectedProps<typeof connector>;

interface Props extends reduxProps {
    iconName: SemanticICONS;
    text: string;
    clickFN?: () => void;
    lock?: boolean;
    bottomText?: boolean;
    fontColor?: string;
}

const MapUiBtn: React.FC<Props> = function ({ iconName, text, bottomText, fontColor, clickFN }) {
    const [iconFilled, setIconFilled] = useState<boolean>(false);
    return (
        <div
            className="map-ui-btn"
            onMouseOver={() => setIconFilled(true)}
            onMouseLeave={() => setIconFilled(false)}
            onClick={() => (clickFN ? clickFN() : null)}
            style={fontColor ? { color: fontColor } : {}}
        >
            {bottomText ? null : <p>{text}</p>}
            <Icon className={!iconFilled ? `${iconName} outline` : iconName} />
            {bottomText ? <p>{text}</p> : null}
        </div>
    );
};

export default connector(MapUiBtn);
