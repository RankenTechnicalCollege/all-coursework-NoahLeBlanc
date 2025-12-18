import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = true; // Replace with actual auth state
  const userRole = 'admin'; // Replace with actual user role

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <NavLink to="/" className="text-xl font-bold">Issue Tracker</NavLink>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-col md:flex-row gap-4">
              {!isLoggedIn ? (
                <>
                  <NavLink className="hover:underline" to="/login">Login</NavLink>
                  <NavLink className="hover:underline" to="/register">Register</NavLink>
                </>
              ) : (
                <>
                  <NavLink className="hover:underline" to="/bug/list">Bugs</NavLink>
                  {(userRole === 'admin' || userRole === 'manager') && (
                    <NavLink className="hover:underline" to="/user/list">Users</NavLink>
                  )}
                  <button className="hover:underline">Sign Out</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}