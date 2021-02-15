import React, { useState } from 'react'
import './MerchQuery.css'
import { useQuery, useMutation } from '@apollo/client'
import { GET_MERCH, GET_CART } from '../graphql/Queries'
import { ADD_TO_CART } from '../graphql/Mutations'
import ActionButton from './ActionButton'
import { LinkedButton } from './LinkedButton'

function MerchQuery(props) {

    const [isUserSignedIn, setIsUserSignedIn] = useState(true)

    const { loading, error, data } = useQuery(GET_MERCH)

    const [addToCart,
        { loading: loadAddToCart, error: errorAddToCart }] = useMutation(ADD_TO_CART, {
        update: updateCartWithNewEntry
    })

    async function updateCartWithNewEntry(cache, { data }) {
        cache.modify({
            fields: {
                allCart() {
                    const newCart = data.addToCart.cartItems
                    cache.writeQuery({
                        query: GET_CART,
                        data: { newCart }
                    })
                }    
            }
        })
    }

    async function addToCartById(event) {
        var prevScrollTop = event.target.parentElement.parentElement.scrollTop
        var merchId = event.target.parentElement.getAttribute('data-key')
        try {
            await addToCart({ variables: {
                idProvided: merchId
            }})
        } catch (errors) {
            console.log(JSON.stringify(errors))
            const { message } = errors
            if (message === 'User has not logged in') {
                // alert('Sign in to add merch to your cart')
                setIsUserSignedIn(false)
            } else {
                console.log(errors)
            }
        }
        props.scrollBoxMerch.current.scrollTop = prevScrollTop
    }

    if (loading) return <h1>Loading...</h1>;
    // if (loadAddToCart) return <h1 className="empty-cart">Adding To Cart...</h1>
    if (error && error.message === 'Failed to fetch') return <h1>Server Offline</h1>
    // if (errorAddToCart) return <h1>Error! {JSON.stringify(errorAddToCart)}</h1>
    if (data.allMerch.length === 0) return <h1 className="empty-cart">Your Cart is Empty</h1>

    if (!isUserSignedIn) return (
        <div>
        <h1 className='unauth-message'>You'll need to sign in first before you can add merch to cart</h1>
        <div className='choice-buttons'>
            <ActionButton buttonStyle='btn--buy' buttonSize='btn--large' onClick={() => setIsUserSignedIn(true)}>Keep Browsing</ActionButton>
            <LinkedButton buttonStyle='btn--buy' buttonSize='btn--large' linkTo='/sign-up'>Sign In</LinkedButton>
        </div>
        </div>

    )

    return (
        data.allMerch.map((merch, index) => (
            <div className="merch-product" key={index} data-key={merch.id} data-item="true">
                <img className="merch-image" alt="Merch" src={merch.src}></img>
                <div className="merch-info">
                    <span>{merch.name}</span>
                    <span>£{merch.price}</span>
                </div>
                <ActionButton buttonStyle="btn--buy" buttonSize="btn--medium" onClick={addToCartById}>ADD TO CART</ActionButton>
            </div> 
        ))
    )
}

export default MerchQuery
