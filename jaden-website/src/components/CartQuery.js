import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { GET_CART } from '../graphql/Queries'
import { PURCHASE_CART, REMOVE_FROM_CART, UPDATE_QUANTITY } from '../graphql/Mutations'
import { Button } from './Button'

function CartQuery(props) {

    const { loading, error, data } = useQuery(GET_CART)
    console.log(data)
    if (data) { props.setCart(data)}

    const [removeFromCart, 
        { loading: mutationLoadingRemove, error: mutationErrorRemove }] = useMutation(REMOVE_FROM_CART, {
        update: updateCartWithRemovedEntry
    })

    const [updateQuantity, 
        { loading: mutationLoadingUpdate, error: mutationErrorUpdate }] = useMutation(UPDATE_QUANTITY, {
            update: updateCartWithUpdatedEntry
    })

    function updateCartWithRemovedEntry(cache, { data }) {
        cache.modify({
            fields: {
                allCart(existingCart = []) {
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
                allCart(existingCart = []) {
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

    const [highlight, setHighlight] = useState()
    let refContainers = useRef([])

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
        var parent = event.target.parentElement.parentElement.parentElement.getAttribute('data-key')
        console.log(parent)
        console.log(typeof(parent))
        await removeFromCart({ variables: {
            idProvided: parent
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

    if (loading) return <h1 className="empty-cart">Loading...</h1>;
    if (mutationLoadingRemove || mutationLoadingUpdate) return <h1 className="empty-cart">Removing From Cart...</h1>
    if (error || mutationErrorRemove || mutationErrorUpdate) return <h1>Error! ${props.error}</h1>
    if (data.allCart.length == 0) return <h1 className="empty-cart">Your cart is empty</h1>

    return (
        data.allCart.map((product, index) => (
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
        ))
    )
}

export default CartQuery
