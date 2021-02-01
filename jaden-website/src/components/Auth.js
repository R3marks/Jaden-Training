import React, { useState } from 'react'
import './Auth.css'

function Auth() {

    const [eye, setEye] = useState(false)

    function togglePasswordVisibility(event) {
        var par = event.target
        setEye(!eye)
    }

    return (
        <div className="auth-background">
            <div className="auth-wrapper">
                <h1 className="auth-header">SIGN IN</h1>
                <div className="auth-section">
                    <form className="auth-inputs">
                        <label className="form-headers">Username</label>
                        <div className="input-rows">
                            <i className="fas fa-user" />
                            <input type="text" className="field" />
                        </div>
                        <label className="form-headers">Password</label>
                        <div className="input-rows">
                            <i className="fas fa-lock" />
                            <input type="password" className="field" />
                            <i className={eye ? 'fas fa-eye' : 'fas fa-eye-slash'} onClick={togglePasswordVisibility} />
                        </div>
                        <input className="sign-in" type="submit" value="Sign In" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Auth
