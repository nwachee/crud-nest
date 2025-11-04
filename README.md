# crudNest

A RESTful API built with NestJS, MongoDB, and JWT authentication featuring user management and social login (Google/Apple).

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- MongoDB (Docker, local, or Atlas)
- Docker (optional, for MongoDB)

## 🛠️ Installation
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



