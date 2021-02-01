import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

const STYLES = ['btn--cycle', 'btn--navigation', 'btn--buy', 'btn--size'];

const SIZES = ['btn--circle', 'btn--square', 'btn--medium', 'btn--large'];

const STATES = ['btn--select']

export const LinkedButton = React.forwardRef(({children, type, onClick, linkTo, buttonStyle, buttonSize, buttonState}, ref) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]

    const checkButtonState = STATES.includes(buttonState) ? buttonState : ''

    return (
        <Link to={linkTo} className="btn-mobile">
            <button ref={ref} className={`btn ${checkButtonStyle} ${checkButtonSize} ${checkButtonState}`} onClick={onClick} type={type}>
                {children}
            </button>
        </Link>
    )
});
