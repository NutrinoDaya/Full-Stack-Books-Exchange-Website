import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ token, setToken }) => {
  // Event Handlers
  const handleLogout = () => {
    setToken(null);
  };

  // Render
  return (
    <nav>
      <ul className="navbar-list">
        <li>
          <Link to="/">Home</Link>
        </li>

        {!token ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">SignUp</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </li>
            <li>
              <Link to="/books">Books</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;