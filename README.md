# Secure Scalable API

**Secure Scalable API** is a backend project built with **Express.js** to demonstrate secure, scalable RESTful API design. It implements token-based authentication, rate limiting, and CRUD operations.

## Features

- **Authentication**: JWT-based with access and refresh tokens.
- **Rate Limiting**: Redis for rate limiting and throttling.
- **CRUD Operations**: Standard CRUD functionality on secure routes.
- **Data Storage**: MongoDB as the primary database.
- **Automated Testing**: Uses Supertest for API endpoint testing.

## Tech Stack

- **Node.js** and **Express.js**
- **Redis** for rate limiting -> used sliding window algorithm
- **MongoDB** for data persistence
- **JWT** for token-based authentication


## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Invalidate refresh token

### CRUD Routes (Protected)
- `GET /api/todo` - Fetch all todos
- `GET /api/todo/:id` - Fetch todo by ID
- `POST /api/todo` - Create a new todo
- `PUT /api/todo/:id` - Update todo by ID
- `DELETE /api/todo/:id` - Delete todo by ID


