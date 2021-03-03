import React, { useState, useEffect } from 'react'
import './CartSection.css'
import CartQuery from './CartQuery'

function CartSection() {

    const [cartHeaders, setCartHeaders] = useState(true)

    const resizeCart = () => {
        if(window.innerWidth <= 768) {
            setCartHeaders(false);
        } else {
            setCartHeaders(true);
        }
    }

    useEffect(() => {
        resizeCart();
    }, ***REMOVED***);

    window.addEventListener('resize', resizeCart);

    return (
        <div className="cart-background">
            <div className="cart-wrapper">
            <h1 className="cart-header">CART</h1>
                <div className="cart-section">
                    {cartHeaders ? <div className="cart-headers">
                        <span className="cart-header-product">PRODUCT</span>
                        <span>SIZE</span>
                        <span>QUANTITY</span>
                        <span className="cart-header-price">PRICE</span>
                    </div> : <span className='cart-header-mobile'>PRODUCT</span>}
                    <CartQuery />
                </div>
            </div>
        </div>
    )
}

export default CartSection
