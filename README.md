# 🚗 Car Bidding System (WebSocket + Kafka + Redis)

This is a real-time car bidding system built using **NestJS**, **Kafka**, **Redis**, and **WebSocket**. It allows users to join auctions, place bids, and receive real-time updates on the highest bid.

---

## 📦 Tech Stack

- **Backend:** NestJS, WebSocket, Kafka, Redis
- **Frontend:** HTML + Vanilla JS (WebSocket Client)
- **Broker:** Apache Kafka
- **Cache/Store:** Redis
- **Database:** MongoDB
- **Docs:** Swagger UI

---

## ▶️ Run the Project with Docker

### 🔧 Step 1: Build and Start

```bash
docker-compose up --build
```

This will:

- Build all services defined in `docker-compose.yml`
- Start NestJS API, Kafka, Redis, and MongoDB
- Run the backend and make it available at `http://localhost:3000`

> Make sure Docker is installed and running.

---

## 📘 API Documentation

After the server starts, access the full Swagger-based API documentation at:

🌐 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

Use Swagger to:

- Register users
- Login and get tokens
- Create auctions
- View active auctions
- Place bids (via HTTP)
- Test secured endpoints with JWT token

---

## 🧪 API Testing via Swagger/Postman

You can create users and auctions using either:

- Swagger UI (`/api-docs`)
- Your own Postman setup using the same endpoints

Endpoints to try:

- `POST /user/register`
- `POST /user/login`
- `POST /auction`
- `GET /auction`

---

## 🌐 Frontend WebSocket Client

We have a simple HTML-based test UI to simulate bidding and view real-time updates.

### 🚀 To launch:

1. Open a terminal
2. Run:

```bash
npx live-server assets/
```

> Make sure `live-server` is installed globally:
> 
> ```bash
> npm install -g live-server
> ```

Then open: [http://localhost:8080](http://localhost:8080)

### 🧩 Features:
- Select user and auction
- Connect to WebSocket
- Place a bid
- See bid status (accepted/rejected/queued)
- Real-time updates for highest bid
- View event logs in the browser

---

## 🛠️ Key WebSocket Events

| Event Name       | Direction     | Description                         |
|------------------|---------------|-------------------------------------|
| `user_joined`    | Client → BE   | Join auction room                   |
| `bid_accepted`   | BE → Client   | Bid accepted                        |
| `bid_rejected`   | BE → Client   | Bid too low or invalid              |
| `bid_queued`     | BE → Client   | Bid enqueued for Kafka processing   |
| `auction_end`    | BE → Client   | Auction has ended                   |
| `user_left`      | BE → Client   | User left the room                  |

---

## 🧽 Cleanup

To stop and remove containers:

```bash
docker-compose down
```

To remove volumes/data:

```bash
docker-compose down -v
```

---

## 💬 Contact

For questions or improvements, feel free to open an issue or contribute!