import React, { useEffect } from 'react'
import './Tours.css'
import { Button } from './Button'
import { useQuery } from '@apollo/client'
import { SEARCH_TOURS } from '../graphql/Queries'

function Tours() {
    const { loading, error, data, refetch, networkStatus } = useQuery(SEARCH_TOURS, {
        variables: { searchTerm: "" }
    })
    console.log(data)

    function handleChange(event) {
        refetch({ searchTerm: event.target.value })
    }

    function buyTickets() {
        alert('Tickets purchased')
    }

    if (networkStatus === 4) return <h1>Refetching</h1>
    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>Error! ${error}</h1>;

    return (
        <div className="tour-background">
            <div className="tour-wrapper">
                <h1 className="tours-header">TOURS</h1>
                <div className="tours-section">
                    <div className="search">
                        <i className="fas fa-search" />
                        <input placeholder="Search..." className="search-field" onChange={handleChange}>
                        </input>
                    </div>
                    <div className="scroll-box-tickets">
                        {data.searchTour.map((tour, index) => (
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
