# crudNest

A RESTful API built with NestJS, MongoDB, and JWT authentication featuring user management and social login (Google/Apple).

# Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- MongoDB (Docker, local, or Atlas)
- Docker (optional, for MongoDB)

# Installation
#### 1.  Clone the repository
``` bash
git clone https://github.com/nwachee/crud-nest.git
cd crud-nest
```
### 2. Install dependencies
```bash 
yarn install
```

### 3. Set up environment variables
Create a ```.env``` file in the root directory:
``` env
# MongoDB Connection
MONGO_INITDB_ROOT_USERNAME=your-username
MONGO_INITDB_ROOT_PASSWORD=your-password
MONGO_INITDB_DATABASE=db-name
MONGODB_URI=mongodb://<username>:<password>@localhost:27017/db_name?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRATION=1d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth (Optional)
APPLE_CLIENT_ID=your-apple-service-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id

# Server
PORT=3000
```
### 4. Start MongoDB
***Option A: Using Docker***
```bash
docker compose up -d
```

***Option B: Using local MongoDB***
```bash
sudo systemctl start mongod
```

***Option C: Using MongoDB Atlas***

#### Update ```MONGODB_URI``` in ``` .env``` with your Atlas connection string.

# Usage

### Run the application
```bash
# Development mode (with hot reload)
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get current user profile | Yes |
| GET | `/auth/google` | Initiate Google OAuth | No |
| GET | `/auth/google/callback` | Google OAuth callback | No |
| POST | `/auth/apple` | Initiate Apple Sign In | No |
| POST | `/auth/apple/callback` | Apple Sign In callback | No |

### Users (Protected Routes)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| POST | `/users` | Create new user | Yes |
| PATCH | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/healthcheck` | Check API status | No |

---

## Authentication

This API uses JWT (JSON Web Tokens) for authentication.

### Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using the JWT token

Add the token to the `Authorization` header for protected routes:
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Usage Examples

### Create a user
```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "securepass123"
  }'
```

### Get all users
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get user by ID
```bash
curl -X GET http://localhost:3000/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update user
```bash
curl -X PATCH http://localhost:3000/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Updated"
  }'
```

### Delete user
```bash
curl -X DELETE http://localhost:3000/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Health check
```bash
curl http://localhost:3000/healthcheck
```

---

## Rate Limiting

This API implements rate limiting to prevent abuse:

- **Default limit**: 60 requests per minute per IP
- **Response when exceeded**: `429 Too Many Requests`
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## Request Logging

All HTTP requests are logged with the following information:

- HTTP method and endpoint
- Status code
- Response time
- IP address
- User agent

**Example log:**
```
[HTTP] GET /users 200 1234b - 45ms - ::1 - PostmanRuntime/7.28.0
```




