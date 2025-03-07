from pymongo import MongoClient

connection_string = "mongodb://localhost:27017/"
client = MongoClient(connection_string)
db = client["BooksExchange"]
users_collection = db["users"]
books_collection = db["books"]