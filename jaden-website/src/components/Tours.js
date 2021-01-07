import React from 'react'
import './Tours.css'
import { Button } from './Button'

function Tours() {

    const TOUR = [{
        date: "MAY 26",
        city: "SAN DIEGO, CA",
        link: "https://goo.gl/maps/jDKwrSR9XokpJpEr6",
        arena: "PECHANGA ARENA"
    }, {
        date: "JUN 19",
        city: "MINNEAPOLIS, MN",
        link: "https://g.page/TargetCenterMN?share",
        arena: "TARGET CENTER"
    }, {
        date: "JUN 28",
        city: "DETROIT, MN",
        link: "https://goo.gl/maps/9TE2az6pbm65J3jCA",
        arena: "LITTLE CAESARS ARENA"
    }, {
        date: "JUN 29",
        city: "COLOMBUS, OH",
        link: "https://goo.gl/maps/YSGcvvHXZJBYycZN7",
        arena: "THE SCHOTTENSTEIN CENTER"
    }]

    function buyTickets() {
        alert('Tickets purchased')
    }

    return (
        <div className="tour-background">
            <div className="tour-wrapper">
                <h1 className="tours-header">TOURS</h1>
                <div className="tours-section">
                    <div className="search">
                        <i className="fas fa-search" />
                        <input placeholder="Search..." className="search-field" >
                        </input>
                    </div>
                    <div className="scroll-box-tickets">
                        {TOUR.map((tour, index) => (
                            <div className="tour-item" key={index}>
                                <div className="tour-info">
                                    <strong className="tour-date">{tour.date}</strong>
                                    <span className="tour-city">{tour.city}</span>
                                    <a href={tour.link} target="_blank" rel="noreferrer" className="map-location">
                                        <i class="fas fa-map-marked-alt"></i>
                                    </a>
                                    <span className="tour-arena">{tour.arena}</span>  
                                </div>
                                <Button buttonStyle="btn--buy"      buttonSize="btn--medium" onClick={buyTickets}>BUY TICKETS</Button>
                            </div> 
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tours
