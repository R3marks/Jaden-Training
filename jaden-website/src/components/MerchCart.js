import React from 'react'
import './MerchCart.css'
import MerchQuery from './MerchQuery'
import CartQuery from './CartQuery'

function MerchCart() {

    // save scroll position

    return (
        <>
        <div className="merch-background">
            <div className="merch-wrapper">
            <h1 className="merch-header">MERCH</h1>
                <div className="merch-section">
                    <div className="scroll-box-merch">
                        <MerchQuery />
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
                    <CartQuery />
                </div>
            </div>
        </div>
        </>
    )
}

export default MerchCart
