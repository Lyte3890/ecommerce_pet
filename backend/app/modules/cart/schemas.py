from pydantic import BaseModel, Field

class CartItemAdd(BaseModel):
    product_id: int
    # Ensure user can't add 0 or negative items
    quantity: int = Field(default=1, gt=0) 

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int

    class Config:
        from_attributes = True