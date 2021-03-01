import React from 'react';
import './LineInputStyles.scss';
interface Props {
    inputHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    name: string;
}
const LineInput: React.FC<Props> = function ({ inputHandler, value, name, children }) {
    return (
        <div className="line-input-container">
            <label className={true ? 'form-input-label' : 'label-shrink'}> {children}</label>
            <input className="line-input" type="text" onChange={inputHandler} value={value} name={name}></input>
        </div>
    );
};

export default LineInput;
