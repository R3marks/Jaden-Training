import React, { useRef } from 'react'
import './MerchCart.css'
import MerchQuery from './MerchQuery'

function MerchSection() {

    const scrollBoxMerch = useRef(null)

    return (
        <div className="merch-background">
            <div className="merch-wrapper">
            <h1 className="merch-header">MERCH</h1>
                <div className="merch-section">
                    <div ref={scrollBoxMerch} className="scroll-box-merch">
                        <MerchQuery scrollBoxMerch={scrollBoxMerch} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MerchSection
