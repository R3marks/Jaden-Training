import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { SIGN_IN } from '../graphql/Mutations'
import { AuthContext } from './AuthProvider'

function SignIn() {

    const [eyeIcon, setEyeIcon] = useState(false)
    const [passwordVisibility, setPasswordVisibility] = useState(false)

    const authContext = useContext(AuthContext)

    const [signIn, { loading: loadSignIn, error: errorSignIn }] = useMutation(SIGN_IN)

    function togglePasswordVisibility(event) {
        var par = event.target
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
            authContext.setAuthInfo({token: result.data.signIn.token, userData: result.data.signIn.user})
        } catch (errors) {
            let err = errors.graphQLErrors[0].extensions
            if (err.invalidArgs) {
                if (err.invalidArgs === "email") {
                    console.log('Email')
                } else {
                    console.log('password')
                }
            }
        }
    }

    if (loadSignIn) return <h1>Signing In...</h1>
    if (errorSignIn) return <h1>Error: ${JSON.stringify(errorSignIn.graphQLErrors[0].extensions.code)}</h1>

    return (
        <div>
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
    )
}

export default SignIn
