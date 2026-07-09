import random
import asyncio
import uuid
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Fake Bank Payment Gateway")

class PaymentRequest(BaseModel):
    card_number: str
    cvv: str
    expiry: str
    amount: float

class PaymentResponse(BaseModel):
    transaction_id: str
    status: str
    message: str

@app.post("/process", response_model=PaymentResponse)
async def process_payment(request: PaymentRequest):
    """
    Simulating bank transaction.
    """
    await asyncio.sleep(random.uniform(1.0, 2.5))
    
    if len(request.card_number.replace(" ", "")) < 16:
        raise HTTPException(status_code=400, detail="Invalid card number format")

    is_successful = random.random() < 0.8
    
    transaction_id = f"txn_{uuid.uuid4().hex[:16]}"
    
    if is_successful:
        return PaymentResponse(
            transaction_id=transaction_id,
            status="approved",
            message="Payment processed successfully"
        )
    else:
        raise HTTPException(
            status_code=400, 
            detail={"status": "declined", "transaction_id": transaction_id, "message": "Insufficient funds or bank decline"}
        )