# Import Section
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

# Configuration
SECRET_KEY = "123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password Context Setup
pwd_context = CryptContext(schemes=["bcrypt"])

# Password Hashing Functions
def get_password_hash(password: str) -> str:
    """
    Generate a hashed version of the provided password.
    
    Args:
        password: Plain text password to hash
        
    Returns:
        str: Hashed password
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify if a plain password matches its hashed version.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to compare against
        
    Returns:
        bool: True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)

# Token Creation Function
def create_access_token(data: dict) -> str:
    """
    Create a JWT access token with expiration time.
    
    Args:
        data: Dictionary containing payload data to encode
        
    Returns:
        str: Encoded JWT token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt