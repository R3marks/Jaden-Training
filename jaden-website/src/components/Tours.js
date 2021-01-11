import React from 'react'
import './Tours.css'
import { Button } from './Button'
import { useQuery } from '@apollo/client'
import { TOURS } from '../graphql/Queries'

function Tours() {

    const { loading, error, data } = useQuery(TOURS)
    console.log(data)

    function buyTickets() {
        alert('Tickets purchased')
    }

    if (loading) return 'Loading...';
    if (error) return `Error! ${error}`;

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
                        {data.tours.map((tour, index) => (
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
