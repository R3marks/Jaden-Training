import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { SIGN_IN } from '../graphql/Mutations'
import { AuthContext } from './AuthProvider'

function SignIn() {

    const history = useHistory()

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
            history.push('/')
        } catch (errors) {
            const {
                graphQLErrors: [graphQLError],
                networkError,
                message
            } = errors
            if (message === 'Failed to fetch') {
                setErrorMessage('Server Offline')
            } else if (graphQLError) {
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
            } else if (networkError) {
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
                console.log(JSON.stringify(errors))
            }
        }
    }

    if (loadSignIn) return <h1>Signing In...</h1>
    // if (errorSignIn && errorSignIn.networkError) return <h1> {errorMessage}</h1>

    return (
        <div className="form">
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
