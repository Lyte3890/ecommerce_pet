from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.orm import Session

from app.db.database import get_db
from modules.users import models
from app.core.security import SECRET_KEY, ALGORITHM

# This tells FastAPI where the client should send the email/password to get a token.
# It automatically adds the "Authorize" button to Swagger UI!
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/users/login/")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Dependency that extracts the JWT from the request header, decodes it, 
    and returns the corresponding User object from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # 1. Decode the token using our secret key
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # 2. Extract the user's email (which we saved as 'sub')
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
            
    except jwt.InvalidTokenError:
        # If the token is expired or tampered with, reject the request
        raise credentials_exception
        
    # 3. Find the user in the database
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
        
    return user