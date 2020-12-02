import React from 'react';
import CardItem from './CardItem';
import './Cards.css'

function Cards() {
    return (
        <div className="cards">
            <h1>Check out these pics</h1>
            <div className="cards__container">
                <ul className="cards_items">
                    <CardItem src='Images - Jaden/syre.jpg' text="Explore this yo" label="Music" path="/merch" />
                    {/* <img src='Images - Jaden/syre.jpg' alt="mean"></img> */}
                </ul>
            </div>
        </div>
    );
}

export default Cards;
