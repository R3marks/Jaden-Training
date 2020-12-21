import React from 'react'
import './Tours.css'
import TourItem from './TourItem'

function Tours() {
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
                        <TourItem />
                        <TourItem />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tours
