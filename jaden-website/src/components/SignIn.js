import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { SIGN_IN } from '../graphql/Mutations'
import { AuthContext } from './AuthProvider'

function SignIn() {

    const [eyeIcon, setEyeIcon] = useState(false)
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [validEmail, setValidEmail] = useState(true)
    const [validPassword, setValidPassword] = useState(true)

    const authContext = useContext(AuthContext)

    const [signIn, { loading: loadSignIn, error: errorSignIn }] = useMutation(SIGN_IN)

    function togglePasswordVisibility() {
        setEyeIcon(!eyeIcon)
        setPasswordVisibility(!passwordVisibility)
    }

    async function logIn(event) {
        event.preventDefault()
        var email = event.target.children[1].children[1].value
        var password = event.target.children[3].children[1].value
        var credentials = {
            email: email,
            password: password
        }
        try {
            var result = await signIn({ variables: {
                credentials: credentials 
            }})
            console.log(result)
            authContext.setAuthInfo({ userData: result.data.signIn.user })
        } catch (errors) {
            if (errors.graphQLErrors[0]) {
                let err = errors.graphQLErrors[0]?.extensions
                if (err.invalidArgs === "Email") {
                    setValidEmail(false)
                    setErrorMessage('Email not registered')
                } else if (err.invalidArgs === 'Password') {
                    setValidPassword(false)
                    setErrorMessage('Password incorrect')
                }
            } else {
                console.log(errors)
            }
        }
    }

    if (loadSignIn) return <h1>Signing In...</h1>
    if (errorSignIn && errorSignIn.networkError) return <h1>Error: ${JSON.stringify(errorSignIn)}</h1>

    return (
        <div>
            <form className="auth-inputs" onSubmit={logIn}>
                <label className="form-headers">Email</label>
                <div className="input-rows">
                    <i className="fas fa-user" />
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="text" className={validEmail ? 'field' : 'field field-invalid-server'} onClick={() => setValidEmail(true)} />
                </div>
                <label className="form-headers">Password</label>
                <div className="input-rows">
                    <i className="fas fa-lock" />
                    <input type={passwordVisibility ? 'text' : 'password'} className={validPassword ? 'field' : 'field field-invalid-server'} onClick={() => setValidPassword(true)} />
                    <i className={eyeIcon ? 'fas fa-eye' : 'fas fa-eye-slash'} onClick={togglePasswordVisibility} />
                </div>
                <div className="error-holder">
                    {errorMessage && <span className="error-message">{errorMessage}</span>}
                </div>
                <input className="sign-in" type="submit" value="Sign In" />
            </form>
        </div>
    )
}

export default SignIn
