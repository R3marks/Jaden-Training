import React, { useState, useEffect, useRef } from 'react'
import './MerchCart.css'
import { Button } from './Button'

function MerchCart() {

    // const IMAGES = [
    //     "twitter-icon.png",
    //     "ctv3_tshirt.png",
    //     "ctv3_hoodie.png",
    //     "erys.jpg",
    //     "syre.jpg"
    // ]

    const MERCH = [{
        src: "twitter-icon.png",
        name: "TWITTER PIN",
        price: 0.99
    }, {
        src: "ctv3_tshirt.png",
        name: "CTV3 T-SHIRT",
        price: 19.99
    }]

    const [cart, setCart] = useState(***REMOVED***)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total += cart[i].quantity * cart[i].price
            console.log(cart[i].quantity, cart[i].price)
        }
        console.log(total)
        setTotal(total.toFixed(2))
    }, [cart])

    const removePoundSign = new RegExp('(?<=£).*')
    const getSrcName = new RegExp('(?<=Jaden/).*')

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
        console.log(cartProduct)
        console.log(cart)
        for (let i = 0; i < cart.length; i++) {
            console.log(cart[i])
            console.log(cartProduct)
            if (cart[i].src === cartProduct.src) {
                console.log('HERE')
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
        console.log(cartProductPrice)
        var cartProductInfo = cartQuantityInfo.previousElementSibling.previousElementSibling
        var [productImage, productName] = cartProductInfo.children
        var merchSrc = productImage.src.match(getSrcName)
        console.log(merchSrc[0])
        var productToRemove = {
            src: merchSrc[0],
            name: productName.innerText,
            price: cartProductPrice.innerText
        }
        const newCart = ***REMOVED***
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].src !== productToRemove.src) {
                newCart.push(cart[i])
            }
        }
        console.log(cart)
        setCart(newCart)
        console.log(newCart)
    }

    function changeQuantity (event) {
        var input = event.target
        var cartProductImage = input.parentElement.previousElementSibling.previousElementSibling.children[0].src.match(getSrcName)
        console.log(cartProductImage[0])
        const newCart = ***REMOVED***
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
            // updatePrice()  
        }
    }

    let refContainers = useRef(***REMOVED***)

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
                        {MERCH.map((merch, index) => (
                            <div className="merch-product" key={index}>
                                <img className="merch-image" alt="Merch" src={"./Images - Jaden/" + merch.src}></img>
                                <div className="merch-info">
                                    <span>{merch.name}</span>
                                    <span>£{merch.price}</span>
                                </div>
                                <Button buttonStyle="btn--buy" buttonSize="btn--medium" onClick={addProductToCart.bind(this)}>ADD TO CART</Button>
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
                        {cart.length == 0 && 
                            <span class="empty-cart">Your cart is empty</span>
                        }
                        {cart.map((product, index) => (
                            <div className="cart-products"
                            key={index}>
                            <div className="cart-product">
                                <img className="cart-image" alt="Cart" src={"./Images - Jaden/" + product.src}></img>
                                <span className="cart-name">{product.name}</span>
                            </div>
                            <div className="cart-size">
                                <Button ref={(Button) => refContainers.current[0] = Button} buttonStyle="btn--size" buttonSize="btn--square" onClick={() => selectSize(0)}>S</Button>
                                <Button ref={(Button) => refContainers.current[1] = Button} buttonStyle="btn--size" buttonSize="btn--square" buttonState="btn--select" onClick={() => selectSize(1)}>M</Button>
                                <Button ref={(Button) => refContainers.current[2] = Button} buttonStyle="btn--size" buttonSize="btn--square" onClick={() => selectSize(2)}>L</Button>
                            </div>
                            <div className="cart-quantity">
                                <input type="number" value={product.quantity} onChange={e => changeQuantity(e)}></input>
                                <Button buttonStyle="btn--buy" buttonSize="btn--medium" onClick={removeProductFromCart.bind(this)}>REMOVE</Button>
                            </div>
                            <span className="cart-price">£{(product.price * product.quantity).toFixed(2)}</span>
                        </div>
                        ))}
                    </div>
                    <div className="total-row">
                        <span className="total-name">Total</span>
                        <span className="total-price">£{total}</span>
                        <Button buttonStyle="btn--buy" buttonSize="btn--medium">PURCHASE</Button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default MerchCart
