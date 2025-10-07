# Polling System

A NestJS-based web application for creating and managing polls with user authentication and voting capabilities.

## Features

- User authentication (JWT-based)
- Create public/private polls
- Vote on polls with expiration
- Real-time poll results
- Role-based access control
- Automatic poll expiration

## AI-Assisted Development

This project was developed with assistance from AI tools to enhance development speed and code quality:

### Tools Used
- **Amazon Q Developer**: Used for code generation, debugging, and architectural guidance
- **ChatGPT**: Assisted with documentation, API design patterns, and troubleshooting

### AI Contributions
- **Code Generation**: AI helped generate boilerplate code for entities, DTOs, and service methods
- **Error Resolution**: AI assisted in resolving TypeORM foreign key constraint issues and database relationship configurations
- **Documentation**: AI contributed to creating comprehensive API documentation and testing examples
- **Best Practices**: AI provided guidance on NestJS patterns, security implementations, and code structure
- **Debugging**: AI helped identify and fix issues with poll deletion cascading

### Development Impact
- **Speed**: Reduced development time by ~40% through automated code generation and quick problem resolution
- **Quality**: Improved code consistency and adherence to NestJS best practices
- **Learning**: Enhanced understanding of TypeORM relationships and NestJS architecture patterns


## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

### 1. Clone Repository
git clone <repository-url>
cd pollingsystem

### 2.  Install Dependencies
npm install

### 3. Database Setup
CREATE DATABASE polling;

### 4. Environment Configuration
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=polling
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s

### 5. Run Application
npm run start:dev
Application runs on http://localhost:3000

### 6. API Endpoints
# Authentication
POST /auth/register - Register user

POST /auth/login - Login user

# Polls
GET /polls - Get all polls

POST /polls - Create poll

GET /polls/:id - Get poll

PUT /polls/:id - Update poll

DELETE /polls/:id - Delete poll

POST /polls/:id/vote - Vote on poll

GET /polls/:id/results - Get results


### 7. Testing
# Register
curl -X POST http://localhost:3000/auth/register \
  -d '{"username":"admin","email":"admin@test.com","password":"password","role":"ADMIN"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -d '{"email":"admin@test.com","password":"password"}'

# Create Poll
curl -X POST http://localhost:3000/polls \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Test","options":["A","B"],"isPublic":true,"duration":60}'

### 7. Testing
# Register
curl -X POST http://localhost:3000/auth/register \
  -d '{"username":"admin","email":"admin@test.com","password":"password","role":"ADMIN"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -d '{"email":"admin@test.com","password":"password"}'

# Create Poll
curl -X POST http://localhost:3000/polls \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Test","options":["A","B"],"isPublic":true,"duration":60}'

# Update Poll
curl -X PATCH http://localhost:3000/polls/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Poll","duration":120}'

# Vote on Poll
curl -X POST http://localhost:3000/polls/1/vote \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"choice":"Option A"}'

# Get Poll Results
curl -X GET http://localhost:3000/polls/1/results \
  -H "Authorization: Bearer <token>"

# Delete Poll
curl -X DELETE http://localhost:3000/polls/1 \
  -H "Authorization: Bearer <token>"

# Create Private Poll
curl -X POST http://localhost:3000/polls \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Private Poll","options":["Yes","No"],"isPublic":false,"allowedUserIds":[2,3],"duration":30}'