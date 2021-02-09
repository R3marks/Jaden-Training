import React, { useEffect, useState, useRef } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CART } from '../graphql/Queries'
import { PURCHASE_CART, REMOVE_FROM_CART, UPDATE_QUANTITY } from '../graphql/Mutations'
import ActionButton from './ActionButton'

function CartQuery() {

    const [sizeArray, setSizeArray] = useState(['', 'btn--select', ''])
    const [total, setTotal] = useState(0)
    const scrollBoxCart = useRef(null)

    useEffect(() => {
        let total = 0;
        if (data) {
            data.allCart.forEach(cartEntry => {
                total += cartEntry.quantity * cartEntry.price
            })
        }
        setTotal(total.toFixed(2))
    })

    const { loading, error, data } = useQuery(GET_CART)

    const [removeFromCart, 
        { loading: loadRemoveFromCart, error: errorRemoveFromCart }] = useMutation(REMOVE_FROM_CART, {
        update: updateCartWithRemovedEntry
    })

    const [updateQuantity, 
        { loading: loadUpdateQuantity, error: errorUpdateQuantity }] = useMutation(UPDATE_QUANTITY, {
            ignoreResults: true
        })

    const [purchaseCart, 
        { loading: loadPurchaseCart, error: errorPurchaseCart}] = useMutation(PURCHASE_CART, {
            update: updateCartWithPurchase
    })

    function updateCartWithRemovedEntry(cache, { data }) {
        cache.modify({
            fields: {
                allCart() {
                    const newCart = data.deleteCartItemById.cart
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
                    const newCart = data.updateCartItemQuantityById.cart
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
        await removeFromCart({ variables: {
            idProvided: cartId
        }})
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
        updateQuantity({ variables: {
            idProvided: id, newQuantity: parseInt(input.value)
        }})
    }

    function purchaseMessage() {
        purchaseCart()
        alert("Purchase Completed")
    }

    // Queries need to be handled better. It doesnt make sense to re-render everytime you change the quantity

    if (loading) return <h1 className="empty-cart">Loading...</h1>;
    if (loadRemoveFromCart || loadUpdateQuantity) return <h1 className="empty-cart">Removing From Cart...</h1>
    if (error && error.networkError) return <h1 className='empty-cart'>Server Offline</h1>
    if (error && error.graphQLErrors) return <h1 className="empty-cart">Log in to access cart</h1>
    if (errorRemoveFromCart || errorUpdateQuantity) return <h1 className="empty-cart">Error! ${JSON.stringify(error, errorRemoveFromCart, errorUpdateQuantity)}</h1>
    if (data.allCart.length === 0) return <h1 className="empty-cart">Your cart is empty</h1>
    if (loadPurchaseCart) return <h1>Test</h1>
    if (errorPurchaseCart) return <h1>Test</h1>

    return (
        <>
        <div ref={scrollBoxCart} className="scroll-box-cart">
            {data.allCart.map((product, index) => (
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
                        <input type="number" value={product.quantity} onChange={changeQuantity}></input>
                        <ActionButton buttonStyle="btn--buy" buttonSize="btn--medium" onClick={removeProductFromCart}>REMOVE</ActionButton>
                    </div>
                    <span className="cart-price">£{(product.price * product.quantity).toFixed(2)}</span>
                </div>
            ))}
        </div>    
        <div className="total-row">
            <span className="total-name">Total</span>
            <span className="total-price">£{total}</span>
            <ActionButton buttonStyle="btn--buy" buttonSize="btn--medium" onClick={purchaseMessage}>PURCHASE</ActionButton>
        </div>
        </>
    )
}

export default CartQuery
