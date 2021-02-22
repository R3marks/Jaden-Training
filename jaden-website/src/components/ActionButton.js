import React from 'react';
import './Button.css';

const STYLES = ['btn--cycle', 'btn--navigation', 'btn--buy', 'btn--minimal', 'btn--size'];

const SIZES = ['btn--circle', 'btn--square', 'btn--medium', 'btn--large'];

function ActionButton({children, type, onClick, disabled, buttonStyle, buttonSize, select, dataTestId}) {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]

    return (
        <button data-testid={dataTestId} select={select} className={`btn ${checkButtonStyle} ${checkButtonSize} ${select}`} onClick={onClick} disabled={disabled} type={type}>
            {children}
        </button>
    )
};

export default ActionButton
