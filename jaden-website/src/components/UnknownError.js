import React, { useState } from 'react'
import './UnknownError.css'
import ActionButton from './ActionButton'

function UnknownError(props) {

    const [errorType, setErrorType] = useState(false)

    return (
        <div className="unknown-error-section">
            <div className="unknown-error-headers">
                <i className="fas fa-exclamation-triangle" />
                <h1 className="unknown-error-header">UNKNOWN ERROR</h1>
                <h1 className="unknown-error-message">{props.errors.message}</h1>
            </div>
            <div className="unknown-error-buttons">
                <ActionButton buttonStyle="btn--minimal" buttonSize="btn--medium" onClick={() => setErrorType(false)}>GRAPHQL ERRORS</ActionButton>
                <ActionButton dataTestId='Network Error' buttonStyle="btn--minimal" buttonSize="btn--medium" onClick={() => setErrorType(true)}>NETWORK ERRORS</ActionButton>
            </div>
            <div className="unknown-error-box">
                {errorType ? <pre className="unknown-error-print">{JSON.stringify(props.errors.networkError, undefined, 2)}</pre>
                : <pre className="unknown-error-print">{props.errors.graphQLErrors.map(graphQLError => {
                    JSON.stringify(graphQLError, undefined, 2)
                })}</pre>}
            </div>
        </div>
    )
}

export default UnknownError
