# Crypto Marketplace API

A learning project that simulates a crypto-based payment flow using Node.js, TypeScript, PostgreSQL, Prisma, and BullMQ.
The goal of this project is to model how a backend system verifies external payment events and safely updates order state.

This project demonstrates how a backend service should treat payment as _evidence_, not as a direct user action.

---

## Main Concept

In a real crypto payment, users do not "pay through the API".
They send funds to a blockchain address.
The backend system then observes the transaction and verifies whether the payment is valid.

This project recreates that behavior using a simulated blockchain.

The system:

1. Creates an order and generates a unique payment address
2. A fake blockchain transaction is created (simulating a transfer)
3. The backend verifies the transaction using the transaction hash
4. The order status changes only after verification

The database is updated based on verified external events rather than user requests.

---

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- BullMQ (background jobs)
- Redis (queue backend)
- Zod (validation)

---

## Order State Machine

Orders follow a strict state transition:

WAITING_PAYMENT → PAID
WAITING_PAYMENT → EXPIRED

Important:
An order **never becomes PAID because a user requested it**.
It becomes PAID only after a valid transaction is verified.

---

## Idempotency

Order creation requires an `Idempotency-Key` header.

This prevents duplicate orders if a client retries the same request due to network failure.

If the same key is sent again:

- The server will return the existing order
- No new order will be created

---

## Fake Blockchain Simulation

The project includes a developer-only endpoint that simulates a blockchain transfer.

It creates a transaction record containing:

- transaction hash
- destination address
- transfer amount

This acts as an external event that the backend can verify.

---

## Payment Verification

The `/payments/confirm` endpoint validates:

1. The transaction exists
2. The transaction is confirmed
3. The destination address matches the order payment address
4. The transferred amount is sufficient
5. The transaction has not been used by another order

Only after all checks pass:

- Order status becomes `PAID`
- `blockchainTx` is stored as proof

---

## Background Job (Expiration)

When an order is created:

- A delayed job is scheduled (15 minutes)

If no valid payment is confirmed before the deadline:

- The order automatically becomes `EXPIRED`

This simulates payment timeout behavior in real payment systems.

---

## API Flow Example

### 1. Create Order

`POST /orders`

Returns:

- order id
- paymentAddress
- expiration time

---

### 2. Simulate Payment

`POST /dev/fake-chain/send`

Creates a fake blockchain transaction and returns a `txHash`.

---

### 3. Confirm Payment

`POST /payments/confirm`

Provide:

- orderId
- txHash

If valid, the order becomes `PAID`.

---

### 4. Check Order

`GET /orders/:id`

Returns the current order status.

---

## Why This Project Exists

Most applications directly update payment status based on API requests.

Real payment systems cannot do that.

They must:

- verify external evidence
- handle retries
- prevent duplicate processing
- deal with asynchronous events
- handle expiration

This project focuses on modeling those backend behaviors in a simplified environment.

---

## Running the Project

### 1. Install dependencies

```
npm install
```

### 2. Start PostgreSQL and Redis (Docker recommended)

```
docker-compose up -d
```

### 3. Run database migrations

```
npm run prisma:migrate
```

### 4. Generate Prisma client

```
npm run prisma:generate
```

### 5. Start the server

```
npm start
```

---

## Additional Notes

- The blockchain is simulated
- No real cryptocurrency is used
- The project is intended for backend architecture learning
- It demonstrates event-driven thinking in payment systems
- Will be adding the unit test or Swagger OpenAPI in the future
