import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

# Import routers from your modular architecture
from app.modules.products.router import router as product_router
from app.modules.users.router import router as user_router
from app.modules.cart.router import router as cart_router
from app.modules.orders.router import router as order_router

load_dotenv(override=True)

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[os.getenv("GLOBAL_RATE_LIMIT", "100/minute")]
)

app = FastAPI(
    title="Hardware E-Commerce API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url=None
origins = [
    "http://localhost:5173", 
    "https://store.skuriatin.com", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from app.db.database import engine, Base

@app.on_event("startup")
async def init_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("\n=== TABLES CREATED SUCCESSFULY ===\n")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
ALLOWED_ORIGINS = [origin.strip() for origin in allowed_origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ==========================================
# SYSTEM ENDPOINTS & ROUTERS
# ==========================================

@app.get("/api/v1/health")
@limiter.limit("5/minute")
async def system_health(request: Request):
    """
    Checks API health. Limited to 5 requests per minute per IP to prevent ping floods.
    """
    return {"status": "operational", "security_layer": "active"}

# Registering your modular architecture
app.include_router(product_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")
app.include_router(cart_router, prefix="/api/v1")
app.include_router(order_router, prefix="/api/v1")