from fastapi import APIRouter, HTTPException
from .jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

# Hardcoded user for now — replace with DB later
VALID_USER = "admin"
VALID_PASS = "admin123"

@router.post("/login")
def login(username: str, password: str):
    if username != VALID_USER or password != VALID_PASS:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": username})
    return {"access_token": token, "token_type": "bearer"}