import React from 'react';
import '../App.css';
import { LinkedButton } from './LinkedButton';
import './HeroSection.css';

function HeroSection() {
    return (
        <div className='hero-container'>
            <h1>ADVENTURE WAITS</h1>
            <p>What are you waiting for?</p>
            <div className="hero-btns">
                <LinkedButton className='btns' buttonStyle='btn--outline' buttonSize='btn-large'>GET STARTED</LinkedButton>
                <LinkedButton className='btns' buttonStyle='btn--primary' buttonSize='btn-large'>WATCH TRAILER 
                <i className='far fa-play-circle' /></LinkedButton>
            </div>
        </div>
    )
}

export default HeroSection
