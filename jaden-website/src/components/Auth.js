import React, { useState } from 'react'
import './Auth.css'

function Auth() {

    const [eyeIcon, setEyeIcon] = useState(false)
    const [passwordVisibility, setPasswordVisibility] = useState(false)

    function togglePasswordVisibility(event) {
        var par = event.target
        setEyeIcon(!eyeIcon)
        setPasswordVisibility(!passwordVisibility)
    }

    function logIn(event) {
        event.preventDefault()
        var username = event.target.children[1].children[1].value
        var password = event.target.children[3].children[1].value

    }

    return (
        <div className="auth-background">
            <div className="auth-wrapper">
                <h1 className="auth-header">SIGN IN</h1>
                <div className="auth-section">
                    <form className="auth-inputs" onSubmit={logIn}>
                        <label className="form-headers">Email</label>
                        <div className="input-rows">
                            <i className="fas fa-user" />
                            <input type="text" className="field" />
                        </div>
                        <label className="form-headers">Password</label>
                        <div className="input-rows">
                            <i className="fas fa-lock" />
                            <input type={passwordVisibility ? 'text' : 'password'} className="field" />
                            <i className={eyeIcon ? 'fas fa-eye' : 'fas fa-eye-slash'} onClick={togglePasswordVisibility} />
                        </div>
                        <input className="sign-in" type="submit" value="Sign In" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Auth
