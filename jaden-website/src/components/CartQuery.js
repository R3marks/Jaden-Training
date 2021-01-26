import React, { useEffect, useState, useRef } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { GET_CART } from '../graphql/Queries'
import { PURCHASE_CART, REMOVE_FROM_CART, UPDATE_QUANTITY } from '../graphql/Mutations'
import { Button } from './Button'

function CartQuery() {

    const [total, setTotal] = useState(0)

    useEffect(() => {
        let total = 0;
        if (data) {
            data.allCart.map(cartEntry => {
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

    let refContainers = useRef(***REMOVED***)

    refContainers.current = [0,0,0].map(
        (ref, index) => refContainers.current[index] = React.createRef()
    )

    function selectSize(size) {
        for (var i = 0; i < refContainers.current.length; i++) {
            refContainers.current[i].className = "btn btn--size btn--square"
        }
        refContainers.current[size].className = "btn btn--size btn--square btn--select"
    }

    async function removeProductFromCart(event) {
        var cartId = event.target.parentElement.parentElement.parentElement.getAttribute('data-key')
        await removeFromCart({ variables: {
            idProvided: cartId
        }})
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
    if (error || errorRemoveFromCart || errorUpdateQuantity) return <h1 className="empty-cart">Error! ${JSON.stringify(error, errorRemoveFromCart, errorUpdateQuantity)}</h1>
    if (data.allCart.length == 0) return <h1 className="empty-cart">Your cart is empty</h1>
    if (loadPurchaseCart) return <h1>Test</h1>
    if (errorPurchaseCart) return <h1>Test</h1>

    return (
        <>
        <div className="scroll-box-cart">
            {data.allCart.map((product, index) => (
                <div className="cart-products"
                key={index} data-key={product.id}>
                    <div className="cart-product">
                        <img className="cart-image" alt="Cart" src={product.src}></img>
                        <span className="cart-name">{product.name}</span>
                    </div>
                    <div className="cart-size">
                        <Button ref={(Button) => refContainers.current[0] = Button} buttonStyle="btn--size" buttonSize="btn--square" onClick={() => selectSize(0)}>S</Button>
                        <Button ref={(Button) => refContainers.current[1] = Button} buttonStyle="btn--size" buttonSize="btn--square" onClick={() => selectSize(1)}>M</Button>
                        <Button ref={(Button) => refContainers.current[2] = Button} buttonStyle="btn--size" buttonSize="btn--square" onClick={() => selectSize(2)}>L</Button>
                    </div>
                    <div className="cart-quantity">
                        <input type="number" value={product.quantity} onChange={changeQuantity}></input>
                        <Button buttonStyle="btn--buy" buttonSize="btn--medium" onClick={removeProductFromCart}>REMOVE</Button>
                    </div>
                    <span className="cart-price">£{(product.price * product.quantity).toFixed(2)}</span>
                </div>
            ))}
        </div>    
        <div className="total-row">
            <span className="total-name">Total</span>
            <span className="total-price">£{total}</span>
            <Button buttonStyle="btn--buy" buttonSize="btn--medium" onClick={purchaseMessage}>PURCHASE</Button>
        </div>
        </>
    )
}

export default CartQuery
