from fastapi import APIRouter, Depends
from typing import Dict, Any

from modules.users.auth import verify_token

router = APIRouter()

@router.post("/checkout")
async def process_checkout(
    order_data: dict,
    user_payload: dict = Depends(verify_token) 
):
    user_id = user_payload.get("sub")
    
    return {
        "status": "success",
        "message": f"Замовлення успішно створено! Твій Clerk ID: {user_id}",
        "items_received": len(order_data.get("items", []))
    }