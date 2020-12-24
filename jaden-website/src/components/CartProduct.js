import React, { useState, useRef } from 'react'
import './CartProduct.css'
import { Button } from './Button'

function CartProduct(props) {
    const [quantity, setQuantity] = useState(1)

    function changeQuantity (event) {
        var input = event.target
        console.log(input)
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1
        } else {
            setQuantity(event.target.value)  
        }

    }

    let refContainers = useRef([])

    refContainers.current = [0,0,0].map(
        (ref, index) =>   refContainers.current[index] = React.createRef()
    )

    function selectSize (size) {
        console.log(refContainers.current.length)
        for (var i = 0; i < refContainers.current.length; i++) {
            console.log(refContainers.current)
            refContainers.current[i].className = "btn btn--size btn--square"
        }
        refContainers.current[size].className = "btn btn--size btn--square btn--select"
    };

    return (
        <div className="cart-products">
            <div className="cart-product">
                <img className="cart-image" src={"./Images - Jaden/" + props.src}></img>
                <span className="cart-name">CTV3 T-SHIRT</span>
            </div>
            <div className="cart-size">
                <Button ref={(Button) => refContainers.current[0] = Button} buttonStyle="btn--size" buttonSize="btn--square" onClick={() => selectSize(0)}>S</Button>
                <Button ref={(Button) => refContainers.current[1] = Button} buttonStyle="btn--size" buttonSize="btn--square" buttonState="btn--select" onClick={() => selectSize(1)}>M</Button>
                <Button ref={(Button) => refContainers.current[2] = Button} buttonStyle="btn--size" buttonSize="btn--square" onClick={() => selectSize(2)}>L</Button>
            </div>
            <div className="cart-quantity">
                <input type="number" value={quantity} onChange={e => changeQuantity(e)}></input>
                <Button buttonStyle="btn--buy" buttonSize="btn--medium">REMOVE</Button>
            </div>
            <span className="cart-price">£19.99</span>
        </div>
    )
}

export default CartProduct
