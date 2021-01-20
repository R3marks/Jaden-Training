import React, { useState, useRef } from 'react'
import { Button } from './Button'

function CartQuery(props) {

    const [highlight, setHighlight] = useState()
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

    // function selectSize(size) {
    //     console.log(size)
    // }

    function changeQuantity(n) {
        console.log('')
    }

    function removeProductFromCart() {
        console.log('')
    }

    // buttonState="btn--select"


    if (props.loading) return <h1>Loading...</h1>;
    if (props.error) return <h1>Error! ${props.error}</h1>
    if (props.data.allCart.length == 0) return <h1>No Shows Available</h1>

    return (
        props.data.allCart.map((product, index) => (
            <div className="cart-products"
            key={index}>
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
                <input type="number" value={product.quantity} onChange={e => changeQuantity(e)}></input>
                <Button buttonStyle="btn--buy" buttonSize="btn--medium" onClick={removeProductFromCart.bind(this)}>REMOVE</Button>
            </div>
            <span className="cart-price">£{(product.price * product.quantity).toFixed(2)}</span>
        </div>
        ))
    )
}

export default CartQuery
