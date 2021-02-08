import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { SIGN_UP } from '../graphql/Mutations'
import { AuthContext } from './AuthProvider'

function SignUp() {

    const [eyeIcon, setEyeIcon] = useState(false)
    const [passwordVisibility, setPasswordVisibility] = useState(false)

    const authContext = useContext(AuthContext)

    const [signUp, { loading: loadSignIn, error: errorSignIn }] = useMutation(SIGN_UP)

    function togglePasswordVisibility() {
        setEyeIcon(!eyeIcon)
        setPasswordVisibility(!passwordVisibility)
    }

    async function logIn(event) {
        event.preventDefault()
        var email = event.target.children[1].children[1].value
        var password = event.target.children[3].children[1].value
        var retypedPassword = event.target.children[5].children[1].value
        console.log(email, password, retypedPassword)
        if (password !== retypedPassword) {
            console.log('Passwords do not match')
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
            } catch (errors) {
                if (errors) {
                    console.log(errors)
                    return
                }
                if (errors.graphQLErrors[0].extensions.invalidArgs) {
                    let err = errors.graphQLErrors[0].extensions
                    if (err.invalidArgs === "email") {
                        console.log('Email')
                    } else {
                        console.log('password')
                    }
                }
            }
        }
    }

    if (loadSignIn) return <h1>Signing In...</h1>
    if (errorSignIn) return <h1>Error: ${JSON.stringify(errorSignIn.graphQLErrors[0].extensions.code)}</h1>

    return (
        <div className="form">
            <form className="auth-inputs" onSubmit={logIn}>
                <label className="form-headers">Email</label>
                <div className="input-rows">
                    <i className="fas fa-user" />
                    <input type="text" className="field" />
                </div>
                <label className="form-headers">New Password</label>
                <div className="input-rows">
                    <i className="fas fa-lock" />
                    <input type={passwordVisibility ? 'text' : 'password'} className="field" />
                    <i className={eyeIcon ? 'fas fa-eye' : 'fas fa-eye-slash'} onClick={togglePasswordVisibility} />
                </div>
                <label className="form-headers">Retype Password</label>
                <div className="input-rows">
                    <i className="fas fa-lock" />
                    <input type={passwordVisibility ? 'text' : 'password'} className="field" />
                    <i className={eyeIcon ? 'fas fa-eye' : 'fas fa-eye-slash'} onClick={togglePasswordVisibility} />
                </div>
                <input className="sign-in" type="submit" value="Sign Up" />
            </form>
        </div>
    )
}

export default SignUp
