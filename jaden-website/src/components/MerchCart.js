import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react'
import './MerchCart.css'
import { Button } from './Button'
import MerchQuery from './MerchQuery'
import CartQuery from './CartQuery'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { GET_MERCH, GET_CART } from '../graphql/Queries'
import { ADD_TO_CART, PURCHASE_CART, REMOVE_FROM_CART, UPDATE_QUANTITY } from '../graphql/Mutations'
import { onError } from "@apollo/client/link/error";

function MerchCart() {

    const [purchaseCart, 
        { loading: mutationLoadingPurchase, error: mutationErrorPurchase}] = useMutation(PURCHASE_CART, {
            update: updateCartWithPurchase
    })

    function updateCartWithPurchase(cache, { data }) {
        cache.modify({
            fields: {
                allCart(existingCart = []) {
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

    const [total, setTotal] = useState(0)
    const [cart, setCart] = useState([])

    useEffect(() => {
        let total = 0;
        if (cart.length !== 0) {
            var calculateTotal = cart.allCart.map(cartEntry => {
                total += cartEntry.quantity * cartEntry.price
            })
        }
        setTotal(total.toFixed(2))
    }, [cart])

    function purchaseMessage() {
        purchaseCart()
        alert("Purchase Completed")
    }

    let x = 3
    

    function checkMerchQuery() {
        if (x == 4) {
            return <h1 className="empty-cart">Server Offline</h1>
        } else {
            return <MerchQuery />
        }
    }

    function checkCartQuery() {
        if (x == 4) {
            return <h1 className="empty-cart">Server Offline</h1>
        } else {
            return <CartQuery setCart={setCart} />
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
