import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className="footer-container">
            <section className="social-media">
                <div className="social-media-wrap">
                    <div className="footer-logo">
                        <Link to="/" className="social-logo">JADEN</Link>
                    </div>
                    <div className="social-icons">
                        <a className="social-icon-link facebook" href="https://www.facebook.com/officialjaden/" target="_blank" rel="noreferrer" aria-label="Facebook">
                            <i className="fab fa-facebook-f" />
                        </a>
                        <a className="social-icon-link instagram" href="https://www.instagram.com/c.syresmith/" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <i className="fab fa-instagram" />
                        </a>
                        <a className="social-icon-link twitter" href="https://twitter.com/jaden" target="_blank" rel="noreferrer" aria-label="Twitter">
                            <i className="fab fa-twitter" />
                        </a>
                        <a className="social-icon-link youtube" href="https://www.youtube.com/channel/UC-w7D3GsJecTHA8Sjcyn6sQ" target="_blank" rel="noreferrer" aria-label="YouTube">
                            <i className="fab fa-youtube" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Footer
