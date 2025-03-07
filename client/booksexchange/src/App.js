import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Page and Component Imports
import MainPage from "./pages/MainPage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Navbar from "./components/Navbar";
import AddBook from "./components/AddBook";
import BooksList from "./components/BooksList";

function App() {
  // State
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Effects
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedToken !== token) {
      setToken(storedToken);
    }
  }, [token]); // Added token as a dependency for proper synchronization

  // Handlers
  const handleTokenChange = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
  };

  // Render
  return (
    <Router>
      <Navbar token={token} setToken={handleTokenChange} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login setToken={handleTokenChange} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/books" element={<BooksList />} />
      </Routes>
    </Router>
  );
}

export default App;