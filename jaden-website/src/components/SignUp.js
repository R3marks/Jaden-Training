import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { SIGN_UP } from '../graphql/Mutations'
import { AuthContext } from './AuthProvider'

function SignUp() {

    var emailRegex = new RegExp(/\S+@\S+\.\S+/)

    const [eyeIcon, setEyeIcon] = useState(false)
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [validEmail, setValidEmail] = useState('field')
    const [validPassword, setValidPassword] = useState('field')
    const [passwordsMatch, setPasswordsMatch] = useState(true)

    const authContext = useContext(AuthContext)

    const [signUp, { loading: loadSignIn, error: errorSignIn }] = useMutation(SIGN_UP)

    function togglePasswordVisibility() {
        setEyeIcon(!eyeIcon)
        setPasswordVisibility(!passwordVisibility)
    }

    function checkValidityOfEmail(event) {
        if (!emailRegex.test(event.target.value)) {
            setValidEmail('field field-invalid-client')
            setErrorMessage('Email invalid')
        } else {
            setValidEmail('field field-valid-client')
            setErrorMessage(null)
        }
        setEmail(event.target.value)
    }

    function checkValidityOfPassword(event) {
        if (event.target.value.length < 8) {
            setValidPassword('field field-invalid-client')
            setErrorMessage('Password must be 8 characters long')
        } else {
            setValidPassword('field field-valid-client')
            setErrorMessage(null)
        }
    }

    async function logIn(event) {
        event.preventDefault()
        var email = event.target.children[1].children[1].value
        var password = event.target.children[3].children[1].value
        var retypedPassword = event.target.children[5].children[1].value
        console.log(email, password, retypedPassword)
        console.log(password)
        console.log(retypedPassword)
        if (password !== retypedPassword) {
            setPasswordsMatch(false)
            setErrorMessage('Passwords do not match')
        } else {
            var credentials = {
                email: email,
                password: password
            }
            try {
                var result = await signUp({ variables: {
                    credentials: credentials 
                }})
                console.log(result)
                authContext.setAuthInfo({ userData: result.data.signUp.user })
                console.log(authContext)
            } catch (errors) {
                console.log(errors)
                if (errors.graphQLErrors[0]) {
                    let err = errors.graphQLErrors[0]?.extensions
                    if (err.invalidArgs === "Email") {
                        setValidEmail('field field-invalid-server')
                        setErrorMessage('Email already registered')
                    } else if (err.invalidArgs === 'Password') {
                        // setValidPassword(false)
                    }
                } else {
                    console.log(errors)
                }
            }
        }
    }

    if (loadSignIn) return <h1>Signing In...</h1>
    if (errorSignIn && errorSignIn.networkError) return <h1>Error: ${JSON.stringify(errorSignIn)}</h1>

    return (
        <div className="form">
            <form className="auth-inputs" onSubmit={logIn}>
                <label className="form-headers">Email</label>
                <div className="input-rows">
                    <i className="fas fa-user" />
                    <input type="text" value={email} onChange={(event) => checkValidityOfEmail(event)} onClick={() => setValidEmail('field')} className={validEmail} />
                </div>
                <label className="form-headers">New Password</label>
                <div className="input-rows">
                    <i className="fas fa-lock" />
                    <input type={passwordVisibility ? 'text' : 'password'} className={validPassword} onChange={(event) => checkValidityOfPassword(event)} onClick={() => setValidPassword('field')} />
                    <i className={eyeIcon ? 'fas fa-eye' : 'fas fa-eye-slash'} onClick={togglePasswordVisibility} />
                </div>
                <label className="form-headers">Retype Password</label>
                <div className="input-rows">
                    <i className="fas fa-lock" />
                    <input type={passwordVisibility ? 'text' : 'password'} onClick={() => setPasswordsMatch(true)} className={passwordsMatch ? 'field' : 'field field-invalid-client'} />
                    <i className={eyeIcon ? 'fas fa-eye' : 'fas fa-eye-slash'} onClick={togglePasswordVisibility} />
                </div>
                <div className="error-holder">
                    {errorMessage && <span className="error-message">{errorMessage}</span>}
                </div>
                <input className="sign-in" type="submit" value="Sign Up" />
            </form>
        </div>
    )
}

export default SignUp
