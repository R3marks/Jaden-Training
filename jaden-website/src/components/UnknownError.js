import React from 'react'
import './UnknownError.css'
import ActionButton from './ActionButton'

function UnknownError(props) {
    console.log(props)
    return (
        <div className="unknown-error-section">
            <div className="unknown-error-headers">
                <i className="fas fa-exclamation-triangle" />
                <h1 className="unknown-error-header">UNKNOWN ERROR</h1>
                <h1 className="unknown-error-message">MESSAGE: {props.errors.message}</h1>
            </div>
            <div className="unknown-error-buttons">
                <ActionButton buttonStyle="btn--minimal" buttonSize="btn--medium">GRAPHQL ERRORS</ActionButton>
                <ActionButton buttonStyle="btn--minimal" buttonSize="btn--medium">NETWORK ERRORS</ActionButton>
            </div>
        </div>
    )
}

export default UnknownError
