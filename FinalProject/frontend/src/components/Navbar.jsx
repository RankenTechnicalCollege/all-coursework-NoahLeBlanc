import React from 'react';
import '../styles/Navbar.css'; // Optional: for styling

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                BugTracker
            </div>
            <ul className="navbar-links">
                <li>
                    Users
                </li>
                <li>
                    Bugs
                </li>
                <li>
                    Dashboard
                </li>
                <li>
                    About
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;