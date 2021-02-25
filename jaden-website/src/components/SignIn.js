import React, { useState, useContext } from 'react'
import './SignIn.css'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { SIGN_IN } from '../graphql/Mutations'
import { AuthContext } from './AuthProvider'
import UnknownError from './UnknownError'

function SignIn() {

    const history = useHistory()

    const [eyeIcon, setEyeIcon] = useState(false)
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [unknownError, setUnknownError] = useState(null)
    const [validEmail, setValidEmail] = useState(true)
    const [validPassword, setValidPassword] = useState(true)

    const authContext = useContext(AuthContext)

    const [signIn, { loading: loadSignIn }] = useMutation(SIGN_IN)

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
            authContext.setAuthInfo({ userData: result.data.signIn.user })
            history.push('/')
        } catch (errors) {
            const {
                graphQLErrors: [graphQLError],
                networkError,
                message
            } = errors
            if (message === 'Failed to fetch') {
                setErrorMessage('Server Offline')
            } else if (graphQLError?.extensions?.invalidArgs) {
                const {
                    message,
                    extensions: {
                        invalidArgs
                    } 
                } = graphQLError
                if (invalidArgs === "Email") {
                    setValidEmail(false)
                } else if (invalidArgs === 'Password') {
                    setValidPassword(false)
                }
                setErrorMessage(message)
            } else if (networkError?.result?.errors[0]?.extensions?.exception?.fieldName) {
                const {
                    result: {
                        errors: [{
                            message,
                            extensions: {
                                exception: {
                                    fieldName
                                }
                            }
                        }]
                    }
                } = networkError
                if (fieldName === 'email') {
                    setValidEmail(false)
                } else if (fieldName === 'password') {
                    setValidPassword(false)
                }
                setErrorMessage(message)
            } else {
                setUnknownError(errors)
            }
        }
    }

    if (loadSignIn) return <h1>Signing In...</h1>
    if (unknownError) return <UnknownError errors={unknownError} />

    return (
        <div className="form">
            <form className="auth-inputs" onSubmit={logIn}>
                <label className="form-headers">Email</label>
                <div className="input-rows">
                    <i className="fas fa-user" />
                    <input data-testid='signInEmail' value={email} onChange={(event) => setEmail(event.target.value)} type="text" className={validEmail ? 'field' : 'field field-invalid-server'} onClick={() => setValidEmail(true)} />
                </div>
                <label className="form-headers">Password</label>
                <div className="input-rows">
                    <i className="fas fa-lock" />
                    <input data-testid='signInPassword' type={passwordVisibility ? 'text' : 'password'} className={validPassword ? 'field' : 'field field-invalid-server'} onClick={() => setValidPassword(true)} />
                    <i className={eyeIcon ? 'fas fa-eye' : 'fas fa-eye-slash'} onClick={togglePasswordVisibility} />
                </div>
                <div className="error-holder">
                    {errorMessage && <span className="error-message">{errorMessage}</span>}
                </div>
                <input data-testid='signIn' className="sign-in" type="submit" value="SIGN IN" />
            </form>
        </div>
    )
}

export default SignIn
