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
                        <TourItem date="MAY 26" city="SAN DIEGO, CA" arena="PECHANGA ARENA" link="https://pechangaarenasd.com/" />
                        <TourItem date="JUN 19" city="MINNEAPOLIS, MN" arena="TARGET CENTER" link="https://www.targetcenter.com/" />
                        <TourItem date="JUN 28" city="DETROIT, MN" arena="LITTLE CAESARS ARENA" link="https://www.313presents.com/" />
                        <TourItem date="JUN 29" city="COLOMBUS, OH" arena="THE SCHOTTENSTEIN CENTER" link="https://www.schottensteincenter.com/" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tours
