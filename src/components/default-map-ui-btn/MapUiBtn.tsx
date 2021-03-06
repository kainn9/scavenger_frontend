import React, { useState } from 'react';
import './MapUiBtn.scss';
import { Icon, SemanticICONS } from 'semantic-ui-react';

// props
interface Props {
    iconName: SemanticICONS;
    text: string;
    clickFN?: () => void;
    bottomText?: boolean;
    fontColor?: string;
    style?: Record<string, unknown>;
    noHover?: boolean;
}
/**
 * Component for making buttons out of semantic ui icons. Note: Semantic Icon must have outline version for hover effect, otherwise pass prop noHover
 *
 * @param props.iconName class name for button icon(must be from semantic)
 * @param props.text text for button
 * @param props.bottomText optional boolean to move text from top to bottom
 * @param props.fontColor optional color for font
 * @param props.style optional js style object to overwrite css
 * @param props.noHover optional boolean to turn off default hover effect
 * @param props.clickFN optional click function to pass into button
 */
const MapUiBtn: React.FC<Props> = function ({ iconName, text, bottomText, fontColor, style, noHover, clickFN }) {
    const [iconFilled, setIconFilled] = useState<boolean>(false);
    return (
        <div
            className="map-ui-btn"
            onMouseOver={() => setIconFilled(true)}
            onMouseLeave={() => setIconFilled(false)}
            onClick={clickFN ? clickFN : () => null}
            style={fontColor ? Object.assign({ color: fontColor }, style) : {}}
        >
            {bottomText ? null : <p>{text}</p>}
            <Icon className={!iconFilled && !noHover ? `${iconName} outline` : iconName} />
            {bottomText ? <p>{text}</p> : null}
        </div>
    );
};

export default MapUiBtn;
