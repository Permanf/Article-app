# NestJS REST API with Authentication and Caching

Develop a simple REST API using NestJS that includes authentication, CRUD operations, and data caching. The project should use PostgreSQL for data storage and Redis for caching.

## Features

- 🔐 JWT-based authentication (register/login)
- 📝 Article management (CRUD operations)
- 🗄 PostgreSQL database integration
- 🚀 Redis caching for improved performance
- 🐳 Dockerized environment
- 📑 TypeORM migrations
- ✅ Input validation
- 📊 Pagination & filtering

## Prerequisites

- Node.js v18+
- Docker & Docker Compose
- npm v9+
- PostgreSQL client (optional)
- Redis client (optional)

## Installation

1. **Clone repository**
```bash
git clone https://github.com/Permanf/Article-app.git
cd Article-app
```

2. **Install dependencies**
```bash
npm install
```

3.**Setup environment variables**
```bash
cp .env.example .env
```

4.**Start services**
```bash
docker-compose up -d
docker-compose down -v // To clear all data
docker exec -it article-app-postgres-1 psql -U postgres -d article_api // show database
```

5.**Start development server**
```bash
npm run start:dev
```

## API Documentation

1.**Authentication**
```bash
Endpoint	        Method	    Description	            Request Body Example
/auth/register	    POST	    Register new user	    {"email":"user@test.com","password":"password"}
/auth/login	        POST	    User login	            {"email":"user@test.com","password":"password"}

```

2.**Articles (Require JWT Authorization)**

```bash
Endpoint	    Method	    Description	                Query Params
/articles	    GET	        Get paginated articles	    page, limit, authorId, startDate, endDate
/articles/:id	GET	        Get single article	        -
/articles	    POST	    Create new article	        {"title":"...","description":"..."}
/articles/:id	PUT	        Update article	            {"title":"...","description":"..."}
/articles/:id	DELETE	    Delete article	            -

```