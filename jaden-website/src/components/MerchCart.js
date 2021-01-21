import React, { useState, useEffect, useRef } from 'react'
import './MerchCart.css'
import { Button } from './Button'
import MerchQuery from './MerchQuery'
import CartQuery from './CartQuery'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { GET_MERCH, GET_CART } from '../graphql/Queries'
import { ADD_TO_CART } from '../graphql/Mutations'
import { onError } from "@apollo/client/link/error";

function MerchCart() {

    const MERCH = [{
        src: "/Images - Jaden/ctv3_tshirt.png",
        name: "CTV3 T-SHIRT",
        price: 19.99
    }, {
        src: "/Images - Jaden/ctv3_hoodie.png",
        name: "CTV3 HOODIE",
        price: 29.99
    }, {
        src: "/Images - Jaden/erys.jpg",
        name: "ERYS",
        price: 13.99
    }, {
        src: "/Images - Jaden/twitter-icon.png",
        name: "TWITTER PIN",
        price: 0.99
    }, {
        src: "/Images - Jaden/syre.jpg",
        name: "SYRE",
        price: 12.99
    }]

    const { loading, error, data, refetch, networkStatus } = useQuery(GET_MERCH)
    console.log(data)

    const { loading: loadingCart, error: errorCart, data: dataCart } = useQuery(GET_CART)
    console.log({dataCart})

    const [addToCart] = useMutation(ADD_TO_CART)

    function newSearch(event) {
        refetch()
    }

    function checkMerchQuery() {
        if (error) {
            return <h1>Server Offline</h1>
        } else {
            return <MerchQuery data={data} loading={loading} error={error} addToCart={addToCart} networkStatus={networkStatus} />
        }
    }

    function checkCartQuery() {
        if (errorCart) {
            return <h1>Server Offline</h1>
        } else {
            return <CartQuery data={dataCart} loading={loadingCart} error={errorCart} />
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

    const [cart, setCart] = useState([])
    const [total, setTotal] = useState(0)

    const removePoundSign = new RegExp('(?<=£).*')
    const getSrcName = new RegExp('(?<=Jaden/).*')

    // useEffect(() => {
    //     let total = 0;
    //     for (let i = 0; i < cart.length; i++) {
    //         total += cart[i].quantity * cart[i].price
    //         console.log(cart[i].quantity, cart[i].price)
    //     }
    //     console.log(total)
    //     setTotal(total.toFixed(2))
    // }, [cart])

    // useEffect(() => {
    //     getMerch()
    //     getCart()
    // }, [])

    function addProductToCart(element) {
        let parent = element.target.parentElement
        var merchInfo = parent.previousElementSibling
        var merchImage = merchInfo.previousElementSibling
        var merchSrc = merchImage.src.match(getSrcName)
        var [productName, productPrice] = merchInfo.children
        var numericProductPrice = Number(productPrice.innerText.match(removePoundSign))
        var cartProduct = {
            src: merchSrc[0],
            name: productName.innerText,
            price: numericProductPrice,
            quantity: 1
        }
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].src === cartProduct.src) {
                alert('Item has already been added!')
                return
            }  
        }
        const newCart = [...cart, cartProduct]
        setCart(newCart)
    }

    function removeProductFromCart(element) {
        let parent = element.target.parentElement
        var cartQuantityInfo = parent.parentElement
        var cartProductPrice = cartQuantityInfo.nextElementSibling
        var cartProductInfo = cartQuantityInfo.previousElementSibling.previousElementSibling
        var [productImage, productName] = cartProductInfo.children
        var merchSrc = productImage.src.match(getSrcName)
        var productToRemove = {
            src: merchSrc[0]
        }
        const newCart = []
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].src !== productToRemove.src) {
                newCart.push(cart[i])
            }
        }
        setCart(newCart)
    }

    function changeQuantity(event) {
        var input = event.target
        var cartProductImage = input.parentElement.previousElementSibling.previousElementSibling.children[0].src.match(getSrcName)
        const newCart = []
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1
        } else { 
            let value = Math.round(input.value)
            for (let i = 0; i < cart.length; i++) {
                newCart.push(cart[i])
                if (cart[i].src === cartProductImage[0]) {
                    newCart[i].quantity = value
                }
            }
            setCart(newCart) 
        }
    }

    function purchaseMessage() {
        setCart([])
        alert("Purchase Completed")
    }

    if (loadingCart) return <h1>Loading...</h1>
    if (errorCart) return <h1>Error</h1>

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
                        {/* {cart.length == 0 && 
                            <span className="empty-cart">Your cart is empty</span>
                        } */}
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
