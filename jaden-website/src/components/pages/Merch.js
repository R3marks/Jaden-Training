import React, { useContext } from 'react';
import '../../App.css';
import Navbar from '../Navbar'
import MerchSection from '../MerchSection'
import CartSection from '../CartSection'
import { AuthContext } from '../AuthProvider';

export default function Merch () {

    const { isAuthenticated } = useContext(AuthContext)
    var result = isAuthenticated()

    return (
        <>
            <Navbar />
            <MerchSection />
            {result ? <CartSection /> : undefined}
        </>
    )
}