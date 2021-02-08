import React, { useContext } from 'react'
import './Auth.css'
import SignIn from './Unauthenticated'
import { AuthContext } from './AuthProvider'
import Profile from './Profile'
import Unauthenticated from './Unauthenticated'

function Auth() {

    const { isAuthenticated } = useContext(AuthContext)
    var result = isAuthenticated()

    return (
        <div className="auth-background">
            <div className="auth-wrapper">
            { result ? <Profile /> :
                    <Unauthenticated />}
            </div>
        </div>
    )
}

export default Auth
