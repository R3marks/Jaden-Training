import React, { useState, useEffect } from 'react'
import './MerchQuery.css'
import { useQuery, useMutation } from '@apollo/client'
import { GET_MERCH, GET_CART } from '../graphql/Queries'
import { ADD_TO_CART } from '../graphql/Mutations'
import ActionButton from './ActionButton'
import { LinkedButton } from './LinkedButton'
import UnknownError from './UnknownError'

function MerchQuery(props) {

    const [buttonSize, setButtonSize] = useState(true)
    const [isUserSignedIn, setIsUserSignedIn] = useState(true)
    const [unknownError, setUnknownError] = useState(null)

    const resizeButton = () => {
        if(window.innerWidth <= 768) {
            setButtonSize(false);
        } else {
            setButtonSize(true);
        }
    }

    useEffect(() => {
        resizeButton();
    }, ***REMOVED***);

    window.addEventListener('resize', resizeButton);

    const { loading, error, data } = useQuery(GET_MERCH,
        { onError: (errors) => {
            if (errors.message !== 'Failed to fetch') {
                setUnknownError(errors)
            }
        }
    })

    const [addToCart, { loading: loadAddToCart }] = useMutation(ADD_TO_CART, {
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
        props.scrollBoxMerch.current.scrollTop = prevScrollTop
        try {
            await addToCart({ variables: {
                idProvided: merchId
            }})
        } catch (errors) {
            if (errors.message === 'User has not logged in') {
                setIsUserSignedIn(false)
            } else if (errors.message !== 'Failed to fetch') {
                setUnknownError(errors)
            }
        }
    }

    if (loading) return <h1>Loading...</h1>;
    if (unknownError) return <UnknownError errors={unknownError} />
    if (error && !unknownError) return <h1>Server Offline</h1>

    if (!isUserSignedIn) return (
        <div className='unauth-box'>
            <p className='unauth-message'>You'll need to sign in first before you can add merch to cart</p>
            <div className='choice-buttons'>
                <ActionButton buttonStyle='btn--buy' buttonSize={buttonSize ? 'btn--large' : 'btn--medium'} onClick={() => setIsUserSignedIn(true)}>Keep Browsing</ActionButton>
                <LinkedButton buttonStyle='btn--buy' buttonSize={buttonSize ? 'btn--large' : 'btn--medium'} linkTo='/sign-in'>Sign In</LinkedButton>
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
                <ActionButton dataTestId={`addToCart-${merch.id}`} buttonStyle="btn--buy" buttonSize="btn--medium" onClick={addToCartById} disabled={loadAddToCart}>ADD TO CART</ActionButton>
            </div> 
        ))
    )
}

export default MerchQuery
