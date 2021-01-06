import React from 'react'
import { Button } from './Button'
import './TourItem.css'

function TourItem(props) {

    function buyTickets() {
        alert('Tickets purchased')
    }

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
            <Button buttonStyle="btn--buy" buttonSize="btn--medium" onClick={buyTickets}>BUY TICKETS</Button>
        </div>
    )
}

export default TourItem
