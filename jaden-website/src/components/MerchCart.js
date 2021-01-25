import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react'
import './MerchCart.css'
import { Button } from './Button'
import MerchQuery from './MerchQuery'
import CartQuery from './CartQuery'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { GET_MERCH, GET_CART } from '../graphql/Queries'
import { ADD_TO_CART, PURCHASE_CART, REMOVE_FROM_CART, UPDATE_QUANTITY } from '../graphql/Mutations'
import { onError } from "@apollo/client/link/error";

function MerchCart(currentView) {

    const [total, setTotal] = useState(0)

    useEffect(() => {
        let total = 0;
        if (dataCart) {
            var calculateTotal = dataCart.allCart.map(cartEntry => {
                total += cartEntry.quantity * cartEntry.price
            })
        }
        setTotal(total.toFixed(2))
    })

    const { loading, error, data, refetch, networkStatus } = useQuery(GET_MERCH)
    console.log(data)

    const { loading: loadingCart, error: errorCart, data: dataCart } = useQuery(GET_CART)
    console.log({dataCart})

    const [addToCart,
        { loading: mutationLoadingAdd, error: mutationErrorAdd }] = useMutation(ADD_TO_CART, {
        update: updateCartWithNewEntry
    })

    const [removeFromCart, 
        { loading: mutationLoadingRemove, error: mutationErrorRemove }] = useMutation(REMOVE_FROM_CART, {
        update: updateCartWithRemovedEntry
    })

    const [updateQuantity, 
        { loading: mutationLoadingUpdate, error: mutationErrorUpdate }] = useMutation(UPDATE_QUANTITY, {
            update: updateCartWithUpdatedEntry
    })

    const [purchaseCart, 
        { loading: mutationLoadingPurchase, error: mutationErrorPurchase}] = useMutation(PURCHASE_CART, {
            update: updateCartWithPurchase
        })

    function updateCartWithNewEntry(cache, { data }) {
        cache.modify({
            fields: {
                allCart(existingCart = ***REMOVED***) {
                    const newCart = data.addToCart.cart
                    console.log(newCart)
                    console.log(...existingCart)
                    cache.writeQuery({
                        query: GET_CART,
                        data: { newCart }
                    })
                    console.log(cache.data)
                }    
            }
        })
    }

    function updateCartWithRemovedEntry(cache, { data }) {
        cache.modify({
            fields: {
                allCart(existingCart = ***REMOVED***) {
                    const newCart = data.deleteCartItemById.cart
                    console.log(newCart)
                    console.log(...existingCart)
                    cache.writeQuery({
                        query: GET_CART,
                        data: { newCart }
                    })
                }    
            }
        })
    }

    function updateCartWithUpdatedEntry(cache, { data }) {
        cache.modify({
            fields: {
                allCart(existingCart = ***REMOVED***) {
                    const newCart = data.updateCartItemQuantityById.cart
                    console.log(newCart)
                    console.log(...existingCart)
                    cache.writeQuery({
                        query: GET_CART,
                        data: { newCart }
                    })
                }    
            }
        })
    }

    function updateCartWithPurchase(cache, { data }) {
        cache.modify({
            fields: {
                allCart(existingCart = ***REMOVED***) {
                    const newCart = data.purchaseCart.cart
                    console.log(newCart)
                    console.log(...existingCart)
                    cache.writeQuery({
                        query: GET_CART,
                        data: { newCart }
                    })
                }    
            }
        })
    }

    function purchaseMessage() {
        purchaseCart()
        alert("Purchase Completed")
    }

    function checkMerchQuery() {
        if (error) {
            return <h1 className="empty-cart">Server Offline</h1>
        } else {
            return <MerchQuery data={data} loading={loading} error={error} addToCart={addToCart} networkStatus={networkStatus} mutationLoading={mutationLoadingAdd} mutationError={mutationErrorAdd} />
        }
    }

    function checkCartQuery() {
        if (errorCart) {
            return <h1 className="empty-cart">Server Offline</h1>
        } else {
            return <CartQuery data={dataCart} loading={loadingCart} error={errorCart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} mutationLoadingRemove={mutationLoadingRemove} mutationErrorRemove={mutationErrorRemove} mutationLoadingUpdate={mutationLoadingUpdate} mutationErrorUpdate={mutationErrorUpdate} />
        }
    }

    onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
        if (networkError) console.log(`[Network error]: ${networkError}`);
    });

    // save scroll position

    return (
        <>
        <div className="merch-background">
            <div className="merch-wrapper">
            <h1 className="merch-header">MERCH</h1>
                <div className="merch-section">
                    <div className="scroll-box-merch">
                        {checkMerchQuery()}
                    </div>
                </div>
            </div>
        </div>
        <div className="cart-background">
            <div className="cart-wrapper">
            <h1 className="cart-header">CART</h1>
                <div className="cart-section">
                    <div className="cart-headers">
                        <span className="cart-header-product">PRODUCT</span>
                        <span>SIZE</span>
                        <span>QUANTITY</span>
                        <span className="cart-header-price">PRICE</span>
                    </div>
                    <div className="scroll-box-cart"> 
                        {checkCartQuery()}
                    </div>
                    <div className="total-row">
                        <span className="total-name">Total</span>
                        <span className="total-price">£{total}</span>
                        <Button buttonStyle="btn--buy" buttonSize="btn--medium" onClick={purchaseMessage}>PURCHASE</Button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default MerchCart
