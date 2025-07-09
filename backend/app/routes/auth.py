from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user import Token
from app.core.auth import verify_password, create_access_token
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter()
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["edge_ai_platform"]

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db["users"].find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer"}

