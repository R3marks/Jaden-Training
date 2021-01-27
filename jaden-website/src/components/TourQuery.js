import React from 'react'
import './TourQuery.css'
import { ActionButton } from './ActionButton'

function TourQuery(props) {

    function buyTickets() {
        alert('Tickets purchased')
    }

    if (props.networkStatus === 4) return <h1>Refetching</h1>
    if (props.loading) return <h1>Loading...</h1>;
    if (props.error) return <h1>Error! ${props.error}</h1>
    if (props.data.searchTour.length === 0) return <h1>No Shows Available</h1>

    return (
        props.data.searchTour.map((tour, index) => (
            <div className="tour-item" key={index}>
                <div className="tour-info">
                    <strong className="tour-date">{tour.date}</strong>
                    <span className="tour-city">{tour.city}</span>
                    <a href={tour.link} target="_blank" rel="noreferrer" className="map-location">
                        <i className="fas fa-map-marked-alt"></i>
                    </a>
                    <span className="tour-arena">{tour.arena}</span>  
                </div>
                <ActionButton buttonStyle="btn--buy" buttonSize="btn--medium" onClick={buyTickets}>BUY TICKETS</ActionButton>
            </div> 
        ))
    )
}

export default TourQuery
