import React from 'react'
import { Button } from './Button'
import './TourItem.css'

function TourItem(props) {
    return (
        <div className="tour-item">
            <div className="tour-info">
                <strong className="tour-date">MAY 26</strong>
                <span className="tour-city">SAN DIEGO, CA</span>
                <span className="tour-arena"> PECHANGA ARENA</span>  
            </div>
            <Button buttonStyle="btn--buy" buttonSize="btn--medium" >BUY TICKETS</Button>
        </div>
    )
}

export default TourItem
