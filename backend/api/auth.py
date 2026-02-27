from fastapi import APIRouter, HTTPException, Depends, status, Request
from pydantic import BaseModel, Field
from typing import Optional, Any, Union
import random
import time
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

# Security Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "agrosmart_super_secret_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Admin secret removed - System locked to Farmer role

class SignupRequest(BaseModel):
    role: str = "farmer"
    fullName: str
    phone: str
    password: str
    state: str
    district: str
    mandal: str
    landSize: Union[float, str]
    primaryCrop: str

    class Config:
        extra = "ignore"

class LoginRequest(BaseModel):
    loginIdOrPhone: str
    password: str
    role: str = "farmer"

class OTPVerifyRequest(BaseModel):
    loginIdOrPhone: str
    otp: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/signup")
async def signup(req: SignupRequest):
    # Validation for Farmer role
    ls = req.landSize
    if isinstance(ls, str) and ls.strip():
        try: ls = float(ls)
        except: raise HTTPException(status_code=400, detail="Invalid Land Size")
    
    if ls is None or not req.primaryCrop or not req.mandal:
        raise HTTPException(status_code=400, detail="Registration requires Land Size, Primary Crop, and Mandal")
            
    # Mock Farmer ID generation
    generated_id = f"FRM{random.randint(10001, 15000)}"

    # Hash password (would be stored in DB)
    hashed_pw = pwd_context.hash(req.password)
    
    return {
        "status": "success",
        "message": "Farmer registered successfully",
        "temp_id": generated_id,
        "role": "farmer"
    }

@router.post("/login/initiate")
async def login_initiate(req: LoginRequest):
    # For demo, allow anything
    otp = str(random.randint(100000, 999999))
    return {
        "status": "success",
        "message": "Credentials valid. OTP generated.",
        "otp_preview": otp 
    }

@router.post("/login/verify")
async def login_verify(req: OTPVerifyRequest):
    # Hardcoded to farmer role for stripped-down version
    role = "farmer"

    access_token = create_access_token(
        data={"sub": req.loginIdOrPhone, "role": role}
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "role": role,
            "id": req.loginIdOrPhone,
            "name": "Agro Farmer"
        }
    }
