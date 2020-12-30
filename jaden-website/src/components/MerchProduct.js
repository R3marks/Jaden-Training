import React from 'react'
import './MerchProduct.css'
import { Button } from './Button'
import test from './MerchCart'

function MerchProduct(props) {
    return (
        <div className="merch-product">
            <img className="merch-image" src={"./Images - Jaden/" + props.src}></img>
            <div className="merch-info">
                <span>CTV3 T-SHIRT</span>
                <span>£19.99</span>
            </div>
            <Button buttonStyle="btn--buy" buttonSize="btn--medium" onClick={test}>ADD TO CART</Button>
        </div>
    )
}

export default MerchProduct
