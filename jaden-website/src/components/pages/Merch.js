import React from 'react';
import '../../App.css';
import Navbar from '../Navbar'
import MerchSection from '../MerchSection'
import CartSection from '../CartSection'

export default function Merch () {
    return (
        <>
            <Navbar />
            <MerchSection />
            <CartSection />
        </>
    )
}