import React, { useRef, useMemo, useLayoutEffect } from 'react'
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

    // const findFirstElementInViewPort = elements =>
    // Array.prototype.find.call(
    //   elements,
    //   element => element.getBoundingClientRect().y >= 85 // nav height offset
    // );

    // // Ref to the container with elements
    // const containerRef = useRef(null);

    // const scrollTo = useMemo(() => {
    //     // Find all elements in container which will be checked if are in view or not
    //     const nodeElements = containerRef.current?.querySelectorAll("[data-item]");
    //     if (nodeElements) {
    //         return findFirstElementInViewPort(nodeElements);
    //     }
    //     return undefined;
    // }, [props.data]);

    // useLayoutEffect(() => {
    //     if (scrollTo) {
    //         // Scroll to element with should be in view after rendering
    //         scrollTo.scrollIntoView();
    //         // Scroll by height of nav
    //         window.scrollBy(0, -85);
    //     }
    // }, [scrollTo, props.data]);

    if (props.networkStatus === 4) return <h1>Refetching</h1>
    if (props.loading) return <h1>Loading...</h1>;
    if (props.mutationLoading) return <h1 classname="empty-cart">Adding To Cart...</h1>
    if (props.error || props.mutationError) return <h1>Error! ${props.error}</h1>
    if (props.data.allMerch.length === 0) return <h1 className="empty-cart">Your Cart is Empty</h1>

    return (
        props.data.allMerch.map((merch, index) => (
            <div className="merch-product" key={index} data-key={merch.id} data-item="true">
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
