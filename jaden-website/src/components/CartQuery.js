import React, { useState, useRef } from 'react'
import './CartQuery.css'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CART } from '../graphql/Queries'
import { PURCHASE_CART, REMOVE_FROM_CART, UPDATE_QUANTITY } from '../graphql/Mutations'
import ActionButton from './ActionButton'

function CartQuery() {

    const [errorMessage, setErrorMessage] = useState(null)
    const [sizeArray, setSizeArray] = useState(['', 'btn--select', ''])
    const scrollBoxCart = useRef(null)

    const { loading, error, data } = useQuery(GET_CART, 
        { onError: (errors) => {
            if (errors.message === 'Failed to fetch') {
                setErrorMessage('Server Offline')
            } else {
                console.log(JSON.stringify(errors))
            }
        }
    })

    const [removeFromCart, { loading: loadRemoveFromCart }] = useMutation(REMOVE_FROM_CART, {
        update: updateCartWithRemovedEntry
    })

    const [updateQuantity, { loading: loadUpdateQuantity }] = useMutation(UPDATE_QUANTITY, {
        update: updateCartWithUpdatedEntry
    })

    const [purchaseCart, { loading: loadPurchaseCart }] = useMutation(PURCHASE_CART, {
        update: updateCartWithPurchase
    })

    function updateCartWithRemovedEntry(cache, { data }) {
        cache.modify({
            fields: {
                allCart() {
                    const newCart = data.removeFromCart.cart
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
                allCart() {
                    const newCart = data.updateCart.cart
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
                allCart() {
                    const newCart = data.purchaseCart.cart
                    cache.writeQuery({
                        query: GET_CART,
                        data: { newCart }
                    })
                }    
            }
        })
    }

    function selectSize(size) {
        let newSizeArray = ['', '', '']
        newSizeArray[size] = 'btn--select'
        setSizeArray(newSizeArray)
    }

    async function removeProductFromCart(event) {
        var prevScrollTop = event.target.parentElement.parentElement.parentElement.scrollTop
        var cartId = event.target.parentElement.parentElement.getAttribute('data-key')
        try {
            await removeFromCart({ variables: {
                idProvided: cartId
            }})
        } catch (errors) {
            console.log(JSON.stringify(errors))
        }
        scrollBoxCart.current.scrollTop = prevScrollTop
    }

    function changeQuantity(event) {
        var input = event.target
        var id = event.target.parentElement.parentElement.getAttribute('data-key')
        console.log(id)
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1
        } else { 
            input.value = Math.round(input.value)
        }
        try {
            updateQuantity({ variables: {
                idProvided: id, newQuantity: parseInt(input.value)
            }})
        } catch (errors) {
            console.log(JSON.stringify(errors))
        }
    }

    function purchaseMessage() {
        try {
            purchaseCart()
            alert("Purchase Completed")
        } catch (errors) {
            console.log(JSON.stringify(errors))
        }
    }

    // Queries need to be handled better. It doesnt make sense to re-render everytime you change the quantity
    if (loading) return <h1 className="empty-cart">Loading...</h1>;
    if (error) return <h1 className="empty-cart">{errorMessage}</h1>
    if (data.allCart && data.allCart.cartItems.length === 0) return <h1 className="empty-cart">Your cart is empty</h1>
    if (!data.allCart) return <h1 className="empty-cart">Your cart is empty</h1>

    return (
        <>
        <div ref={scrollBoxCart} className="scroll-box-cart">
            {data.allCart.cartItems.map((product, index) => (
                <div className="cart-products"
                key={index} data-key={product.id}>
                    <div className="cart-product">
                        <img className="cart-image" alt="Cart" src={product.src}></img>
                        <span className="cart-name">{product.name}</span>
                    </div>
                    <div className="cart-size">
                        <ActionButton buttonStyle="btn--size" buttonSize="btn--square" select={sizeArray[0]} onClick={() => selectSize(0)}>S</ActionButton>
                        <ActionButton buttonStyle="btn--size" buttonSize="btn--square" select={sizeArray[1]} onClick={() => selectSize(1)}>M</ActionButton>
                        <ActionButton buttonStyle="btn--size" buttonSize="btn--square" select={sizeArray[2]} onClick={() => selectSize(2)}>L</ActionButton>
                    </div>
                    <div className="cart-quantity">
                        <input type="number" value={product.quantity} onChange={changeQuantity} disabled={loadUpdateQuantity}></input>
                        <ActionButton buttonStyle="btn--buy" buttonSize="btn--medium" onClick={removeProductFromCart} disabled={loadRemoveFromCart}>REMOVE</ActionButton>
                    </div>
                    <span className="cart-price">£{(product.price * product.quantity).toFixed(2)}</span>
                </div>
            ))}
        </div>    
        <div className="total-row">
            <span className="total-name">Total</span>
            <span className="total-price">£{data.allCart.total.toFixed(2)}</span>
            <ActionButton buttonStyle="btn--buy" buttonSize="btn--large" onClick={purchaseMessage} disabled={loadPurchaseCart}>PURCHASE</ActionButton>
        </div>
        </>
    )
}

export default CartQuery
