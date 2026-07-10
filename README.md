# MS Hardware Store

Enterprise-grade B2B e-commerce platform for high-performance computer hardware and engineering components. This repository contains both the FastAPI microservice backend and the React-based storefront.

## System Architecture

The project utilizes a decoupled microservices architecture designed for determinism, high availability, and easy horizontal scaling.

* **Frontend:** React, Vite, TailwindCSS.
* **Backend:** Python, FastAPI, SQLAlchemy (Async).
* **Database:** PostgreSQL 15.
* **Caching/Session:** Redis 7.
* **Authentication:** Clerk (JWT-based public key verification).
* **Infrastructure:** Docker Compose (Local), Railway (Production).

## Repository Structure

```
ecommerce-sim/
├── backend/            # FastAPI REST API microservice
│   ├── app/            # Application core and domain modules
│   ├── requirements.txt
│   └── Dockerfile      # Backend container definition
├── frontend/           # React SPA
│   ├── src/            # Components, pages, and API hooks
│   ├── package.json
│   └── vite.config.js
├── nginx/              # Reverse proxy config (Local/IaaS deployment only)
└── docker-compose.yml  # Local cluster orchestration
```
## Local Development (Docker Cluster)

To spin up the entire application in an isolated local environment with automatic code reloading:

1. Clone the repository.
2. Create environment files:
   * `backend/.env` (Requires database credentials, Clerk keys, and JWT secrets).
   * `frontend/.env` (Requires `VITE_API_URL=http://localhost`).

3. Execute the compose build:

```bash
docker-compose up -d --build
```

The system will expose the following endpoints:

* **Storefront UI:** `http://localhost`
* **API Endpoints:** `http://localhost/api/v1/...`
* **Swagger Documentation:** `http://localhost:8000/api/docs`

## Deploy whenever you like:)
