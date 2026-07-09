from pydantic import BaseModel
from datetime import datetime
from pydantic import BaseModel
from datetime import datetime

class CheckoutRequest(BaseModel):
    card_number: str
    cvv: str
    expiry: str

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_per_item: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: str
    total_amount: float
    created_at: datetime
    items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True