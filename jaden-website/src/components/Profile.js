import React, { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import ActionButton from './ActionButton'
import { useMutation } from '@apollo/client'
import { SIGN_OUT } from '../graphql/Mutations'

function Profile() {

    const { setAuthInfo } = useContext(AuthContext)
    const [signOutUser, { loading, error }] = useMutation(SIGN_OUT)

    async function handleSignOut() {
        await signOutUser()
        setAuthInfo({ userData: null })
    }

    return (
        <>
        <div className="auth-headers">
            <h1 className='auth-header' >PROFILE</h1>
        </div>
        <div className="auth-section">
            <ActionButton buttonSize='btn--large' buttonStyle='btn--buy' onClick={handleSignOut}>Sign out</ActionButton>
        </div>
        </>
    )
}

export default Profile
