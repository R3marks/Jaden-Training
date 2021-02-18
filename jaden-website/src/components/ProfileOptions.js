import React, { useEffect, useContext } from 'react'
import './ProfileOptions.css'
import { useHistory } from 'react-router-dom'
import { AuthContext } from './AuthProvider'
import ActionButton from './ActionButton'
import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client'
import { GET_CART } from '../graphql/Queries'
import { SIGN_OUT } from '../graphql/Mutations'

function ProfileOptions() {

    const history = useHistory()
    const { authInfo, setAuthInfo } = useContext(AuthContext)

    const client = useApolloClient()

    const [getUsersCart, { data }] = useLazyQuery(GET_CART, {
        fetchPolicy: 'no-cache'
    })
    const [signOutUser, { loading }] = useMutation(SIGN_OUT)

    useEffect(() => {
        getUsersCart()
    }, [authInfo])

    function handleGoToCart() {
        history.push('/merch')
    }

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
        <div className='profile-background'>
            <div className="profile-wrapper">
                <div className="profile-headers">
                    <h1 className='profile-header'>PROFILE</h1>
                </div>
                <div className="profile-section">
                    <div className="profile-section-wrapper">
                        <h1 className="profile-subsection-header">Email Address</h1>
                        <div className="profile-row">
                            <i className="fas fa-at" />
                            <h2 className="profile-info">{data ? data.allCart.user.email : 'hmm'}</h2>
                            <ActionButton buttonSize='btn--medium' buttonStyle='btn--buy'>DELETE PROFILE</ActionButton>
                        </div>
                        <h1 className="profile-subsection-header">Cart</h1>
                        <div className="profile-row">
                            <i className="fas fa-shopping-cart" />
                            <h2 className="profile-info">£{data ? data.allCart.total : 0.00}</h2>
                            <ActionButton buttonSize='btn--medium' buttonStyle='btn--buy' onClick={handleGoToCart}>GO TO CART</ActionButton>
                        </div>
                        <ActionButton buttonSize='btn--large' buttonStyle='btn--buy' onClick={handleSignOut} disabled={loading}>SIGN OUT</ActionButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileOptions
