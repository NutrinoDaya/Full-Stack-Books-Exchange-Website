import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/AddBook.css";

const AddBook = () => {
  // Hooks
  const navigate = useNavigate();

  // State
  const [title, setTitle] = useState("");
  const [major, setMajor] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  // Token Decoding
  const token = localStorage.getItem("token");
  let user_id;
  try {
    const decoded_token = jwtDecode(token);
    user_id = decoded_token.id;
    console.log("Token: ", token);
    console.log("Decoded token: ", decoded_token);
  } catch (error) {
    console.error("Invalid token: ", error);
  }

  // Event Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/books/add-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          major,
          description,
          imageBase64,
          user_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add the book");
      }

      const data = await response.json();
      console.log("Book Added: ", data);
      navigate("/books");
    } catch (error) {
      console.error("Error occurred: ", error);
    }
  };

  // Render
  return (
    <div>
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text" // Changed from 'major' to 'text' (no 'major' input type exists)
          placeholder="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        />
        <input
          type="text" // Changed from 'description' to 'text' (consider textarea for longer input)
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          required
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;