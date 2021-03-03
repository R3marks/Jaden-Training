import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'
import { AuthContext } from '../api/AuthProvider'

function Navbar(color) {

    const { isAuthenticated } = useContext(AuthContext)
    const authenticated = isAuthenticated()

    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

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
                            <Link data-testid='Account' to={authenticated ? '/profile' : '/sign-in'} className='nav-links-mobile' onClick={closeMobileMenu}>
                                {authenticated ? 'ACCOUNT' : 'SIGN IN'}
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar
