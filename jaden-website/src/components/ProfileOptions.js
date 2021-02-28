import React, { useState, useContext } from 'react'
import './ProfileOptions.css'
import { useHistory } from 'react-router-dom'
import { AuthContext } from './AuthProvider'
import ActionButton from './ActionButton'
import { useApolloClient, useQuery, useMutation } from '@apollo/client'
import { GET_CART } from '../graphql/Queries'
import { SIGN_OUT, DELETE_USER } from '../graphql/Mutations'
import UnknownError from './UnknownError'

function ProfileOptions() {

    const history = useHistory()
    const [unknownError, setUnknownError] = useState(null)
    const { setAuthInfo } = useContext(AuthContext)

    const client = useApolloClient()

    const { data, loading, error } = useQuery(GET_CART, { 
        fetchPolicy: 'no-cache',
        onError: (errors) => {
        if (errors.message !== 'Failed to fetch') {
            setUnknownError(errors)
        }
    }})

    const [signOutUser, { loading: loadSignOut }] = useMutation(SIGN_OUT)
    const [deleteUser, { loading: loadDeleteUser}] = useMutation(DELETE_USER)

    function handleGoToCart() {
        history.push('/merch')
    }

    async function handleSignOut() {
        try {
            await signOutUser()
            await client.cache.reset()
            setAuthInfo({ userData: null })
            history.push('/')
        } catch (errors) {
            setUnknownError(errors)
        }
    }

    async function handleDeleteUser() {
        try {
            await deleteUser()
            await client.cache.reset()
            setAuthInfo({ userData: null })
            history.push('/')
        } catch (errors) {
            setUnknownError(errors)
        }
    }

    if (loading) return <h1>Loading...</h1>
    if (error && !unknownError) return <h1>Server Offline</h1>

    return (
        <div className='profile-background'>
            <div className="profile-wrapper">
                <div className="profile-headers">
                    <h1 className='profile-header'>PROFILE</h1>
                </div>
                <div className="profile-section">
                    {unknownError ? ( <UnknownError errors={unknownError} /> ) :
                    ( <div className="profile-section-wrapper">
                        <h1 className="profile-subsection-header">Email Address</h1>
                        <div className="profile-row">
                            <i className="fas fa-at" />
                            <h2 className="profile-info">{data ? data.allCart.user.email : 'hmm'}</h2>
                            <ActionButton dataTestId='deleteProfile' buttonSize='btn--medium' buttonStyle='btn--buy' onClick={handleDeleteUser} disabled={loadDeleteUser}>DELETE PROFILE</ActionButton>
                        </div>
                        <h1 className="profile-subsection-header">Cart</h1>
                        <div className="profile-row">
                            <i className="fas fa-shopping-cart" />
                            <h2 className="profile-info">£{data ? data.allCart.total : 0.00}</h2>
                            <ActionButton buttonSize='btn--medium' buttonStyle='btn--buy' onClick={handleGoToCart}>GO TO CART</ActionButton>
                        </div>
                        <ActionButton dataTestId='signOut' buttonSize='btn--large' buttonStyle='btn--buy' onClick={handleSignOut} disabled={loadSignOut}>SIGN OUT</ActionButton>
                    </div> )}
                </div>
            </div>
        </div>
    )
}

export default ProfileOptions
