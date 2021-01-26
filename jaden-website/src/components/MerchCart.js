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
            return <CartQuery />
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
                        {checkCartQuery()}
                </div>
            </div>
        </div>
        </>
    )
}

export default MerchCart
