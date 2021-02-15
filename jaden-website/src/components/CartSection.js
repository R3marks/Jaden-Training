import React from 'react'
import './CartSection.css'
import CartQuery from './CartQuery'

function CartSection() {
    return (
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
                    <CartQuery />
                </div>
            </div>
        </div>
    )
}

export default CartSection
