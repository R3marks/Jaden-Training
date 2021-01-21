import React from 'react'
import { Button } from './Button'

function MerchQuery(props) {

    async function checkId(event) {
        var parent = event.target.parentElement.parentElement.getAttribute('data-key')
        console.log(parent)
        console.log(typeof(parent))
        await props.addToCart({ variables: {
            idProvided: parent
        }})
    }

    if (props.networkStatus === 4) return <h1>Refetching</h1>
    if (props.loading) return <h1>Loading...</h1>;
    if (props.error) return <h1>Error! ${props.error}</h1>
    if (props.data.allMerch.length === 0) return <h1>No Shows Available</h1>

    return (
        props.data.allMerch.map((merch, index) => (
            <div className="merch-product" key={index} data-key={merch.id}>
                <img className="merch-image" alt="Merch" src={merch.src}></img>
                <div className="merch-info">
                    <span>{merch.name}</span>
                    <span>£{merch.price}</span>
                </div>
                <Button buttonStyle="btn--buy" buttonSize="btn--medium" onClick={checkId}>ADD TO CART</Button>
            </div> 
        ))
    )
}

export default MerchQuery
