from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    
    # ForeignKey links this column to the 'id' column in the 'users' table.
    # ondelete="CASCADE" means if a user is deleted, their cart is deleted too.
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # ForeignKey links this column to the 'id' column in the 'products' table.
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    
    # How many items of this product the user wants to buy
    quantity = Column(Integer, default=1, nullable=False)

    # Relationships allow us to access the actual User and Product objects easily in code
    user = relationship("User", backref="cart_items")
    product = relationship("Product")