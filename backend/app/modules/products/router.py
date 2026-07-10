from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.modules.products.models import Category
from typing import List

from app.db.database import get_db
from app.modules.products.models import Product
from app.modules.products.schemas import ProductCreate, ProductResponse

router = APIRouter()

@router.get("/products", response_model=List[ProductResponse])
async def get_all_products(db: AsyncSession = Depends(get_db)):
    query = select(Product).options(selectinload(Product.category))
    
    result = await db.execute(query)
    products = result.scalars().all()
    return products

@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product_in: ProductCreate, db: AsyncSession = Depends(get_db)):
    """
    Creates a new hardware product in the system.
    """
    new_product = Product(**product_in.model_dump())
    db.add(new_product)
    try:
        await db.commit()
        await db.refresh(new_product)
        return new_product
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Database transaction failed"
        )

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Product).options(selectinload(Product.category)).where(Product.id == product_id)
    result = await db.execute(query)
    product = result.scalars().first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return product

@router.get("/categories")
async def get_all_categories(db: AsyncSession = Depends(get_db)):
    query = select(Category)
    result = await db.execute(query)
    categories = result.scalars().all()
    return categories