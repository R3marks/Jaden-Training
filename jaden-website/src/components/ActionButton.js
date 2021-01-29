import React from 'react';
import './Button.css';

const STYLES = ['btn--cycle', 'btn--navigation', 'btn--buy', 'btn--size'];

const SIZES = ['btn--circle', 'btn--square', 'btn--medium', 'btn--large'];

export const ActionButton = React.forwardRef(({children, type, onClick, buttonStyle, buttonSize, select}, ref) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]

    const checkButtonState = select ? "btn--select" : ''

    return (
        <button ref={ref} select={select} className={`btn ${checkButtonStyle} ${checkButtonSize} ${checkButtonState}`} onClick={onClick} type={type}>
            {children}
        </button>
    )
});
