from fastapi import APIRouter

router = APIRouter()

@router.get("/users")
async def get_users():
    """
    Returns a list of hardware products.
    """
    return []