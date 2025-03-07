import React from 'react'
import {jwtDecode } from 'jwt-decode';

import "../styles/MainPage.css"
import { useNavigate } from 'react-router-dom';

const MainPage = () => {

    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    let username = "Guest"  

    const handleGoAddBook = () => {
        navigate("add-book")
    }

    if(token){
        try {
            const decode = jwtDecode(token);
            username = decode.sub
        }catch(error){
            console.log("Invalid Token : ", error)
        }
    }

    // Update return statement
    return (
        <div className="main-container">
            <h1>Hello, <span>{username}</span></h1>
            <button onClick={handleGoAddBook} >Add Book</button>
        </div>
    )
}

export default MainPage;
