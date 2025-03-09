# BlogSpace - Next.js & Express Blogging Platform

BlogSpace is a modern blogging platform built with Next.js, TypeScript, and Express. It features a clean, responsive UI using Shadcn UI components and Lucide icons.

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Shadcn UI
- Lucide Icons
- Tailwind CSS

### Backend
- Express.js
- MongoDB
- JWT Authentication

## Getting Started with Docker

This project is fully containerized with Docker, making it easy to set up and run in any environment.

### Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blogspace.git
   cd blogspace
   ```

2. Start the application stack:
   ```bash
   docker-compose up
   ```

3. The services will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - MongoDB: localhost:27017 (requires authentication)

### Development Mode

When running with Docker Compose, the application is set up with hot-reloading for both frontend and backend:

- Changes to the frontend code in the `./frontend` directory will be reflected immediately
- Changes to the backend code in the `./backend` directory will automatically restart the server

## Environment Variables

### Frontend Environment Variables
```
NEXT_PUBLIC_API_URL=http://backend:5000/api
```

### Backend Environment Variables
```
PORT=5000
MONGODB_URI=mongodb://root:rootpassword@mongodb:27017/blog_app?authSource=admin
JWT_SECRET=Mysecret12345
```

## Docker Architecture

The application consists of three Docker containers:

1. **MongoDB** - Database service
   - Persists data using Docker volumes
   - Protected with username/password authentication

2. **Backend** - Express API server
   - Connects to MongoDB
   - Provides authentication and data services
   - Exposes API endpoints on port 5000

3. **Frontend** - Next.js application
   - Serves the user interface
   - Communicates with the backend service
   - Available on port 3000

All services are connected through a Docker network called `app-network`.

## Features

- User authentication (signup, login, logout)
- Blog post creation and management
- Dashboard for managing user content
- Responsive design for mobile and desktop
- Dark/light mode support

## Stopping the Application

To stop the running containers:

```bash
docker-compose down
```

To stop and remove all containers, networks, and volumes:

```bash
docker-compose down -v
```

