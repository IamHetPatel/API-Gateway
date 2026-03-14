# 🚀 API Gateway — Microservices Architecture

A production-style **API Gateway** built with **Node.js** that acts as the single entry point for a microservices-based backend system. It handles rate limiting, response caching, JWT authentication, and structured logging — routing traffic intelligently to three independent downstream microservices, each backed by its own isolated MongoDB instance.

---

## 📐 Architecture Overview

```
Client
  │
  ▼
┌──────────────────────────────────────────────┐
│               API Gateway (Port 3000)        │
│                                              │
│  ┌──────────┐  ┌────────┐  ┌─────────────┐  │
│  │ Rate     │  │ Redis  │  │ JWT Auth    │  │
│  │ Limiter  │  │ Cache  │  │ Middleware  │  │
│  └──────────┘  └────────┘  └─────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │       Morgan HTTP Logger               │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │       Request Router (routes.js)       │  │
│  └──────────┬──────────┬──────────────────┘  │
└─────────────┼──────────┼──────────────────────┘
              │          │          │
    ┌─────────┘  ┌───────┘  ┌──────┘
    ▼            ▼          ▼
User Service  Product    Order
(Port 4000)   Service    Service
(MongoDB)     (Port 5001)(Port 6000)
              (MongoDB)  (MongoDB)
                    │
              Prometheus (Port 9090)
              Grafana    (Port 3001)
```

All services communicate over a shared Docker bridge network (`mynetwork`) and are orchestrated via **Docker Compose**.

---

## ✨ Features

| Feature | Details |
|---|---|
| **API Gateway** | Single entry point routing to all microservices |
| **Rate Limiting** | Redis-backed, 1000 requests/60 seconds per IP |
| **Response Caching** | Redis cache with 60-second TTL on all `GET` requests |
| **JWT Authentication** | Token-based auth middleware (pluggable) |
| **Structured Logging** | HTTP access logs via Morgan written to `access.log` |
| **API Documentation** | Swagger UI served at `/docs` |
| **Containerised** | All services Dockerized, orchestrated with Docker Compose |
| **Monitoring** | Prometheus metrics scraping + Grafana dashboards |
| **Input Validation** | `express-validator` on sensitive endpoints |

---

## 🗂️ Project Structure

```
api-gateway/
├── gateway/                       # API Gateway service
│   ├── server.js                  # Express app bootstrap & middleware registration
│   ├── routes.js                  # Request forwarding logic to microservices
│   ├── auth.js                    # JWT authentication middleware
│   ├── rateLimiter.js             # Redis-backed rate limiting middleware
│   ├── cache.js                   # Redis response caching middleware
│   ├── logging.js                 # Morgan HTTP access logger
│   ├── swagger.js                 # Swagger/OpenAPI documentation setup
│   ├── Dockerfile                 # Gateway container definition
│   └── package.json
│
├── microservices/
│   ├── user-service/              # User management microservice (Port 4000)
│   │   ├── server.js              # Register, Login, Profile endpoints
│   │   ├── Dockerfile
│   │   ├── .env                   # AUTH_KEY secret
│   │   └── package.json
│   │
│   ├── product-service/           # Product catalog microservice (Port 5001)
│   │   ├── server.js              # Create, List, Update Stock endpoints
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── order-service/             # Order management microservice (Port 6000)
│       ├── server.js              # Create Order, Get Orders by User endpoints
│       ├── Dockerfile
│       └── package.json
│
├── monitoring/
│   ├── prometheus.yml             # Prometheus scrape config (15s interval)
│   └── grafana/                   # Grafana dashboard config
│
└── deployment/
    └── docker-compose.yml         # Full stack orchestration
```

---

## 🔧 Technology Stack

### Core
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18 | Runtime for all services |
| **Express.js** | ^4.21.0 | HTTP server framework |

### API Gateway
| Package | Purpose |
|---|---|
| `ioredis` | Redis client for rate limiting & caching |
| `rate-limiter-flexible` | Redis-backed rate limiting strategy |
| `jsonwebtoken` | JWT generation & verification |
| `morgan` | HTTP request logger |
| `node-fetch` | Internal HTTP forwarding to microservices |
| `swagger-jsdoc` + `swagger-ui-express` | OpenAPI 2.0 documentation |

### Microservices
| Package | Purpose |
|---|---|
| `mongoose` | MongoDB ODM for all three services |
| `bcryptjs` | Password hashing (User Service) |
| `express-validator` | Input validation (User & Product services) |
| `dotenv` | Environment variable management |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Containerisation of each service |
| **Docker Compose** | Multi-container orchestration |
| **Redis** | Rate limiting store + response cache |
| **MongoDB** | Document database (3 isolated instances) |
| **Prometheus** | Metrics collection (scrapes gateway every 15s) |
| **Grafana** | Metrics visualisation dashboard |

---

## 🌐 API Endpoints

All client requests hit the **API Gateway at port 3000**, which proxies them to the appropriate microservice.

### 👤 User Service (`/api/users/*` → `user-service:4000`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/users/register` | Register a new user | ❌ |
| `POST` | `/api/users/login` | Login and receive JWT token | ❌ |
| `GET` | `/api/users/me` | Get authenticated user profile | ✅ |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
**Login Response:**
```json
{
  "token": "<JWT>"
}
```

---

### 📦 Product Service (`/api/products/*` → `product-service:5001`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/products` | Create a new product | ❌ |
| `GET` | `/api/products` | List all products | ❌ |
| `PUT` | `/api/products/:id/stock` | Update product stock level | ❌ |

**Create Product Request Body:**
```json
{
  "name": "Widget",
  "price": 9.99,
  "stock": 100
}
```

---

### 🛒 Order Service (`/api/orders/*` → `order-service:6000`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/orders` | Create a new order (auto-calculates total) | ❌ |
| `GET` | `/api/orders/user/:userId` | Get all orders for a specific user | ❌ |

**Create Order Request Body:**
```json
{
  "userId": "<user_id>",
  "products": [
    { "productId": "<product_id>", "quantity": 2 }
  ]
}
```

> **Note:** The Order Service fetches real-time product prices from the Product Service internally to compute `totalAmount`.

---

## ⚙️ Gateway Middleware Pipeline

Requests entering the gateway pass through the following middleware stack **in order**:

```
Incoming Request
      │
      ▼
1. Morgan Logger         → Appends to access.log
      │
      ▼
2. Rate Limiter          → 1000 req/min per IP via Redis
      │                    Returns 429 if exceeded
      ▼
3. Redis Cache           → Checks Redis for cached response (GET)
      │                    Returns cached JSON if hit (200)
      ▼
4. Router (routes.js)   → Forwards request to correct microservice
      │                    via node-fetch (method + headers preserved)
      ▼
Microservice Response   → Cached in Redis (TTL: 60s), returned to client
```

> **JWT Auth middleware** is implemented in `auth.js` and can be enabled by uncommenting the `app.use('/api/*', auth)` line in `server.js`.

---

## 📊 Monitoring

### Prometheus
- Scrapes the API Gateway at `gateway:3000` every **15 seconds**
- Accessible at [http://localhost:9090](http://localhost:9090)

### Grafana
- Pre-configured container based on Prometheus data source
- Build custom dashboards to visualise request rates, latency, and error rates

---

## 🚀 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose installed

### Running the Full Stack

```bash
# Clone the repository
git clone <repo-url>
cd api-gateway

# Start all services
cd deployment
docker-compose up --build
```

### Service URLs

| Service | URL |
|---|---|
| API Gateway | http://localhost:3000 |
| Swagger Docs | http://localhost:3000/docs |
| User Service | http://localhost:4000 |
| Product Service | http://localhost:5001 |
| Order Service | http://localhost:6000 |
| Prometheus | http://localhost:9090 |
| MongoDB (User) | localhost:27017 |
| MongoDB (Product) | localhost:27018 |
| MongoDB (Order) | localhost:27019 |
| Redis | localhost:6379 |

---

## 🔐 Environment Variables

### User Service (`.env`)
```env
AUTH_KEY=your_jwt_secret_key
PORT=4000
```

---

## 📋 Data Models

### User
```js
{
  name: String,
  email: String (unique),
  password: String (bcrypt hashed)
}
```

### Product
```js
{
  name: String,
  price: Number,
  stock: Number
}
```

### Order
```js
{
  userId: String,
  products: [{ productId: String, quantity: Number }],
  totalAmount: Number,
  status: String (default: "Pending")
}
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
