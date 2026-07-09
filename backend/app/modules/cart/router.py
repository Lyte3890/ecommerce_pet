from fastapi import APIRouter

router = APIRouter()

@router.get("/cart")
async def get_cart():
    """
    Returns a list of hardware products.
    """
    return []