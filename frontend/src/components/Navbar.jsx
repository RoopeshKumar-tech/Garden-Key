import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const userName = localStorage.getItem('userName');

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/services">Services</Link>
                </li>
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
            </ul>
            {userName && (
                <div className="welcome-message">
                    Hi, {userName}
                </div>
            )}
        </nav>
    );
};

export default Navbar;