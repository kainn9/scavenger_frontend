import React from 'react';
import './LineInputStyles.scss';

interface Props {
    inputHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    name: string;
}
/**
 * Component is a modified input, renders bottom line of input only
 *
 * @param props.value string, mapped to some state for controlled component
 * @param props.name string, html name prop for input
 * @param props.inputHandler function passed into jsx onChange prop
 * @children jsx btwn tags

 */
const LineInput: React.FC<Props> = function ({ inputHandler, value, name, children }) {
    return (
        <div className="line-input-container">
            <label> {children}</label>
            <input className="line-input" type="text" onChange={inputHandler} value={value} name={name}></input>
        </div>
    );
};

export default LineInput;
