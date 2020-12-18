import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import './Navbar.css'

function Navbar(color) {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if( window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    }

    useEffect(() => {
        showButton();
    }, ***REMOVED***);

    window.addEventListener('resize', showButton);

    return (
        <>
            <nav className="navbar" style={color}>
                <div className="navbar-container">
                    <Link to="/" className="navbar-jaden" onClick={closeMobileMenu}>JADEN</Link>
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? 'fas fa-times': 'fas fa-bars'} />
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className="nav-item">
                            <Link to='/tour' className='nav-links' onClick={closeMobileMenu}>
                                TOUR
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/merch' className='nav-links' onClick={closeMobileMenu}>
                                MERCH
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/story' className='nav-links' onClick={closeMobileMenu}>
                                STORY
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>
                                ACCOUNT
                            </Link>
                        </li>
                    </ul>
                    {button && <Button buttonStyle='btn--navigation' buttonSize='btn--medium' linkTo='/sign-up'>ACCOUNT</Button>}
                </div>
            </nav>
        
        </>
    )
}

export default Navbar
