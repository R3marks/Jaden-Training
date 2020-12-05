import React from 'react';
import CardItem from './CardItem';
import './Cards.css'

function Cards() {
    return (
        <div className="cards">
            <h1>Check out these pics</h1>
            <div className="cards__container">
                <ul className="cards_items">
                    <CardItem src='Images - Jaden/syre.jpg' text="Explore this yo" label='Adventure' path="/merch" />
                    <CardItem src='Images - Jaden/erys.jpg' text="ERYS" label='Dark' path="/tour" />
                </ul>
            </div>
        </div>
    );
}

export default Cards;
