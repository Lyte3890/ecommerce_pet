import asyncio
import os
import sys
from sqlalchemy import text
from sqlalchemy.future import select
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession 

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'app')))
load_dotenv()

from app.db.database import engine
from modules.products import models

async def seed_data():
    print("Dropping existing tables with CASCADE...")
    async with engine.begin() as conn:
        await conn.execute(text("DROP TABLE IF EXISTS products CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS categories CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS cart_items CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS order_items CASCADE;"))
    
        print("Creating new tables...")
        await conn.run_sync(models.Base.metadata.create_all)
    
    async with AsyncSession(engine) as db:
        try:
            print("Seeding categories...")
            categories = [
                models.Category(name="Workstations & Laptops", slug="workstations-laptops"),
                models.Category(name="Processors", slug="processors"),
                models.Category(name="Graphics Cards", slug="graphics-cards"),
                models.Category(name="Memory", slug="memory"),
                models.Category(name="Storage", slug="storage")
            ]
            db.add_all(categories)
            await db.commit()

            cat_ws = (await db.execute(select(models.Category).filter_by(slug="workstations-laptops"))).scalars().first().id
            cat_cpu = (await db.execute(select(models.Category).filter_by(slug="processors"))).scalars().first().id
            cat_gpu = (await db.execute(select(models.Category).filter_by(slug="graphics-cards"))).scalars().first().id
            cat_ram = (await db.execute(select(models.Category).filter_by(slug="memory"))).scalars().first().id

            print("Seeding products...")
            products = [
                models.Product(
                    name="Dell Precision 3551 Mobile Workstation",
                    slug="dell-precision-3551",
                    description="High-performance engineering workstation perfectly optimized for dual-boot environments.",
                    price=1150.00,
                    stock=5,
                    category_id=cat_ws,
                    image_url="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80",
                    specifications={"CPU": "Intel Core i7-10750H", "RAM": "32GB DDR4", "Storage": "1TB NVMe"}
                ),
                models.Product(
                    name="NVIDIA GeForce RTX 4090 24GB",
                    slug="nvidia-rtx-4090",
                    description="The ultimate GPU for both intensive gaming and AI automation.",
                    price=1699.99,
                    stock=2,
                    category_id=cat_gpu,
                    image_url="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80",
                    specifications={"VRAM": "24GB GDDR6X", "TDP": "450W"}
                ),
                models.Product(
                    name="AMD Ryzen 9 7950X",
                    slug="amd-ryzen-9-7950x",
                    description="16-core behemoth for multi-threaded workloads.",
                    price=599.00,
                    stock=15,
                    category_id=cat_cpu,
                    image_url="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80",
                    specifications={"Cores": "16", "Socket": "AM5"}
                ),
                models.Product(
                    name="Corsair Vengeance 64GB (2x32GB) DDR5",
                    slug="corsair-vengeance-64gb",
                    description="Massive memory capacity for running multiple local LLMs and PostgreSQL databases.",
                    price=209.99,
                    stock=24,
                    category_id=cat_ram,
                    image_url="https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80",
                    specifications={"Capacity": "64GB", "Speed": "6000MHz"}
                )
            ]
            db.add_all(products)
            await db.commit()
            print("Database seeded successfully!")

        except Exception as e:
            print(f"Error: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(seed_data())