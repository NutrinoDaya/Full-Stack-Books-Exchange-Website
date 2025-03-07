# Import Section
from fastapi import FastAPI, HTTPException, Form, Depends, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db.database import users_collection, books_collection
from db.auth import get_password_hash, create_access_token, verify_password
from bson import ObjectId
from typing import Optional
import uvicorn

# Configuration
origins = [
    "http://localhost:3000",
]

# FastAPI App Setup
app = FastAPI()

# Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class UserCredentials(BaseModel):
    username: str
    password: str 

class Book(BaseModel):
    title: str 
    major: str 
    description: str 
    imageBase64: Optional[str] = None

# Dependencies
def user_credentials_form(username: str = Form(...), password: str = Form(...)):
    return UserCredentials(username=username, password=password)

# Authentication Endpoints
@app.post("/signup")
async def signup(credentials: UserCredentials = Depends(user_credentials_form)):
    """Register a new user."""
    existing_user = users_collection.find_one({"username": credentials.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username Already Exists")
    
    hashed_password = get_password_hash(credentials.password)
    user = {
        "username": credentials.username,
        "hashed_password": hashed_password
    }
    users_collection.insert_one(user)
    return {"message": "User Created Successfully"}

@app.post("/login")
async def login(credentials: UserCredentials = Depends(user_credentials_form)):
    """Authenticate a user and return an access token."""
    user = users_collection.find_one({"username": credentials.username})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user["username"], "id": str(user["_id"])})
    return {"access_token": access_token}

# Book Endpoints
@app.post("/books/add-book")
async def add_book(request_data: dict = Body(...)):
    """Add a new book to the collection."""
    user_id = request_data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user id is required")
    
    book_data = {key: value for key, value in request_data.items() if key != "user_id"}
    try:
        book = Book(**book_data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Book Data")
    
    book_dict = book.dict()
    book_dict["owner"] = user_id
    result = books_collection.insert_one(book_dict)
    return {"id": str(result.inserted_id), "message": "Book Added Successfully"}

@app.get("/books")
async def list_books():
    """Retrieve all books from the collection."""
    books = list(books_collection.find())
    return [{
        "id": str(book["_id"]),
        "title": book["title"],
        "major": book["major"],
        "description": book["description"],
        "imageBase64": book["imageBase64"]
    } for book in books]

@app.get("/books/{book_id}")
async def get_book(book_id: str):
    """Retrieve a specific book by ID."""
    book = books_collection.find_one({"_id": ObjectId(book_id)})
    if not book:
        raise HTTPException(status_code=400, detail="Book Doesn't Exist")
    
    return {
        "id": str(book["_id"]),
        "title": book["title"],
        "major": book["major"],
        "description": book["description"],
        "image_base64": book["imageBase64"]
    }

# Main Execution
if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=8000)