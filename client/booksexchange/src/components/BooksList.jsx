import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/BooksList.css";

const BooksList = () => {
  // State
  const [books, setBooks] = useState([]);

  // Effects
  useEffect(() => {
    fetch("http://localhost:8000/books")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status code: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.error("Error fetching books: ", error);
      });
  }, []);

  // Render
  return (
    <div>
      <h2>Books Exchange Hub</h2>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id}>
            <img src={book.imageBase64} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksList;