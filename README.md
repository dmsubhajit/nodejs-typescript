# Node.js TypeScript Backend

## Features

- Express.js API with TypeScript
- PostgreSQL database using Sequelize ORM
- Dockerized for easy deployment
- CI/CD pipeline with GitHub Actions

## Getting Started

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in your PostgreSQL credentials.

```sh
cp .env.example .env
```

### 2. Run PostgreSQL Locally with Docker

You can start a PostgreSQL container for local development:

```sh
docker run --name postgres-db \ 
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=appdb \
  -p 5432:5432 \
  -d postgres:16 \
  -c 'password_encryption=md5' \
  -c 'listen_addresses=*'
```

Update your `.env` file to match these credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=appdb
```

### 3. Local Development

Install dependencies and run the app:

```sh
npm install
npm run build
npm start
```

### 4. Docker

Build and run the Docker container:

```sh
docker build -t node-backend .
docker run --env-file .env -p 3000:3000 node-backend
```

### 5. CI/CD

GitHub Actions workflow (`.github/workflows/cicd.yml`) builds and pushes Docker images to GHCR on every push to `main`.

## Project Structure

```
├── src/
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── utils/
├── test/
├── public/
├── dist/
├── .env.example
├── Dockerfile
├── .dockerignore
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Notes

- Ensure your PostgreSQL server is running and accessible.
- The Dockerfile uses a multi-stage build for smaller images and runs as a non-root user.
- The CI/CD pipeline tags images with the short commit SHA and branch name.
