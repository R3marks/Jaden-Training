import React, { useState, useRef } from 'react'
import './MerchCart.css'
import { Button } from './Button'

function MerchCart() {

    const IMAGES = [
        "twitter-icon.png",
        "ctv3_tshirt.png",
        "ctv3_hoodie.png",
        "erys.jpg",
        "syre.jpg"
    ]

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
        <>
        <div className="merch-background">
            <div className="merch-wrapper">
            <h1 className="merch-header">MERCH</h1>
                <div className="merch-section">
                    <div className="scroll-box-merch">
                        {IMAGES.map((image, index) => (
                            <div className="merch-product" key={index}>
                            <img className="merch-image" src={"./Images - Jaden/" + image}></img>
                            <div className="merch-info">
                                <span>CTV3 T-SHIRT</span>
                                <span>£19.99</span>
                            </div>
                            <Button buttonStyle="btn--buy" buttonSize="btn--medium" >ADD TO CART</Button>
                        </div> 
                        ))}
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
                        {IMAGES.map((image, index) => (
                            <div className="cart-products"
                            key={index}>
                            <div className="cart-product">
                                <img className="cart-image" src={"./Images - Jaden/" + image}></img>
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
                        ))}
                        {/* <CartProduct src="ctv3_hoodie.png" />   */}
                    </div>
                    <div className="total-row">
                        <span className="total-name">Total</span>
                        <span className="total-price">£39.98</span>
                        <Button buttonStyle="btn--buy" buttonSize="btn--medium">PURCHASE</Button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default MerchCart
