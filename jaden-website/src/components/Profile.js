import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from './AuthProvider'
import ActionButton from './ActionButton'
import { useApolloClient, useMutation } from '@apollo/client'
import { SIGN_OUT } from '../graphql/Mutations'

function Profile() {

    const history = useHistory()
    const { setAuthInfo } = useContext(AuthContext)

    const client = useApolloClient()

    const [signOutUser, { loading }] = useMutation(SIGN_OUT)

    async function handleSignOut() {
        try {
            await signOutUser()
            await client.resetStore()
            setAuthInfo({ userData: null })
            history.push('/')
        } catch (errors) {
            console.log(errors)
        }
    }

    return (
        <>
            <div className="auth-headers">
                <h1 className='auth-header'>PROFILE</h1>
            </div>
            <div className="auth-section">
                <ActionButton buttonSize='btn--large' buttonStyle='btn--buy' onClick={handleSignOut} disabled={loading}>Sign out</ActionButton>
            </div>
        </>
    )
}

export default Profile
