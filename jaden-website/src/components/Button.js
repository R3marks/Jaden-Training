import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

const STYLES = ['btn--cycle', 'btn--navigation'];

const SIZES = ['btn--circle', 'btn--medium', 'btn--large'];

const STATES = ['btn--select']

export const Button = ({children, type, onClick, linkTo, buttonStyle, buttonSize, buttonState}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]

    const checkButtonState = STATES.includes(buttonState) ? buttonState : ''

    return (
        <Link to={linkTo} className="btn-mobile">
            <button className={`btn ${checkButtonStyle} ${checkButtonSize} ${checkButtonState}`} onClick={onClick} type={type}>
                {children}
            </button>
        </Link>
    )
};