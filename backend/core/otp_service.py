import random
import time
from typing import Dict

# Volatile storage for OTPs (In-memory for hackathon demo, use Redis/DB for production)
otp_store: Dict[str, Dict] = {}

class OTPService:
    @staticmethod
    def generate_otp(id_or_phone: str) -> str:
        otp = str(random.randint(100000, 999999))
        expiry = time.time() + 30  # 30 seconds
        otp_store[id_or_phone] = {"otp": otp, "expiry": expiry}
        return otp

    @staticmethod
    def verify_otp(id_or_phone: str, otp: str) -> bool:
        if id_or_phone not in otp_store:
            return False
        
        data = otp_store[id_or_phone]
        if time.time() > data["expiry"]:
            del otp_store[id_or_phone]
            return False
            
        if data["otp"] == otp:
            del otp_store[id_or_phone]
            return True
            
        return False
