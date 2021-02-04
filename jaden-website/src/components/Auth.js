import React from 'react'
import './Auth.css'
import SignIn from './SignIn'

function Auth() {



    return (
        <div className="auth-background">
            <div className="auth-wrapper">
                <h1 className="auth-header">SIGN IN</h1>
                <div className="auth-section">
                    <SignIn />
                </div>
            </div>
        </div>
    )
}

export default Auth
