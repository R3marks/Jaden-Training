import React from 'react'
import { Button } from './Button'
import './TourItem.css'

function TourItem(props) {
    return (
        <div className="tour-item">
            <div className="tour-info">
                <strong className="tour-date">{props.date}</strong>
                <span className="tour-city">{props.city}</span>
                <a href={props.link} target="_blank" rel="noreferrer" className="map-location">
                    <i class="fas fa-map-marked-alt"></i>
                </a>
                <span className="tour-arena">{props.arena}</span>  
            </div>
            <Button buttonStyle="btn--buy" buttonSize="btn--medium">BUY TICKETS</Button>
        </div>
    )
}

export default TourItem
