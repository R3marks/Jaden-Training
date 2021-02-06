import React, { useContext } from 'react'
import './Auth.css'
import SignIn from './SignIn'
import { AuthContext } from './AuthProvider'
import Profile from './Profile'

function Auth() {

    const { isAuthenticated } = useContext(AuthContext)
    var result = isAuthenticated()

    return (
        <div className="auth-background">
            <div className="auth-wrapper">
                <h1 className="auth-header">SIGN IN</h1>
                <div className="auth-section">
                    { result ? <Profile /> :
                    <SignIn />}
                </div>
            </div>
        </div>
    )
}

export default Auth
