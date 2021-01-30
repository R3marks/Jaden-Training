import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_MERCH, GET_CART } from '../graphql/Queries'
import { ADD_TO_CART } from '../graphql/Mutations'
import ActionButton from './ActionButton'
import { onError } from "@apollo/client/link/error";

function MerchQuery(props) {

    const { loading, error, data } = useQuery(GET_MERCH)

    const [addToCart,
        { loading: loadAddToCart, error: errorAddToCart }] = useMutation(ADD_TO_CART, {
        update: updateCartWithNewEntry
    })

    onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
        if (networkError) console.log(`[Network error]: ${networkError}`);
    });

    async function updateCartWithNewEntry(cache, { data }) {
        cache.modify({
            fields: {
                allCart() {
                    const newCart = data.addToCart.cart
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
        await addToCart({ variables: {
            idProvided: merchId
        }})
        props.scrollBoxMerch.current.scrollTop = prevScrollTop
    }

    if (loading) return <h1>Loading...</h1>;
    if (loadAddToCart) return <h1 className="empty-cart">Adding To Cart...</h1>
    if (error) return <h1>Error! {JSON.stringify(error)}</h1>
    if (errorAddToCart) return <h1>Error! {JSON.stringify(errorAddToCart)}</h1>
    if (data.allMerch.length === 0) return <h1 className="empty-cart">Your Cart is Empty</h1>

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
