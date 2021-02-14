import React, { useState, useContext } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'

function Unauthenticated() {

    const [signInMethod, setSignInMethod] = useState(true)

    function toggleSignInMethod() {
        setSignInMethod(!signInMethod)
    }

    return (
        <>
        <div className="auth-headers">
            <h1 className={signInMethod ? 'auth-header auth-select' : 'auth-header'} onClick={signInMethod ? toggleSignInMethod : undefined}>SIGN UP</h1>
            <h1 className={signInMethod ? 'auth-header' : 'auth-header auth-select'} onClick={signInMethod ? undefined : toggleSignInMethod}>SIGN IN</h1>
        </div>
        <div className="auth-section">
            {signInMethod ? <SignIn /> : <SignUp />}
        </div>
        </>
    )
}

export default Unauthenticated
