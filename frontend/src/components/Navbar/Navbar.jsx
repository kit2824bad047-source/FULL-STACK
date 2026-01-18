import React from 'react';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Navbar() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">Campus Placement System</Link>
        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          {!token && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
          {token && (
            <>
              <li>
                <Link to={user?.userType === 'recruiter' ? '/recruiter-dashboard' : '/student-dashboard'}>
                  Dashboard
                </Link>
              </li>
              <li className="navbar-user">{user?.name || 'User'}</li>
              <li><button onClick={handleLogout} className="navbar-logout">Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
